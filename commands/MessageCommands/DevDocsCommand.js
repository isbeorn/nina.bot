const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DevDocsCommand extends MessageCommand {
    constructor() {
        super(['!devdocs'], 'devdocs', 'Documentation for nightlies');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Documentation')
            .setURL('https://nighttime-imaging.eu/docs/develop/site/')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86')
            .setDescription(
                `
                Detailed manual about the application as well as some tipps and tricks and how to contribute to the project
                `
            )
            .setFooter({
                text: 'This documentation covers the current nightly build'
            });
        await message.reply({ embeds: [embed] });
    }
}

module.exports.DevDocsCommand = DevDocsCommand;
