const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class DomeShutterCommand extends MessageCommand {
    constructor() {
        super(['!domeshutter'],'domeshutter', 'Dome Shutter conformance issue');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Non-Compliant Dome Shutter')
            .setDescription(
                `
                When an ASCOM Dome receives a request to open or close the shutter, it's supposed to wait for the shutter to actually start moving or report a failure if it doesn't.  
                Your device seems to return before that, which can be dangerous for your equipment safety if the shutter is closing due to unsafe conditions (like rain).  
                From N.I.N.A.'s perspective, we can't tell if a lack of progress is a failure or if it's going to eventually start.

Please report this issue to your Dome vendor so they can fix the driver.  
Further info about this topic can be found below: `
            )
            .addFields([
                { name: 'ASCOM principles', value: '[https://ascom-standards.org/Developer/Principles.htm](https://ascom-standards.org/Developer/Principles.htm)'},
                
                { name: 'Dome Shutter on Groups.IO', value: '[https://ascomtalk.groups.io/g/Developer/message/3579](https://ascomtalk.groups.io/g/Developer/message/3579)'},
                { name: 'Bob Denny on Discord', value: '[https://discord.com/channels/436650817295089664/769608646215598101/812466133608300544](https://discord.com/channels/436650817295089664/769608646215598101/812466133608300544)'}
            ])
        await message.reply({ embeds: [embed] });
    }
}

module.exports.DomeShutterCommand = DomeShutterCommand;
