const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class GuiderSettleCommand extends MessageCommand {
    constructor() {
        super(['!settlefailed'], 'settlefailed', 'Troubleshoot issues with installer being unable to install or uninstall the application');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
        .setTitle('Settle Failed?')
        .setURL('https://nighttime-imaging.eu/docs/master/site/advanced/dithering/#settings-for-phd2')
        .setThumbnail(
            'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
        )
        .setDescription(
            `
            When you get a message that your settle failed, your settle parameters are most likely not optimal.
            Please have a look at the dither documentation from the link above and check which parameter you need to adjust to get a successful settle.
            `
        );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.GuiderSettleCommand = GuiderSettleCommand;
