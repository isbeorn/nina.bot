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
            .setDescription(
                `
                Starting with Version 3.x of N.I.N.A. you will need to install the .NET 7 framework.
                Go to the highlighted link and install the required component:

- .NET Desktop Runtime 7.x
                `
            )
            .setImage(
                'https://cdn.discordapp.com/attachments/1075489594184847410/1133956497932558397/image.png'
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.NetCoreCommand = NetCoreCommand;
