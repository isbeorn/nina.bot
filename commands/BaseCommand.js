class BaseCommand {
    constructor(client) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    async process() {
        throw new Error('Command processing is not implemented');
    }
}

module.exports = BaseCommand;
