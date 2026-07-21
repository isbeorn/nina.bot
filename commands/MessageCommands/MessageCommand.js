const { SlashCommandBuilder } = require('discord.js');

class MessageCommand {
    constructor(triggerMessages, interactionMessage, interactionHelp) {
        this.triggerMessages = triggerMessages;
        this.interactionMessage = interactionMessage;
        this.interactionHelp = interactionHelp;
    }

    get TriggerMessages() {
        return this.triggerMessages;
    }

    getApplicationCommands() {
        if (!this.interactionMessage || !this.interactionHelp) {
            return [];
        }

        return [
            new SlashCommandBuilder()
                .setName(this.interactionMessage)
                .setDescription(this.interactionHelp)
        ];
    }

    async process(message) {
        throw new Error(message);
    }
}

module.exports.MessageCommand = MessageCommand;
