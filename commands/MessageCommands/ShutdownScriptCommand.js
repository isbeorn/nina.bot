const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class ShutdownScriptCommand extends MessageCommand {
    constructor() {
        super(['!shutdown'], 'shutdown', 'A short clip showing how to shutdown the pc with the external script instruction');
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('How to shutdown the pc using the advanced sequencer')
            .setURL(
                'https://discord.com/channels/436650817295089664/436650965446426625/934707064297631764'
            )
            .setAuthor(
                'Isbeorn',
                'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png'
            )
            .setDescription(
                `With the external script instrution it is possible to call external tools.
                One of these is the windows built-in shutdown command. Just reference this command and the desired parameters and the external script will call it.`
            )
            .setImage(
                'https://cdn.discordapp.com/attachments/436650965446426625/934707062166917190/devenv_2022-01-23_02-09-42.mp4'
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.ShutdownScriptCommand = ShutdownScriptCommand;
