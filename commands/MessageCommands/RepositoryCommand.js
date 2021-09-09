const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class RepositoryCommand extends MessageCommand {
    constructor() {
        super(['!repository', '!nina']);
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('N.I.N.A. Repository')
            .setURL('https://bitbucket.org/Isbeorn/nina')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86').setDescription(`
                This repository covers the source code for the N.I.N.A. project.
            `);
        await message.reply({ embeds: [embed] });
    }
}

module.exports.RepositoryCommand = RepositoryCommand;
