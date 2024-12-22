const { MessageCommand } = require('./MessageCommand');

class DonateCommand extends MessageCommand {
    constructor() {
        super(['!donate'], 'donate', 'How to support the project');
    }

    async process(message) {
        await message.reply(
            'Thank you for considering a donation! To learn more about how you can contribute, please visit https://nighttime-imaging.eu/donate/.'
        );
    }
}

module.exports.DonateCommand = DonateCommand;
