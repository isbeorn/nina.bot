const assert = require('node:assert/strict');
const test = require('node:test');
const { ComponentType, MessageFlags } = require('discord.js');
const Bot = require('../Bot');

const lessonIds = [
    'overview',
    'first-expression',
    'symbols',
    'variables',
    'scope',
    'functions',
    'decisions',
    'time',
    'recipes',
    'troubleshooting'
];
const makeBot = () => new Bot('token', { put: async () => {} });
const serialize = (value) => JSON.parse(JSON.stringify(value));
const descendants = (components) =>
    components.flatMap((component) => [
        component,
        ...descendants(component.components || [])
    ]);
const textOf = (payload) =>
    descendants(payload.components)
        .filter((component) => component.type === ComponentType.TextDisplay)
        .map((component) => component.content)
        .join('\n');
const menuOf = (payload) =>
    descendants(payload.components).find(
        (component) => component.type === ComponentType.StringSelect
    );
const buttonOf = (payload, label) =>
    descendants(payload.components).find(
        (component) =>
            component.type === ComponentType.Button && component.label === label
    );
const interactionFor = (kind = 'command', customId, values) => ({
    commandName: kind === 'command' ? 'expressions' : undefined,
    customId,
    values,
    deferred: false,
    replied: false,
    replies: [],
    updates: [],
    followUps: [],
    isAutocomplete: () => false,
    isChatInputCommand: () => kind === 'command',
    isMessageContextMenuCommand: () => false,
    isStringSelectMenu: () => kind === 'select',
    isButton: () => kind === 'button',
    async reply(payload) {
        this.replies.push(serialize(payload));
        this.replied = true;
    },
    async update(payload) {
        this.updates.push(serialize(payload));
        this.replied = true;
    },
    async followUp(payload) {
        this.followUps.push(serialize(payload));
    },
    async editReply() {
        assert.fail('Never replace a guide card with an error string');
    }
});

const selectLesson = async (id, bot = makeBot()) => {
    const interaction = interactionFor('select', 'expressions:topic:v1', [id]);
    await bot.onInteraction(interaction);
    assert.equal(interaction.replies.length, 0);
    assert.equal(interaction.updates.length, 1);
    assert.equal(interaction.followUps.length, 0);
    return interaction.updates[0];
};

test('/expressions opens a private 3.3 guide with all ten topics', async () => {
    const interaction = interactionFor();
    await makeBot().onInteraction(interaction);
    assert.equal(interaction.replies.length, 1);
    const payload = interaction.replies[0];
    assert.equal(
        payload.flags,
        MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
    );
    assert.equal(payload.content, undefined);
    assert.equal(payload.embeds, undefined);
    assert.match(textOf(payload), /N.I.N.A. 3.3/);
    assert.match(textOf(payload), /private/i);
    assert.deepEqual(
        menuOf(payload).options.map((option) => option.value),
        lessonIds
    );
    assert.equal(
        menuOf(payload).options.find((option) => option.default).value,
        'overview'
    );
});

