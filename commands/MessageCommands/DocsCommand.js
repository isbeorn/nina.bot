const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DocsCommand extends MessageCommand {
    constructor() {
        super(['!docs'],'docs', 'Link to the documentation page');
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('N.I.N.A. Documentation')
            .setURL('https://nighttime-imaging.eu/docs/master/site/')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86')
            .setDescription(
                `
                Detailed manual about the application as well as some tipps and tricks and how to contribute to the project
                `
            )
            .setFooter('This documentation covers the current release build');
        await message.reply({ embeds: [embed] });
    }
}

module.exports.DocsCommand = DocsCommand;
