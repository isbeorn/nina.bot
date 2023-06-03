const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class NetCoreCommand extends MessageCommand {
    constructor() {
        super(['!netcore', '!net7'], 'net7', 'How to install .NET 7');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('.NET 7.0')
            .setURL('https://dotnet.microsoft.com/en-us/download/dotnet/7.0')            
            .setColor('0x00AE86')
            .setDescription(
                `
                Starting with Version 3.x of N.I.N.A. you will need to install the .NET 7 framework.
                Go to the highlighted link and install the two required components:

- .NET Desktop Runtime 7.x
- ASP.NET Core Runtime 7.x
                `
            )
            .setImage(
                'https://cdn.discordapp.com/attachments/1114146364897628254/1114245343740186724/image.png'
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.NetCoreCommand = NetCoreCommand;
