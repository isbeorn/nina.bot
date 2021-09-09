const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class OvershootCommand extends MessageCommand {
    constructor() {
        super(['!overshoot'], 'overshoot', 'A short clip to show how focuser overshoot is working');
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('How does overshoot backlash compensation work?')
            .setURL(
                'https://nighttime-imaging.eu/docs/develop/site/tabs/imaging/'
            )
            .setAuthor(
                'Isbeorn',
                'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png'
            )
            .setDescription(
                `
                This method will compensate for backlash by overshooting the target focuser position by a large amount and then moving the focuser back to the initially requested target position.
                Due to this compensation the last movement of the focuser will always be in the same direction (either always inwards or always outwards)
        `
            )
            .setImage(
                'https://media.discordapp.net/attachments/437173823675170816/717152179151962172/nina-af.gif'
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.OvershootCommand = OvershootCommand;
