//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DockCommand extends MessageCommand {
    constructor() {
        super(['!dock']);
    }

    async process(message) {
        await message.reply('https://www.youtube.com/watch?v=OEJUya9_LWA');
    }
}

module.exports.DockCommand = DockCommand;
