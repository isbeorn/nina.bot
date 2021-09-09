//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class TroubleshootCommand extends MessageCommand {
    constructor() {
        super(['!troubleshoot'], 'troubleshoot', 'Troubleshoot guide for common problems');
    }

    async process(message) {
        await message.reply(
            'https://nighttime-imaging.eu/docs/develop/site/troubleshooting/'
        );
    }
}

module.exports.TroubleshootCommand = TroubleshootCommand;
