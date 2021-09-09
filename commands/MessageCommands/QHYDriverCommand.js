//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class QHYDriverCommand extends MessageCommand {
    constructor() {
        super(['!qhydriver'], 'qhydriver', 'Got a message to update your QHY driver? Find help here');
    }

    async process(message) {
        await message.reply('https://daleghent.com/2021/02/1q2021-qhy-native-driver#Important_SDK_and_driver_notice');
    }
}

module.exports.QHYDriverCommand = QHYDriverCommand;
