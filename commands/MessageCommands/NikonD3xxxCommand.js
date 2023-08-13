const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class NikonD3xxxCommand extends MessageCommand {
    constructor() {
        super(['!d3xxx'], 'd3xxx', 'Nikon D3xxx series support');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Nikon D3xxx series support')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setDescription(
                `
                Unfortunately the Nikon D3xxx series is not supported by the SDK provided by Nikon and will not work with the native Nikon driver.
                `
            )
        await message.reply({ embeds: [embed] });
    }
}

module.exports.NikonD3xxxCommand = NikonD3xxxCommand;
