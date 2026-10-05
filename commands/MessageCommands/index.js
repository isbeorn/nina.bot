const { GeneralReplyCommand } = require('./GeneralReplyCommand');

const groups = [
    require('./content/guides'),
    require('./content/troubleshooting'),
    require('./content/equipment'),
    require('./content/autofocus'),
    require('./content/community')
];

const categories = groups.map(({ id, label }) => ({ id, label }));

function createGeneralCommands() {
    return groups.flatMap((group) =>
        group.replies.map(
            (definition) => new GeneralReplyCommand(definition, group.id)
        )
    );
}

module.exports = { categories, createGeneralCommands };
