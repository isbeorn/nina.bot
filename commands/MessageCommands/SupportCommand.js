const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class SupportCommand extends MessageCommand {
    constructor() {
        super(['!support'], 'support', 'Information is lacking for a support request. Generate a guideline here');
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
  
                1. Please describe the issue you are facing as detailed as possible
                2. Provide a step-by-step description on how to reproduce the problem 
                3. Describe what the expected behavior should be and what the actual behavior is
                4. Post a screenshot of the problem if applicable
                5. Share your log file (located at "%LOCALAPPDATA%\\NINA\\Logs")
                  
                Thank you.                
                `
            );
        await message.reply({ embeds: [embed] });   
    }
}

module.exports.SupportCommand = SupportCommand;
