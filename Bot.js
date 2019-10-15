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
    this.a = 1;
    const channelId = '633460410007420959';
    const role = '633465970836504579';

    const embed = new Discord.RichEmbed()
      .setTitle('Welcome to the N.I.N.A. - Nighttime Imaging \'N\' Astronomy community discord!')
      .setAuthor('Isbeorn', 'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png')
      .setURL('https://nighttime-imaging.eu')
      .setColor('0x00AE86')
      .setDescription(`
      N.I.N.A. is a free open-source project, that is maintained by me (Isbeorn aka Stefan Berg) and the community on a volunteer basis.
      Everybody is welcome to participate and have an impact on the project.
      Suggestions and feedback for improval are welcome, but please try to be detailed with your request and don't expect it to be worked upon right away.
      Remember that this is a volunteer project, so it will take some volunteer to be convinced that a particular request is worth their time and that it fits to the general project's vision!      
      `)
      .addField('Project Homepage', 'https://nighttime-imaging.eu')
      .addField('Donate', 'If you like the project and want to support me with a donation have a look at https://nighttime-imaging.eu/donate/')
      .addField('Download', 'You can find the latest official builds of N.I.N.A. at https://nighttime-imaging.eu/download/')
      .addField('Rules & News', 'Server rules and latest news can be found inside the channel #announcements on the left side')
      .setFooter('If you read the above text thoroughly, please click on the ☑ icon below to be assigend a member role which enables you to see and post messages in the channels.');

    const channel = member.guild.channels.get(channelId);

    const msg1 = await channel.send(`Hello ${member}`);
    channel.send({ embed }).then(async (msg) => {
      await msg.react('☑');
      const filter = (reaction, user) => reaction.emoji.name === '☑' && user.id === member.id;
      try {
        await msg.awaitReactions(filter, { max: 1 });

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
