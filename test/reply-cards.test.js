const assert = require('node:assert/strict');
const test = require('node:test');
const { URL } = require('node:url');
const {
    MessageFlags,
    ComponentType,
    SlashCommandBuilder
} = require('discord.js');
const Bot = require('../Bot');
const registeredCommands = require('./fixtures/application-commands.json');

const categories = {
    guides: [
        'docs',
        'devdocs',
        'dock',
        'stars',
        'stellarium',
        'profiles',
        'cmd',
        'convert',
        'imagescale',
        'plugins',
        'backup',
        'download',
        'help'
    ],
    troubleshooting: [
        'support',
        'logs',
        'troubleshoot',
        'crash',
        'memorydump',
        'repair',
        'renderissues',
        'installertroubleshoot',
        'net7',
        'platesolve'
    ],
    equipment: [
        '32bitascom',
        'conform',
        'domeshutter',
        'd3xxx',
        'qhydriver',
        'cameratimeout',
        'settlefailed',
        'dither',
        'flats'
    ],
    autofocus: [
        'afreport',
        'afgraph',
        'overshoot',
        'shutdown',
        'autofocus',
        'meridianflip',
        'sequencer',
        'expressions'
    ],
    community: [
        'repository',
        'ninadocs',
        'issues',
        'donate',
        'discordpatreon',
        'privacy'
    ]
};
const generalNames = Object.values(categories)
    .flat()
    .filter(
        (name) =>
            ![
                'convert',
                'help',
                'afgraph',
                'imagescale',
                'expressions'
            ].includes(name)
    );
const makeBot = () => new Bot('token', { put: async () => {} });
const serialize = (payload) => JSON.parse(JSON.stringify(payload));
const descendants = (components) =>
    components.flatMap((component) => [
        component,
        ...descendants(component.components || [])
    ]);
const textOf = (payload) =>
    descendants(serialize(payload).components)
        .filter((component) => component.type === ComponentType.TextDisplay)
        .map((component) => component.content)
        .join('\n');
const menuOf = (payload) =>
    descendants(serialize(payload).components).find(
        (component) => component.type === ComponentType.StringSelect
    );
const interactionFor = (commandName, selection) => ({
    commandName,
    customId: selection === undefined ? undefined : 'help:category:v1',
    values: selection === undefined ? undefined : [selection],
    deferred: false,
    replied: false,
    replies: [],
    updates: [],
    followUps: [],
    isAutocomplete: () => false,
    isChatInputCommand: () => selection === undefined,
    isMessageContextMenuCommand: () => false,
    isStringSelectMenu: () => selection !== undefined,
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
        assert.fail('Cards must not be edited with an error string');
    }
});

test('registration preserves the complete slash and context command contract', () => {
    const bot = makeBot();
    const actual = serialize(bot.getSlashCommands()).sort((a, b) =>
        a.name.localeCompare(b.name)
    );
    assert.deepEqual(actual, registeredCommands);
    assert.equal(actual.filter((command) => command.type === 1).length, 46);
    assert.equal(actual.filter((command) => command.type === 3).length, 1);
    assert.equal(new Set(Object.values(categories).flat()).size, 46);
    assert.equal(bot.getClient().options.intents.has('MessageContent'), false);
    assert.equal(bot.getClient().listenerCount('messageCreate'), 0);
});

