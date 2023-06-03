const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class AFLogsCommand extends MessageCommand {
    constructor() {
        super(
            ['!aflogs', '!afreport'],
            'afreport',
            'How to generate autofocus reports'
        );
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Autofocus Logs')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setDescription(
                `
                Each time an auto focus is completed it will generate a json log about the complete run.
                The report can be found at "%LOCALAPPDATA%\\NINA\\AutoFocus".
                These logs can be dragged into discord and the bot will generate a visual representation of the autofocus run
                `
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.AFLogsCommand = AFLogsCommand;
