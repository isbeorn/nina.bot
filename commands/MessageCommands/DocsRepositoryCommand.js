const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DocsRepositoryCommand extends MessageCommand {
    constructor() {
        super(
            ['!nina.docs'],
            'ninadocs',
            'Repository for the N.I.N.A. documentation'
        );
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Documentation Repository')
            .setURL('https://bitbucket.org/Isbeorn/nina.docs')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setDescription(`
                This repository covers the source code for the N.I.N.A. documentation. If you want to improve the documentation, this is the place to go to.        
            `);
        await message.reply({ embeds: [embed] });
    }
}

module.exports.DocsRepositoryCommand = DocsRepositoryCommand;
