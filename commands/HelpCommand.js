//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommands/MessageCommand');
const MessageCommands = require('./MessageCommands');

class HelpCommand extends MessageCommand {
    constructor() {
        super(['!help']);
    }
    async process(message) {
        const triggers = [];
        for (const key in MessageCommands) {
            triggers.push(...(new MessageCommands[key]()).TriggerMessages);
        }
        await message.reply(`Available commands: ${triggers.join(', ')}`);
    }
}

module.exports.HelpCommand = HelpCommand;
