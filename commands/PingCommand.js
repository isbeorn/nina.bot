const BaseCommand = require('./BaseCommand');

class HelpCommand extends BaseCommand {
    execute(message) {
        if (message.isMentioned(this.getClient().user)) {
            this.process(message);
        }
    }
}

module.exports = HelpCommand;
