const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class ProfilesCommand extends MessageCommand {
    constructor() {
        super(['!profile', '!profiles'], 'profiles', 'Where to find the profile files written by N.I.N.A.');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('N.I.N.A. Profiles')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setDescription(
                `
                The profiles written by N.I.N.A. can be found at "%LOCALAPPDATA%\\NINA\\Profiles".
                They store all the settings done in the application in an xml format.
                Furthermore it is safe to update the application and the profiles will be kept.
                `
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.ProfilesCommand = ProfilesCommand;