for (const name of generalNames) {
    test(`/${name} renders one public Components V2 card through the bot`, async () => {
        const interaction = interactionFor(name);
        await makeBot().onInteraction(interaction);
        assert.equal(interaction.replies.length, 1);
        const payload = interaction.replies[0];
        assert.equal(payload.flags, MessageFlags.IsComponentsV2);
        assert.equal(payload.content, undefined);
        assert.equal(payload.embeds, undefined);
        assert.deepEqual(payload.allowedMentions, { parse: [] });
        assert.equal(payload.components.length, 1);
        assert.equal(payload.components[0].type, ComponentType.Container);
        assert.equal(payload.components[0].accent_color, 0x4f8fcb);
        assert.match(textOf(payload), /^## \S/);
        const all = descendants(payload.components);
        assert.ok(all.length <= 40);
        assert.ok(textOf(payload).length <= 4000);
        for (const component of all) {
            if (component.type === ComponentType.ActionRow)
                assert.ok(component.components.length <= 5);
            if (component.type === ComponentType.Button) {
                assert.equal(component.style, 5);
                assert.equal(component.custom_id, undefined);
                assert.ok(
                    component.label.length > 0 && component.label.length <= 80
                );
                assert.equal(new URL(component.url).protocol, 'https:');
                assert.ok(component.url.length <= 512);
            }
            if (component.type === ComponentType.MediaGallery) {
                assert.ok(
                    component.items.length > 0 && component.items.length <= 10
                );
                for (const item of component.items) {
                    assert.ok(
                        item.description.length > 0 &&
                            item.description.length <= 1024
                    );
                    assert.equal(new URL(item.media.url).protocol, 'https:');
                }
            }
        }
    });
}

test('representative cards retain paths, steps, technical details and resources', async () => {
    const expectations = {
        logs: [
            /```text\n%LOCALAPPDATA%\\NINA\\Logs\n```/,
            /Options > General > Advanced settings > Log Level/,
            /[Dd]rag/
        ],
        profiles: [/%LOCALAPPDATA%\\NINA\\Profiles/, /XML/, /updat/i],
        support: [
            /hardware/i,
            /driver/i,
            /reproduce/i,
            /expected/i,
            /actual/i,
            /screenshot/i,
            /%LOCALAPPDATA%\\NINA\\Logs/
        ],
        cameratimeout: [
            /cable/i,
            /power/i,
            /USB 3\.0/,
            /USB Limit/,
            /firmware/i,
            /CPU/,
            /RAM/,
            /log file/
        ],
        repair: [
            /1\. Close N.I.N.A./,
            /Add or remove programs/,
            /Modify/,
            /Repair/
        ],
        cmd: [
            /--profileid/,
            /--sequencefile/,
            /--runsequence/,
            /--exitaftersequence/,
            /--debug/,
            /--disable-hardware-acceleration/,
            /--help/,
            /--version/
        ],
        memorydump: [
            /```text\nprocdump.exe -ma NINA.exe\n```/,
            /sysinternals\/downloads\/procdump/
        ],
        crash: [/%LOCALAPPDATA%\\NINA\\CrashDump/, /event-viewer/],
        afreport: [
            /%LOCALAPPDATA%\\NINA\\AutoFocus/,
            /\/afgraph/,
            /Analyze Autofocus Report/
        ],
        net7: [/N.I.N.A. 3.x/, /Desktop Runtime 7.x/, /dotnet\/7.0/],
        domeshutter: [
            /open or close/,
            /start moving/,
            /rain/,
            /vendor/i,
            /Principles.htm/,
            /message\/3579/,
            /812466133608300544/
        ],
        shutdown: [
            /external script/i,
            /shutdown/,
            /devenv_2022-01-23_02-09-42.mp4/
        ],
        stars: [/deep sky/, /Manual Focus Targets/, /altitude/, /stars.png/],
        overshoot: [/same direction/, /nina-af.gif/],
        renderissues: [/Nahimic Service/, /services.msc/, /disablenahimic.png/],
        dock: [/OEJUya9_LWA/],
        stellarium: [/v2gROUlPRhw/]
    };
    const bot = makeBot();
    for (const [name, patterns] of Object.entries(expectations)) {
        const interaction = interactionFor(name);
        await bot.onInteraction(interaction);
        const payload = interaction.replies[0];
        const visible =
            textOf(payload) + '\n' + JSON.stringify(payload.components);
        for (const pattern of patterns) assert.match(visible, pattern, name);
        if (['stars', 'overshoot', 'renderissues', 'net7'].includes(name)) {
            assert.ok(
                descendants(payload.components).some(
                    (component) => component.type === ComponentType.MediaGallery
                ),
                name
            );
        }
        if (['shutdown', 'dock', 'stellarium'].includes(name)) {
            assert.equal(
                descendants(payload.components).some(
                    (component) => component.type === ComponentType.MediaGallery
                ),
                false,
                name
            );
        }
    }
});

test('new guidance cards cover setup, troubleshooting and official resources', async () => {
    const expectations = {
        platesolve: [
            /star database/i,
            /effective focal length/i,
            /blind solver/i,
            /focus/i,
            /exposure/i,
            /```text\n%LOCALAPPDATA%\\NINA\\PlateSolver\\Failed\n```/,
            /Sync/,
            /Reslew To Target/,
            /advanced\/platesolving/
        ],
        autofocus: [
            /built-in.*Star HFR/,
            /plugins/i,
            /Horizontal axis/,
            /Vertical axis/,
            /fitted minimum/i,
            /Step Size/,
            /Initial Offset Steps/,
            /R-squared/,
            /final HFR/,
            /\/afreport/,
            /\/afgraph/,
            /\/overshoot/,
            /advanced\/autofocus/
        ],
        meridianflip: [
            /Meridian Flip.*trigger/,
            /Max\. minutes after meridian/i,
            /Pause before meridian/,
            /mount driver/i,
            /clearance/,
            /recenter/i,
            /advanced\/meridianflip/
        ],
        plugins: [
            /Plugins > Available/,
            /Install/,
            /Update/,
            /Restart/,
            /compatible/i,
            /uninstall/i,
            /maintainer/,
            /tabs\/plugins\/installed/
        ],
        dither: [
            /Enable Server/,
            /guide-camera pixels/,
            /imaging-camera pixels/,
            /Scale/,
            /Pixel tolerance/,
            /Minimum settle time/,
            /Settle timeout/,
            /\/settlefailed/,
            /advanced\/dithering/
        ],
        flats: [
            /Dynamic Exposure/,
            /Dynamic Brightness/,
            /Sky Flats/,
            /Histogram Mean Target/,
            /Mean Tolerance/,
            /minimum.*maximum/,
            /Too bright/,
            /Too dark/,
            /dark-flat capture is unavailable/,
            /tabs\/flatwizard/
        ],
        sequencer: [
            /\/expressions/,
            /Instructions/,
            /Loop conditions/,
            /Triggers/,
            /Parent conditions/,
            /invalid instructions are skipped/,
            /```text\nDeep Sky Object instruction set/,
            /Loop condition:.*\n.*Trigger:.*\n.*Instruction:/,
            /sequencer\/advanced\/advanced/
        ],
        backup: [
            /close N.I.N.A./i,
            /```text\n%LOCALAPPDATA%\\NINA\\Profiles\n```/,
            /configurable/,
            /separate files/,
            /Restore/,
            /destination files/,
            /verify folder paths/,
            /tabs\/options\/imaging/
        ],
        download: [
            /Stable release/,
            /Beta.*release candidate/,
            /Nightly/,
            /version you are installing/,
            /\.NET Desktop Runtime version and architecture/,
            /\/backup/,
            /\/docs\/master\/site\/requirements\//,
            /\/docs\/develop\/site\/requirements\//
        ]
    };
    const bot = makeBot();
    for (const [name, patterns] of Object.entries(expectations)) {
        const interaction = interactionFor(name);
        await bot.onInteraction(interaction);
        const payload = interaction.replies[0];
        const visible =
            textOf(payload) + '\n' + JSON.stringify(payload.components);
        for (const pattern of patterns) assert.match(visible, pattern, name);
        const buttons = descendants(payload.components).filter(
            (component) => component.type === ComponentType.Button
        );
        assert.ok(buttons.length > 0, name);
        for (const button of buttons)
            assert.equal(new URL(button.url).hostname, 'nighttime-imaging.eu');
        if (name === 'download') {
            assert.ok(
                buttons.some(
                    (button) =>
                        button.url === 'https://nighttime-imaging.eu/download/'
                )
            );
            assert.doesNotMatch(visible, /\.exe|\.msi|Version \d|Runtime \d/);
        }
    }
});

test('privacy resolves the configured URL on every request', async () => {
    const original = process.env.PRIVACY_POLICY_URL;
    const bot = makeBot();
    try {
        for (const value of [
            undefined,
            'https://example.com/privacy',
            '',
            undefined
        ]) {
            if (value === undefined) delete process.env.PRIVACY_POLICY_URL;
            else process.env.PRIVACY_POLICY_URL = value;
            const interaction = interactionFor('privacy');
            await bot.onInteraction(interaction);
            const button = descendants(interaction.replies[0].components).find(
                (component) => component.type === ComponentType.Button
            );
            assert.equal(
                button.url,
                value ||
                    'https://github.com/isbeorn/nina.bot/blob/master/PRIVACY.md'
            );
        }
    } finally {
        if (original === undefined) delete process.env.PRIVACY_POLICY_URL;
        else process.env.PRIVACY_POLICY_URL = original;
    }
});

test('help opens privately and navigates every category in both directions and back home', async () => {
    const bot = makeBot();
    const initial = interactionFor('help');
    await bot.onInteraction(initial);
    assert.equal(
        initial.replies[0].flags,
        MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
    );
    assert.match(textOf(initial.replies[0]), /\/logs/);
    assert.match(textOf(initial.replies[0]), /\/support/);
    assert.match(
        textOf(initial.replies[0]),
        /\/expressions opens a private learning guide/
    );
    assert.equal(menuOf(initial.replies[0]).custom_id, 'help:category:v1');
    assert.deepEqual(
        menuOf(initial.replies[0]).options.map((option) => option.value),
        ['overview', ...Object.keys(categories)]
    );
    for (const category of [
        ...Object.keys(categories),
        ...Object.keys(categories).reverse(),
        'overview'
    ]) {
        const interaction = interactionFor(undefined, category);
        await bot.onInteraction(interaction);
        assert.equal(interaction.replies.length, 0);
        assert.equal(interaction.updates.length, 1);
        const payload = interaction.updates[0];
        assert.equal(
            menuOf(payload).options.find((option) => option.default).value,
            category
        );
        assert.equal(payload.content, undefined);
        assert.equal(payload.embeds, undefined);
        const text = textOf(payload);
        assert.ok(text.length <= 4000);
        assert.ok(descendants(payload.components).length <= 40);
        if (category !== 'overview') {
            const names = [...text.matchAll(/`\/([a-z0-9]+)`/g)].map(
                (match) => match[1]
            );
            assert.deepEqual(names.sort(), [...categories[category]].sort());
            for (const name of names)
                assert.ok(
                    text.includes(
                        registeredCommands.find(
                            (command) => command.name === name
                        ).description
                    )
                );
        }
        if (category === 'autofocus')
            assert.match(text, /Apps > Analyze Autofocus Report/);
    }
});

test('help reads actual registrations without executing the listed commands', async () => {
    const bot = makeBot();
    bot.registerCommand({
        category: 'guides',
        getApplicationCommands: () => [
            new SlashCommandBuilder()
                .setName('example')
                .setDescription('An added command')
        ],
        process: () => assert.fail('Browsing help must not run commands')
    });
    const interaction = interactionFor(undefined, 'guides');
    await bot.onInteraction(interaction);
    assert.match(
        textOf(interaction.updates[0]),
        /`\/example`.*An added command/
    );
});

test('invalid help selections are acknowledged privately without replacing the card', async () => {
    for (const values of [
        ['missing'],
        [],
        ['guides', 'equipment'],
        ['toString']
    ]) {
        const interaction = interactionFor(undefined, 'missing');
        interaction.values = values;
        await makeBot().onInteraction(interaction);
        assert.equal(interaction.updates.length, 0);
        assert.equal(interaction.replies.length, 1);
        assert.equal(interaction.replies[0].flags, MessageFlags.Ephemeral);
        assert.match(interaction.replies[0].content, /\/help/);
    }
});

test('unrelated selectors are ignored', async () => {
    const interaction = interactionFor(undefined, 'guides');
    interaction.customId = 'another:menu';
    await makeBot().onInteraction(interaction);
    assert.equal(interaction.replies.length + interaction.updates.length, 0);
});

test('card and menu failures use private replies or follow-ups without editing cards', async () => {
    for (const [commandName, selection] of [
        ['help', undefined],
        ['help', 'guides'],
        ['platesolve', undefined]
    ]) {
        for (const acknowledged of [false, true]) {
            const interaction = interactionFor(commandName, selection);
            interaction[selection === undefined ? 'reply' : 'update'] =
                async function (payload) {
                    if (payload.content) {
                        this.replies.push(payload);
                        return;
                    }
                    this.replied = acknowledged;
                    throw new Error('Simulated delivery failure');
                };
            await makeBot().onInteraction(interaction);
            const errors = acknowledged
                ? interaction.followUps
                : interaction.replies;
            assert.equal(errors.length, 1);
            assert.equal(errors[0].flags, MessageFlags.Ephemeral);
            assert.match(errors[0].content, /unexpected error/);
        }
    }
});

test('deferred menu failures send a private follow-up without editing the original card', async () => {
    const interaction = interactionFor(undefined, 'guides');
    interaction.update = async function () {
        this.deferred = true;
        throw new Error('Simulated deferred menu failure');
    };
    await makeBot().onInteraction(interaction);
    assert.equal(interaction.replies.length, 0);
    assert.equal(interaction.followUps.length, 1);
    assert.equal(interaction.followUps[0].flags, MessageFlags.Ephemeral);
});

test('conversion and autocomplete still route through the bot', async () => {
    const bot = makeBot();
    const conversion = interactionFor('convert');
    conversion.options = {
        getNumber: () => 32,
        getString: (name) => (name === 'from' ? 'F' : 'C')
    };
    await bot.onInteraction(conversion);
    assert.deepEqual(conversion.replies, ['32F = 0C']);

    const autocomplete = interactionFor('convert');
    autocomplete.isChatInputCommand = () => false;
    autocomplete.isAutocomplete = () => true;
    autocomplete.options = { getFocused: () => 'arc' };
    autocomplete.respond = async (choices) => {
        autocomplete.choices = choices;
    };
    await bot.onInteraction(autocomplete);
    assert.ok(autocomplete.choices.length > 0);
    assert.ok(
        autocomplete.choices.every((choice) => choice.value.includes('arc'))
    );

    autocomplete.options.getFocused = () => {
        throw new Error('Simulated autocomplete failure');
    };
    await bot.onInteraction(autocomplete);
    assert.deepEqual(autocomplete.choices, []);
    assert.equal(autocomplete.replies.length, 0);
});

test('autofocus context errors still complete the deferred response', async () => {
    const interaction = interactionFor('Analyze Autofocus Report');
    interaction.isChatInputCommand = () => false;
    interaction.isMessageContextMenuCommand = () => true;
    interaction.deferReply = async () => {
        interaction.deferred = true;
    };
    interaction.targetMessage = { attachments: [] };
    interaction.editReply = async (payload) => {
        interaction.edited = payload;
    };
    await makeBot().onInteraction(interaction);
    assert.equal(interaction.deferred, true);
    assert.equal(
        interaction.edited,
        'Please provide a N.I.N.A. autofocus JSON report attachment.'
    );
    assert.equal(interaction.replies.length, 0);
});
