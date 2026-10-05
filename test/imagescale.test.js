const assert = require('node:assert/strict');
const test = require('node:test');
const { ComponentType, MessageFlags } = require('discord.js');
const Bot = require('../Bot');

const makeBot = () => new Bot('token', { put: async () => {} });
const interactionFor = (values = {}) => ({
    commandName: 'imagescale',
    options: {
        getNumber: (name) => values[name],
        getInteger: (name) => values[name]
    },
    replied: false,
    deferred: false,
    replies: [],
    followUps: [],
    isAutocomplete: () => false,
    isChatInputCommand: () => true,
    isMessageContextMenuCommand: () => false,
    isStringSelectMenu: () => false,
    async reply(payload) {
        this.replies.push(JSON.parse(JSON.stringify(payload)));
        this.replied = true;
    },
    async followUp(payload) {
        this.followUps.push(payload);
    },
    async editReply() {
        assert.fail(
            'Calculator cards must not be replaced with an error string'
        );
    }
});
const textOf = (payload) =>
    payload.components[0].components
        .filter((component) => component.type === ComponentType.TextDisplay)
        .map((component) => component.content)
        .join('\n');

test('imagescale returns a public card for an unbinned sensor without dimensions', async () => {
    const interaction = interactionFor({ pixelsize: 3.76, focallength: 800 });
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
    const text = textOf(payload);
    assert.match(text, /0\.9694 arcsec\/pixel/);
    assert.match(text, /3\.76 micrometers/);
    assert.match(text, /800 mm/);
    assert.match(text, /unbinned/i);
    assert.match(text, /reducer/i);
    assert.doesNotMatch(text, /\*\*Approximate field of view\*\*/);
    assert.ok(text.length <= 4000);
    assert.ok(payload.components[0].components.length + 1 <= 40);
});

test('imagescale calculates horizontal and vertical field of view with four decimal places', async () => {
    for (const [width, height, expected] of [
        [6248, 4176, '100.9515 x 67.4733 arcmin'],
        [4176, 6248, '67.4733 x 100.9515 arcmin'],
        [1, 1, '0.0162 x 0.0162 arcmin']
    ]) {
        const interaction = interactionFor({
            pixelsize: 3.76,
            focallength: 800,
            width,
            height
        });
        await makeBot().onInteraction(interaction);
        assert.equal(interaction.replies.length, 1);
        assert.equal(interaction.replies[0].flags, MessageFlags.IsComponentsV2);
        const text = textOf(interaction.replies[0]);
        assert.ok(text.includes(expected));
        assert.ok(text.includes(`${width} x ${height} pixels`));
        assert.match(text, /horizontal x vertical/i);
    }
});

test('imagescale treats null optional dimensions as omitted', async () => {
    const interaction = interactionFor({
        pixelsize: 5,
        focallength: 1000,
        width: null,
        height: null
    });
    await makeBot().onInteraction(interaction);
    assert.match(textOf(interaction.replies[0]), /1\.0313 arcsec\/pixel/);
});

test('imagescale accepts the largest safe integer in either sensor dimension', async () => {
    for (const [width, height] of [
        [Number.MAX_SAFE_INTEGER, 1],
        [1, Number.MAX_SAFE_INTEGER]
    ]) {
        const interaction = interactionFor({
            pixelsize: 3.76,
            focallength: 800,
            width,
            height
        });
        await makeBot().onInteraction(interaction);
        assert.equal(interaction.replies[0].flags, MessageFlags.IsComponentsV2);
        const text = textOf(interaction.replies[0]);
        assert.ok(text.includes(`${width} x ${height} pixels`));
        assert.doesNotMatch(text, /NaN|Infinity/);
        assert.ok(text.length <= 4000);
    }
});

test('imagescale privately rejects invalid inputs through the bot', async () => {
    const valid = { pixelsize: 3.76, focallength: 800 };
    const cases = [];
    for (const name of ['pixelsize', 'focallength']) {
        for (const value of [
            undefined,
            null,
            0,
            -1,
            NaN,
            Infinity,
            -Infinity,
            '3.76'
        ]) {
            cases.push([
                { ...valid, [name]: value },
                /pixel size and focal length.*positive.*finite/i
            ]);
        }
    }
    for (const name of ['width', 'height']) {
        cases.push([{ ...valid, [name]: 100 }, /both width and height/i]);
        for (const value of [
            0,
            -1,
            1.5,
            NaN,
            Infinity,
            -Infinity,
            '100',
            Number.MAX_SAFE_INTEGER + 1
        ]) {
            cases.push([
                { ...valid, width: 100, height: 100, [name]: value },
                /dimensions.*positive.*integer/i
            ]);
        }
    }
    for (const [values, message] of cases) {
        const interaction = interactionFor(values);
        await makeBot().onInteraction(interaction);
        assert.equal(interaction.replies.length, 1);
        const payload = interaction.replies[0];
        assert.equal(payload.flags, MessageFlags.Ephemeral);
        assert.equal(payload.components, undefined);
        assert.match(payload.content, message);
        assert.deepEqual(payload.allowedMentions, { parse: [] });
    }
});

test('imagescale privately rejects overflowing or underflowing results', async () => {
    for (const values of [
        { pixelsize: Number.MAX_VALUE, focallength: Number.MIN_VALUE },
        { pixelsize: Number.MIN_VALUE, focallength: Number.MAX_VALUE },
        {
            pixelsize: 1e300,
            focallength: 1,
            width: Number.MAX_SAFE_INTEGER,
            height: 1
        },
        {
            pixelsize: 1e300,
            focallength: 1,
            width: 1,
            height: Number.MAX_SAFE_INTEGER
        }
    ]) {
        const interaction = interactionFor(values);
        await makeBot().onInteraction(interaction);
        assert.equal(interaction.replies.length, 1);
        assert.equal(interaction.replies[0].flags, MessageFlags.Ephemeral);
        assert.match(interaction.replies[0].content, /numeric range/i);
    }
});

test('imagescale delivery failures use private replies or follow-ups without editing the card', async () => {
    for (const acknowledged of [false, true]) {
        const interaction = interactionFor({
            pixelsize: 3.76,
            focallength: 800
        });
        interaction.reply = async function (payload) {
            if (payload.content) {
                this.replies.push(payload);
                return;
            }
            this.replied = acknowledged;
            throw new Error('Simulated calculator delivery failure');
        };
        await makeBot().onInteraction(interaction);
        const errors = acknowledged
            ? interaction.followUps
            : interaction.replies;
        assert.equal(errors.length, 1);
        assert.equal(errors[0].flags, MessageFlags.Ephemeral);
        assert.match(errors[0].content, /unexpected error/);
    }
});
