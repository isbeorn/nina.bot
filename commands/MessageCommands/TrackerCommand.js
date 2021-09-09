const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class TrackerCommand extends MessageCommand {
    constructor() {
        super(['!tracker', '!issue', '!issues'], 'issues', 'Where to find the issue tracker');
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('N.I.N.A. Issue Tracker')
            .setURL(
                'https://bitbucket.org/Isbeorn/nina/issues?status=new&status=open'
            )
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86').setDescription(`
                Please use the issue tracker for bug reports. The more details you put into the report, the more likely it is that someone can fix it quickly.
                Furthermore the tracker can be used for suggestions and improvements.
            `);
        await message.reply({ embeds: [embed] });
    }
}

module.exports.TrackerCommand = TrackerCommand;
