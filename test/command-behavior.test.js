const assert = require('node:assert/strict');
const test = require('node:test');

const Bot = require('../Bot');
const { HelpCommand } = require('../commands/HelpCommand');
const MessageCommands = require('../commands/MessageCommands');
const { UnitConversionCommand } = require('../commands/MessageCommands/UnitConversionCommand');

const createReplyTarget = () => {
    const replies = [];
    return {
        replies,
        async reply(payload) {
            replies.push(payload);
        }
    };
};

test('bot registers slash and context menu commands without message content intent', () => {
    const bot = new Bot('token', { put: async () => {} });
    const commands = bot.getSlashCommands().map((command) => command.toJSON());
    const commandNames = commands.map((command) => command.name);

    assert.ok(commandNames.includes('afgraph'));
    assert.ok(commandNames.includes('Analyze Autofocus Report'));
    assert.ok(commandNames.includes('convert'));
    assert.ok(commandNames.includes('help'));
    assert.ok(commandNames.includes('privacy'));
    assert.equal(commandNames.includes('kg'), false);
    assert.equal(commandNames.includes('lbs'), false);
    assert.equal(
        bot
            .getClient()
            .options.intents.has('MessageContent'),
        false
    );
});

test('bot routes chat input interactions to matching commands', async () => {
    const bot = new Bot('token', { put: async () => {} });
    const interaction = {
        commandName: 'privacy',
        isChatInputCommand: () => true,
        isAutocomplete: () => false,
        isMessageContextMenuCommand: () => false,
        replies: [],
        async reply(payload) {
            this.replies.push(payload);
        }
    };

    await bot.onInteraction(interaction);

    assert.equal(interaction.replies.length, 1);
    assert.match(interaction.replies[0], /PRIVACY\.md/);
});

test('bot reports command failures to the interaction', async () => {
    const bot = new Bot('token', { put: async () => {} });
    const interaction = {
        commandName: 'privacy',
        deferred: true,
        replied: false,
        isAutocomplete: () => false,
        isChatInputCommand: () => true,
        isMessageContextMenuCommand: () => false,
        async reply() {
            throw new Error('reply failed');
        },
        async editReply(payload) {
            this.edited = payload;
        }
    };

    await bot.onInteraction(interaction);

    assert.equal(
        interaction.edited,
        'Unable to process the command due to an unexpected error.'
    );
});

test('bot suppresses secondary failures while reporting command errors', async () => {
    const bot = new Bot('token', { put: async () => {} });
    const interaction = {
        commandName: 'privacy',
        deferred: false,
        replied: false,
        isAutocomplete: () => false,
        isChatInputCommand: () => true,
        isMessageContextMenuCommand: () => false,
        async reply() {
            throw new Error('reply failed');
        }
    };

    await assert.doesNotReject(() => bot.onInteraction(interaction));
});

test('simple support commands reply with content or embeds', async () => {
    for (const [name, Command] of Object.entries(MessageCommands)) {
        if (name === 'UnitConversionCommand') {
            continue;
        }

        const command = new Command();
        const message = createReplyTarget();

        await command.process(message);

        assert.equal(message.replies.length, 1, name);
        assert.ok(message.replies[0], name);
    }
});

test('help lists registered slash command names', async () => {
    const command = new HelpCommand();
    const message = createReplyTarget();

    await command.process(message);

    assert.match(message.replies[0], /\/afgraph/);
    assert.match(message.replies[0], /\/privacy/);
    assert.match(message.replies[0], /\/convert/);
    assert.doesNotMatch(message.replies[0], /\/kg/);
    assert.doesNotMatch(message.replies[0], /\/lbs/);
    assert.doesNotMatch(message.replies[0], /!logs/);
});

test('unit conversion slash commands convert common units', async () => {
    const command = new UnitConversionCommand();
    const replies = [];
    const createInteraction = (commandName, value, from, to) => ({
        commandName,
        options: {
            getNumber: () => value,
            getString: (name) => (name === 'from' ? from : to)
        },
        async reply(payload) {
            replies.push(payload);
        }
    });

    await command.process(createInteraction('convert', 10, 'kg', 'lbs'));
    await command.process(createInteraction('convert', 22.046, 'lbs', 'kg'));
    await command.process(createInteraction('convert', 100, 'mm', 'in'));
    await command.process(createInteraction('convert', 32, 'F', 'C'));
    await command.process(createInteraction('convert', 1, 'deg', 'arcsec'));
    await command.process(createInteraction('convert', 2, 'GB', 'MiB'));
    await command.process(createInteraction('convert', 60, 'mph', 'km/h'));
    await command.process(createInteraction('convert', 90, 'arcmin', 'px'));

    assert.equal(replies[0], '10kg = 22.0462lbs');
    assert.equal(replies[1], '22.046lbs = 9.9999kg');
    assert.equal(replies[2], '100mm = 3.937in');
    assert.equal(replies[3], '32F = 0C');
    assert.equal(replies[4], '1deg = 3600arcsec');
    assert.equal(replies[5], '2GB = 1907.3486MiB');
    assert.equal(replies[6], '60mph = 96.5606km/h');
    assert.match(replies[7], /Unsupported conversion/);
    assert.equal(command.handlesInteraction({ commandName: 'convert' }), true);
    assert.equal(command.handlesInteraction({ commandName: 'kg' }), false);
});

test('unit conversion autocompletes supported unit names', async () => {
    const command = new UnitConversionCommand();
    const interaction = {
        options: {
            getFocused: () => 'arc'
        },
        async respond(choices) {
            this.choices = choices;
        }
    };

    await command.autocomplete(interaction);

    assert.ok(interaction.choices.length > 0);
    assert.ok(interaction.choices.every((choice) => choice.value.includes('arc')));
    assert.ok(interaction.choices.length <= 25);
});
