//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class QHYDriverCommand extends MessageCommand {
    constructor() {
        super(['!qhydriver']);
    }

    async process(message) {
        await message.reply('https://daleghent.com/2021/02/1q2021-qhy-native-driver#Important_SDK_and_driver_notice');
    }
}

module.exports.QHYDriverCommand = QHYDriverCommand;