test('all guide lessons serialize within Discord limits with unique controls and valid destinations', async () => {
    for (const [index, id] of lessonIds.entries()) {
        const payload = await selectLesson(id);
        // Updates preserve the original message's ephemeral visibility.
        assert.equal(payload.flags, MessageFlags.IsComponentsV2);
        assert.equal(payload.content, undefined);
        assert.equal(payload.embeds, undefined);
        assert.deepEqual(payload.allowedMentions, { parse: [] });
        assert.equal(
            payload.components.filter(
                (component) => component.type === ComponentType.Container
            ).length,
            1
        );
        assert.equal(payload.components[0].accent_color, 0x4f8fcb);
        const all = descendants(payload.components);
        assert.ok(all.length <= 40);
        assert.ok(textOf(payload).length <= 4000);
        const customIds = all
            .filter((component) => component.custom_id)
            .map((component) => component.custom_id);
        assert.equal(new Set(customIds).size, customIds.length, id);
        assert.ok(customIds.every((customId) => customId.length <= 100));
        const menu = menuOf(payload);
        assert.equal(menu.custom_id, 'expressions:topic:v1');
        assert.deepEqual(
            menu.options.map((option) => option.value),
            lessonIds
        );
        assert.equal(menu.options.filter((option) => option.default).length, 1);
        assert.equal(menu.options.find((option) => option.default).value, id);
        assert.ok(menu.options.length <= 25);
        assert.ok(menu.options.every((option) => option.label.length <= 100));
        for (const [label, destination, disabled, action] of [
            [
                'Previous',
                lessonIds[Math.max(0, index - 1)],
                index === 0,
                'previous'
            ],
            [
                'Next',
                lessonIds[Math.min(lessonIds.length - 1, index + 1)],
                index === lessonIds.length - 1,
                'next'
            ],
            ['Overview', 'overview', index === 0, 'overview']
        ]) {
            const button = buttonOf(payload, label);
            assert.equal(
                button.custom_id,
                `expressions:page:v1:${destination}:${action}`
            );
            assert.equal(button.disabled, disabled);
        }
        const links = all.filter(
            (component) =>
                component.type === ComponentType.Button && component.style === 5
        );
        assert.deepEqual(
            links.map((button) => button.url),
            ['https://nighttime-imaging.eu/docs/develop/site/']
        );
        for (const row of all.filter(
            (component) => component.type === ComponentType.ActionRow
        ))
            assert.ok(row.components.length <= 5);
    }
});

test('Next and Previous traverse every lesson and Overview returns home from every lesson', async () => {
    let payload = await selectLesson('overview');
    for (const [label, destinations] of [
        ['Next', lessonIds.slice(1)],
        ['Previous', lessonIds.slice(0, -1).reverse()]
    ]) {
        for (const destination of destinations) {
            const control = buttonOf(payload, label);
            assert.equal(control.disabled, false);
            const interaction = interactionFor('button', control.custom_id);
            // A fresh bot can handle each message without a stored browser session.
            await makeBot().onInteraction(interaction);
            assert.equal(interaction.replies.length, 0);
            assert.equal(interaction.updates.length, 1);
            payload = interaction.updates[0];
            assert.equal(
                menuOf(payload).options.find((option) => option.default).value,
                destination
            );
        }
    }
    for (const id of lessonIds.slice(1)) {
        const page = await selectLesson(id);
        const interaction = interactionFor(
            'button',
            buttonOf(page, 'Overview').custom_id
        );
        await makeBot().onInteraction(interaction);
        assert.equal(
            menuOf(interaction.updates[0]).options.find(
                (option) => option.default
            ).value,
            'overview'
        );
    }
});

test('independent guide messages do not share a current page', async () => {
    const bot = makeBot();
    const first = await selectLesson('symbols', bot);
    await selectLesson('time', bot);
    const interaction = interactionFor(
        'button',
        buttonOf(first, 'Next').custom_id
    );
    await bot.onInteraction(interaction);
    assert.equal(
        menuOf(interaction.updates[0]).options.find((option) => option.default)
            .value,
        'variables'
    );
});

test('unknown lessons and malformed navigation receive private acknowledgments without updating cards', async () => {
    const interactions = [
        ...[
            undefined,
            null,
            [],
            ['missing'],
            ['symbols', 'time'],
            ['toString'],
            [1],
            'symbols'
        ].map((values) =>
            interactionFor('select', 'expressions:topic:v1', values)
        ),
        ...[
            'missing:next',
            ':next',
            'symbols',
            'symbols:delete',
            'symbols:next:extra',
            'toString:next'
        ].map((value) =>
            interactionFor('button', `expressions:page:v1:${value}`)
        )
    ];
    for (const interaction of interactions) {
        await makeBot().onInteraction(interaction);
        assert.equal(interaction.updates.length, 0);
        assert.equal(interaction.replies.length, 1);
        assert.equal(interaction.replies[0].flags, MessageFlags.Ephemeral);
        assert.match(interaction.replies[0].content, /\/expressions/);
        assert.deepEqual(interaction.replies[0].allowedMentions, { parse: [] });
    }
});

test('unrelated component IDs and mismatched control types are ignored', async () => {
    for (const [kind, customId] of [
        ['select', 'unrelated:topic'],
        ['button', 'unrelated:button'],
        ['button', 'expressions:topic:v1'],
        ['select', 'expressions:page:v1:symbols:next']
    ]) {
        const interaction = interactionFor(kind, customId, ['symbols']);
        await makeBot().onInteraction(interaction);
        assert.equal(
            interaction.replies.length +
                interaction.updates.length +
                interaction.followUps.length,
            0
        );
    }
});

