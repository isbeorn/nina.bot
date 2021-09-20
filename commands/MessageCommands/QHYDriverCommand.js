//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class QHYDriverCommand extends MessageCommand {
    constructor() {
        super(['!qhydriver'], 'qhydriver', 'Got a message to update your QHY driver? Find help here');
    }

    async process(message) {
        await message.reply('https://nighttime-imaging.eu/docs/develop/site/troubleshooting/qhy_driver_update/#in-case-of-usb-driver-update-problems');
    }
}

module.exports.QHYDriverCommand = QHYDriverCommand;
