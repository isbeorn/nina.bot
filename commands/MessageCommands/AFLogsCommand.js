const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class AFLogsCommand extends MessageCommand {
    constructor() {
        super(['!aflogs', '!afreport']);
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('N.I.N.A. Autofocus Logs')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86')
            .setDescription(
                `
                Each time an auto focus is completed it will generate a json log about the complete run.
                The report can be found at "%LOCALAPPDATA%\\NINA\\AutoFocus".
                These logs can be dragged into discord and the bot will generate a visual representation of the autofocus run
                `
            );
        await message.reply(embed);
    }
}

module.exports.AFLogsCommand = AFLogsCommand;
