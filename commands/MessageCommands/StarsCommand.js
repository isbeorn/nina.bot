const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class StarsCommand extends MessageCommand {
    constructor() {
        super(['!stars']);
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Where to find stars in N.I.N.A.?')
            .setURL(
                'https://nighttime-imaging.eu/docs/develop/site/tabs/imaging/'
            )
            .setAuthor(
                'Isbeorn',
                'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png'
            )
            .setThumbnail(
                'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png'
            )
            .setDescription(
                `
        Stars are not part of the sky atlas search, as it only contains relevant deep sky objects.
        Typically stars are only used for focusing. For this a small tool is available inside the imaging tab called "Manual Focus Targets". 
        There you can find a list of the brightest stars in the nightsky ordered by altitude.
        `
            )
            .setImage(
                'https://nighttime-imaging.eu/wp-content/uploads/2020/06/stars.png'
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.StarsCommand = StarsCommand;