test('guide failures before and after acknowledgment never replace cards with plain text', async () => {
    for (const kind of ['command', 'select', 'button']) {
        for (const acknowledgment of [
            'none',
            'replied',
            ...(kind === 'command' ? [] : ['deferred'])
        ]) {
            const interaction = interactionFor(
                kind,
                kind === 'select'
                    ? 'expressions:topic:v1'
                    : 'expressions:page:v1:symbols:next',
                ['symbols']
            );
            interaction[kind === 'command' ? 'reply' : 'update'] =
                async function (payload) {
                    if (payload.content) {
                        this.replies.push(serialize(payload));
                        return;
                    }
                    this.replied = acknowledgment === 'replied';
                    this.deferred = acknowledgment === 'deferred';
                    throw new Error('Simulated guide delivery failure');
                };
            await makeBot().onInteraction(interaction);
            const errors =
                acknowledgment === 'none'
                    ? interaction.replies
                    : interaction.followUps;
            assert.equal(errors.length, 1);
            assert.equal(errors[0].flags, MessageFlags.Ephemeral);
            assert.match(errors[0].content, /unexpected error/);
        }
    }
});

test('lessons contain standalone examples, expectations and the critical 3.3 distinctions', async () => {
    const required = {
        'first-expression': [
            /Take Exposure/,
            /```text\n30 \* 2\n```/,
            /60 seconds/,
            /braces/i,
            /30 \* 3/
        ],
        symbols: [
            /Define Constant/,
            /ExposureSeconds/,
            /Camera\.Temperature/,
            /connected/i,
            /sidebar/i,
            /quoted/i,
            /read-only/i
        ],
        variables: [
            /Define Variable/,
            /Set Variable/,
            /Initially/,
            /Currently/,
            /execute/i,
            /FrameCount \+ 1/,
            /captur/i
        ],
        scope: [
            /Define Scoped Variable/,
            /nested/i,
            /nearer/i,
            /Camera_Temperature/,
            /Camera\.Temperature/,
            /Sequence layout.*not an expression/i
        ],
        functions: [
            /Math\.Clamp\(15, 1, 10\)/,
            /Math\.Round\(3\.222, 2\)/,
            /Math\.Between\(5, 1, 10\)/,
            /inclusive/i,
            /arguments/i,
            /3\.22/
        ],
        decisions: [
            /Logic\.If\(1 < 2, 60, 120\)/,
            /String\.Contains\('HaRGB', 'Ha'\)/,
            /case-sensitive/i,
            /Conditional Instruction Set/,
            /Loop While/,
            /interrupt/i
        ],
        time: [
            /Define Variable/,
            /RunStarted/,
            /Set Variable/,
            /Time\.Now\(\)/,
            /Time\.SecondsSince\(RunStarted\)/,
            /Time\.AddMinutes\(RunStarted, 10\)/,
            /Unix seconds/,
            /local time/,
            /dependency/
        ],
        recipes: [
            /ExposureSeconds/,
            /FrameCount/,
            /RunStarted/,
            /```text\nExposureSeconds \* 2\n```/,
            /```text\nFrameCount \+ 1\n```/,
            /```text\nTime\.SecondsSince\(RunStarted\) >= 10\n```/,
            /Set Variable/,
            /Loop For Iterations/,
            /outside/i,
            /Sequence layouts.*not expressions/i
        ],
        troubleshooting: [
            /undefined/i,
            /ambiguous/i,
            /not evaluated/i,
            /scope/i,
            /connect/i,
            /syntax/i,
            /range/i,
            /orange/i,
            /red/i,
            /tooltip/i
        ]
    };
    for (const [id, patterns] of Object.entries(required)) {
        const text = textOf(await selectLesson(id));
        for (const pattern of patterns) assert.match(text, pattern, id);
        if (id !== 'troubleshooting') {
            assert.match(text, /where|setup/i, id);
            assert.match(text, /expect/i, id);
            assert.match(text, /try/i, id);
        }
    }
});
