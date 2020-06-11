const _ = require('lodash');

class MessageCommand {
    constructor(triggerMessages) {
        this.triggerMessages = triggerMessages;
    }

    get TriggerMessages() {
        return this.triggerMessages;
    }

    async execute(message) {
        if (_.includes(this.TriggerMessages, message.content)) {
            return this.process(message);
        }
    }

    async process(message) {
        throw new Error(message);
    }
}

module.exports.MessageCommand = MessageCommand;