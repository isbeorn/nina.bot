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

    // this.client.on('guildMemberAdd'), this.onGuildMemberAdd.bind(this));

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
    if (message.content == '$$TESTREACTION$$') {
      this.onGuildMemberAdd(message.member);
    }

    this.getCommands().forEach((command) => {
      command.execute(message);
    });
  }

  async onGuildMemberAdd(member) {
    const channelId = '633460410007420959';
    const role = '633465970836504579';

    const embed = new Discord.RichEmbed()
      .setTitle('Welcome to the server')
      .setAuthor('Isbeorn')
      .setColor('0x00AE86')
      .setDescription('blablabla');

    const channel = member.guild.channels.get(channelId);

    const msg1 = await channel.send(`Welcome ${member}`);
    channel.send({ embed }).then(async (msg) => {
      await msg.react('☑');
      const filter = (reaction, user) => reaction.emoji.name === '☑' && user.id === member.id;
      try {
        const collected = await msg.awaitReactions(filter, { max: 1 });

        await member.addRole(role);
        msg.delete();
        msg1.delete();
      } catch (ex) {
        console.log(ex.message);
      }
    });
  }
}

module.exports = Bot;
