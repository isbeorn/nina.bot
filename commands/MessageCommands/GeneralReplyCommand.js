const { MessageCommand } = require('./MessageCommand');
const { createReplyCard } = require('../ReplyCard');

class GeneralReplyCommand extends MessageCommand {
    constructor(definition, category) {
        super([], definition.name, definition.description);
        this.category = category;
        this.card = definition.card;
    }

    async process(interaction) {
        const content =
            typeof this.card === 'function' ? this.card() : this.card;
        await interaction.reply(createReplyCard(content));
    }
}

module.exports = { GeneralReplyCommand };
