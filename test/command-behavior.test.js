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
    assert.ok(commandNames.includes('help'));
    assert.ok(commandNames.includes('kg'));
    assert.ok(commandNames.includes('lbs'));
    assert.ok(commandNames.includes('privacy'));
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
    assert.match(message.replies[0], /\/kg/);
    assert.doesNotMatch(message.replies[0], /!logs/);
});

test('unit conversion slash commands convert in both directions', async () => {
    const command = new UnitConversionCommand();
    const replies = [];
    const createInteraction = (commandName, value) => ({
        commandName,
        options: {
            getNumber: () => value
        },
        async reply(payload) {
            replies.push(payload);
        }
    });

    await command.process(createInteraction('kg', 10));
    await command.process(createInteraction('lbs', 22.046));

    assert.equal(replies[0], '10kg = 22.05lbs');
    assert.equal(replies[1], '22.046lbs = 10kg');
    assert.equal(command.handlesInteraction({ commandName: 'kg' }), true);
    assert.equal(command.handlesInteraction({ commandName: 'grams' }), false);
});
