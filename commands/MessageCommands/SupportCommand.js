const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class SupportCommand extends MessageCommand {
    constructor() {
        super(['!support']);
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('N.I.N.A. Support')
            .setURL('https://bitbucket.org/Isbeorn/nina/issues?status=new&status=open')
            .setThumbnail(
                'https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png'
            )
            .setColor('0x00AE86')
            .setDescription(
                `
                To better help with your issue, some more details are required       
  
                1. Please describe what the issue is in detail
                2. Give a detailed description on how to reproduce the problem step-by-step
                3. Describe what the expected behavior should be and what the actual behavior is
                4. Share your log file
                  
                Thank you.                
                `
            );
        await message.reply(embed);   
    }
}

module.exports.SupportCommand = SupportCommand;
