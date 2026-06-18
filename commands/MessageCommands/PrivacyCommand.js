const { MessageCommand } = require('./MessageCommand');

const DEFAULT_PRIVACY_POLICY_URL =
    'https://github.com/isbeorn/nina.bot/blob/master/PRIVACY.md';

class PrivacyCommand extends MessageCommand {
    constructor() {
        super(
            ['!privacy'],
            'privacy',
            'Show NINA.Bot privacy and data usage information'
        );
    }

    async process(message) {
        const privacyPolicyUrl =
            process.env.PRIVACY_POLICY_URL || DEFAULT_PRIVACY_POLICY_URL;

        await message.reply(
            `NINA.Bot privacy policy and data usage information: ${privacyPolicyUrl}`
        );
    }
}

module.exports.PrivacyCommand = PrivacyCommand;
