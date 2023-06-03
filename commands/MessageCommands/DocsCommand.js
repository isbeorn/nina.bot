const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DocsCommand extends MessageCommand {
    constructor() {
        super(['!docs'], 'docs', 'Link to the documentation page');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Documentation')
            .setURL('https://nighttime-imaging.eu/docs/master/site/')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setDescription(
                `
                Detailed manual about the application as well as some tipps and tricks and how to contribute to the project
                `
            )
            .setFooter({
                text: 'This documentation covers the current release build'
            });
        await message.reply({ embeds: [embed] });
    }
}

module.exports.DocsCommand = DocsCommand;
