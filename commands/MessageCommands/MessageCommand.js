const _ = require('lodash');

class MessageCommand {
    constructor(triggerMessages) {
        this.triggerMessages = triggerMessages;
    }

    get TriggerMessages() {
        return this.triggerMessages;
    }

    async execute(message) {
        if (typeof message.content === 'string') {
            const start = message.content.split(' ')[0];
            if (start.length > 1) {
                if (
                    this.TriggerMessages.findIndex(x => x.startsWith(start)) >
                    -1
                ) {
                    return this.process(message);
                }
            }
            // if (_.includes(this.TriggerMessages, message.content)) {
            //     return this.process(message);
            // }
        }
    }

    async process(message) {
        throw new Error(message);
    }
}

module.exports.MessageCommand = MessageCommand;
