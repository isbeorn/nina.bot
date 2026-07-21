//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommands/MessageCommand');
const MessageCommands = require('./MessageCommands');

class HelpCommand extends MessageCommand {
    constructor() {
        super(['!help'], 'help', 'List available NINA.Bot commands');
    }

    async process(message) {
        const commands = ['afgraph', 'help'];
        for (const key in MessageCommands) {
            const command = new MessageCommands[key]();
            commands.push(
                ...command
                    .getApplicationCommands()
                    .map((applicationCommand) => applicationCommand.toJSON())
                    .filter((applicationCommand) => applicationCommand.description)
                    .map((applicationCommand) => applicationCommand.name)
            );
        }
        await message.reply(
            `Available commands: ${[...new Set(commands)]
                .sort()
                .map((command) => `/${command}`)
                .join(', ')}`
        );
    }
}

module.exports.HelpCommand = HelpCommand;
