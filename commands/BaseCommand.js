class BaseCommand {
    constructor(client) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    async execute(message) {
        if(message.author.tag !== 'NINA.Bot#9210') {
            await this.process(message);
        }
    }

    async process(message) {
        this.currentMessage = message.content;
    }
}

module.exports = BaseCommand;
