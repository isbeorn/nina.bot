//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class TroubleshootCommand extends MessageCommand {
    constructor() {
        super(['!troubleshoot']);
    }

    async process(message) {
        await message.reply(
            'https://nighttime-imaging.eu/docs/develop/site/troubleshooting/'
        );
    }
}

module.exports.TroubleshootCommand = TroubleshootCommand;
