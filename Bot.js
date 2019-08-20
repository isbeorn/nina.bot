const Discord = require('discord.js');
const log4js = require('log4js');

const logger = log4js.getLogger();

const HelpCommand = require('./commands/HelpCommand');

class Bot {
  constructor(token) {
    this.token = token;
    this.client = new Discord.Client();
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('message', this.onMessage.bind(this));

    this.registerCommand(new HelpCommand(this.client));
  }

  getToken() {
    return this.token;
  }

  getClient() {
    return this.client;
  }

  getCommands() {
    if (!this.commands) {
      this.commands = [];
    }
    return this.commands;
  }

  async connect() {
    try {
      await this.getClient().login(this.getToken());
    } catch (ex) {
      logger.error(ex.message);
    }
  }

  registerCommand(command) {
    this.getCommands().push(command);
  }

  onReady() {
    this.ready = true;
  }

  onMessage(message) {
    this.getCommands().forEach((command) => {
      command.execute(message);
    });
  }
}

module.exports = Bot;
