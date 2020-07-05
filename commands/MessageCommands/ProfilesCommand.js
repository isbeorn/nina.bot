const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class ProfilesCommand extends MessageCommand {
    constructor() {
        super(['!profile', '!profiles']);
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('N.I.N.A. Profiles')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86')
            .setDescription(
                `
                The profiles written by N.I.N.A. can be found at "%LOCALAPPDATA%\\NINA\\Profiles".
                They store all the settings done in the application in an xml format.
                Furthermore it is safe to update the application and the profiles will be kept.
                `
            );
        await message.reply(embed);
    }
}

module.exports.ProfilesCommand = ProfilesCommand;
