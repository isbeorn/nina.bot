const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class RepositoryCommand extends MessageCommand {
    constructor() {
        super(['!repository', '!nina'], 'repository', 'The main N.I.N.A. repository');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Repository')
            .setURL('https://github.com/isbeorn/nina')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setDescription(`
                This repository covers the source code for the N.I.N.A. project.
            `);
        await message.reply({ embeds: [embed] });
    }
}

module.exports.RepositoryCommand = RepositoryCommand;
