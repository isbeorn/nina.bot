const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class BitAscomCommand extends MessageCommand {
    constructor() {
        super(
            ['!32bitascom'],
            '32bitascom',
            'How to get 32bit ASCOM drivers to work with 64bit software'
        );
    }

    async process(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('How to use 32bit COM objects in 64bit environments')
            .setURL('https://techtalk.gfi.com/32bit-object-64bit-environment/')
            .setThumbnail(
                'https://www.techtalk.gfi.com/wp-content/uploads/2009/09/Using-32bit-COM-in-64bit-environment-300x300.jpg'
            )
            .setColor('0x00AE86').setDescription(`
                Some ASCOM drivers are only provided as 32bit. Using the above linked method it is possible to make this 32bit ASCOM driver accessible to a 64bit N.I.N.A. application.
            `);
        await message.reply({ embeds: [embed] });
    }
}

module.exports.BitAscomCommand = BitAscomCommand;
