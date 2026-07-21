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

                To generate a visual representation of the autofocus run, use /afgraph and attach the json report in the report field.
                If the json report was already posted, right-click the message, choose Apps, then select Analyze Autofocus Report.
                `
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.AFLogsCommand = AFLogsCommand;
