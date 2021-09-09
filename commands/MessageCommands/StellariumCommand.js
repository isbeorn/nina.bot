//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class StellariumCommand extends MessageCommand {
    constructor() {
        super(['!stellarium'], 'stellarium', 'How to setup stellarium with N.I.N.A.');
    }

    async process(message) {
        await message.reply('https://youtu.be/v2gROUlPRhw');
    }
}

module.exports.StellariumCommand = StellariumCommand;
