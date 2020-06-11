//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DiscordPatreonCommand extends MessageCommand {
    constructor() {
        super(['!discord.patreon']);
    }

    async process(message) {
        await message.reply(
            'https://support.patreon.com/hc/en-us/articles/212052266-Get-my-Discord-role'
        );
    }
}

module.exports.DiscordPatreonCommand = DiscordPatreonCommand;




