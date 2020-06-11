class ReactionCommand {
    constructor(client) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    execute(reaction, user) {
        if (!user) return;
        if (user.bot) return;
        if (!reaction.message.channel.guild) return;
        this.process(reaction, user);
    }

    process() {}
}

module.exports = ReactionCommand;
