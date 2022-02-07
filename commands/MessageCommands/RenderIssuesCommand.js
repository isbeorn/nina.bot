const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class RenderIssuesCommand extends MessageCommand {
    constructor() {
        super(['!renderissues'], 'renderissues', 'In case of render issues like icons disappearing');
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('In case of render issues like icons disappearing')
            .setURL(
                'https://discord.com/channels/436650817295089664/436650965446426625/934707064297631764'
            )
            .setAuthor(
                'Isbeorn',
                'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png'
            )
            .setDescription(
                `Check if you have a windows service called "Nahimic Service" running. This service is known to cause rendering issues on WPF apps. Once this service is disabled the problem should be gone.
                To disable the service you can go to the Services window using "⊞ Win" + "r" -> Enter "services.msc" and follow the steps in the screenshot below.`
            )
            .setImage(
                'https://cdn.discordapp.com/attachments/716691972814930041/940036120438259723/20211621390318982-disable20nahimic.png'
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.RenderIssuesCommand = RenderIssuesCommand;
