const { MessageCommand } = require('./MessageCommand');

class DonateCommand extends MessageCommand {
    constructor() {
        super(['!donate']);
    }

    async process(message) {
        await message.reply(
            'Thank you for considering a donation! Please find more information about how to donate on the homepage at https://nighttime-imaging.eu/donate/'
        );
    }
}

module.exports.DonateCommand = DonateCommand;
