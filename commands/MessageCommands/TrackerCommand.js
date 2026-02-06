const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class TrackerCommand extends MessageCommand {
    constructor() {
        super(['!tracker', '!issue', '!issues'], 'issues', 'Where to find the issue tracker');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Issue Tracker')
            .setURL(
                'https://github.com/isbeorn/nina/issues'
            )
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setDescription(`
                Please use the issue tracker for bug reports. The more details you put into the report, the more likely it is that someone can fix it quickly.
                Furthermore the tracker can be used for suggestions and improvements.
            `);
        await message.reply({ embeds: [embed] });
    }
}

module.exports.TrackerCommand = TrackerCommand;
