const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class LogsCommand extends MessageCommand {
    constructor() {
        super(['!logs'], 'logs', 'Where to find N.I.N.A. logs');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Logs')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86')
            .setDescription(
                `
                The logs written by N.I.N.A. can be found at "%LOCALAPPDATA%\\NINA\\Logs".
                Furthermore the logs can be opened directly inside the application via the button next to Options->Log Level
                `
            )
            .setFooter({
                text: 'You can drag and drop the log file into N.I.N.A. discord to report problems'
            });
        await message.reply({ embeds: [embed] });
    }
}

module.exports.LogsCommand = LogsCommand;
