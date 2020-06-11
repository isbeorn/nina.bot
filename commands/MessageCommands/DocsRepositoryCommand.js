const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DocsRepositoryCommand extends MessageCommand {
    constructor() {
        super(['!nina.docs']);
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('N.I.N.A. Documentation Repository')
            .setURL('https://bitbucket.org/Isbeorn/nina.docs')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86').setDescription(`
                This repository covers the source code for the N.I.N.A. documentation. If you want to improve the documentation, this is the place to go to.        
            `);
        await message.reply(embed);
    }
}

module.exports.DocsRepositoryCommand = DocsRepositoryCommand;
