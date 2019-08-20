class BaseCommand {
    constructor(client) {
        this.client = client;
    }
    getClient() {
        return this.client;
    }
    execute(message) {        
        this.process(message);
        
    }
    process(message) {
        //overwrite in extended class
    }
}

module.exports = BaseCommand;