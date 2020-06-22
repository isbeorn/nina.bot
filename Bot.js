const Discord = require('discord.js');
const log4js = require('log4js');
log4js.configure({
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: ['console'], level: 'debug' } }
});

const logger = log4js.getLogger();

const MessageCommands = require('./commands/MessageCommands');
const AFGraphCommand = require('./commands/AFGraphCommand');
const { HelpCommand } = require('./commands/HelpCommand');
const { NotifyOutdatedRoleCommand } = require('./commands/NotifyOutdatedRoleCommand');
const GalleryWatchdogCommand = require('./commands/GalleryWatchdogCommand');

class Bot {
    constructor(token) {
        this.token = token;
        this.client = new Discord.Client();
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        this.client.on(
            'messageReactionAdd',
            this.onMessageReactionAdd.bind(this)
        );
        //this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));

        // this.client.on('guildMemberAdd'), this.onGuildMemberAdd.bind(this));

        this.registerCommand(new GalleryWatchdogCommand(this.client));
        //this.registerCommand(new HelpCommand(this.client));
        this.registerCommand(new AFGraphCommand(this.client));
        this.registerCommand(new HelpCommand());
        this.registerCommand(new NotifyOutdatedRoleCommand());

        for (const key in MessageCommands) {
            this.registerCommand(new MessageCommands[key]());
        }
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
            const client = this.getClient();

            logger.info('Logging in client');
            await client.login(this.getToken());
        } catch (ex) {
            logger.error(ex.message);
        }
    }

    registerCommand(command) {
        this.getCommands().push(command);
    }

    async onReady() {
        logger.info('Client ready');

        await this.initializeRoleManager();
    }

    async initializeRoleManager() {
        try {
            //Retrieve old message to be stored inside the cache to listen to for welcome role reactor
            const client = this.getClient();
            const channelId = process.env.WELCOME_CHANNEL;
            const messageId = process.env.WELCOME_MESSAGE_ID;

            logger.info(`Fetching channel with id ${channelId}`);
            const channel = await client.channels.fetch(channelId);

            // const guild = await client.guilds.resolve("436650817295089664");
            // const members = await guild.members.fetch();

            // for(const [snowflake, member] of members) {

            //   await member.roles.add("719602376092156046");
            // }

            // const embed = new Discord.MessageEmbed()
            //   .setTitle('Welcome to the N.I.N.A. - Nighttime Imaging \'N\' Astronomy community chat!')
            //   .setThumbnail('https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png')
            //   .setAuthor('Isbeorn', 'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png')
            //   .setURL('https://nighttime-imaging.eu')
            //   .setColor('0x00AE86')
            //   .setDescription(`
            // N.I.N.A. is a free open source project dedicated to deep sky astrophotography.
            // The software is created and maintained by me (Isbeorn aka Stefan Berg) and the community on a volunteer basis.
            // Everybody is welcome to participate and have an impact on the project.
            // Suggestions and feedback for improval are appreciated, but please be constructive with your request and don't expect something be worked upon right away.
            // `)
            //   .addField('__**Project Homepage**__', 'https://nighttime-imaging.eu')
            //   .addField('__**Donate**__', 'If N.I.N.A. helps you on your journey for amazing images, please consider a [donation](https://nighttime-imaging.eu/donate/)')
            //   .addField('__**Download**__', 'The latest official builds can be found at the [download page](https://nighttime-imaging.eu/download/)')
            //   .addField('__**Contributing**__', 'Interested in contributing? Refer to the [contributing guide](https://bitbucket.org/Isbeorn/nina/src/master/CONTRIBUTING.md)!')
            //   .addField('__**Application Support**__', 'Please use the appropriate support channels in case you need help. The community can then try to help you out!')
            //   .addField('\u200b', '\u200b')
            //   .addField('__**Role assignment**__', 'If you read the above text thoroughly, please click on the ☑ icon below to be assigend a member role which enables you to see and post messages in the channels.')
            //   .setFooter('');

            // await channel.send({ embed });

            logger.info(`Fetching message with id ${messageId}`);
            const message = await channel.messages.fetch(messageId);
            //const reactions = await message.reactions.fetch();

            logger.info(
                'Migrating users to roles that happened during downtime'
            );
            for (const [, reaction] of message.reactions.cache) {
                const users = await reaction.users.fetch();
                for (const [, user] of users) {
                    if (user.tag !== 'NINA.Bot#9210') {
                        if (reaction.emoji.name === '☑') {
                            await this.assignMemberRole(message, user);
                        }
                        logger.info(
                            `Removing emoji ${reaction.emoji.name} by ${user.tag} from message`
                        );
                        await reaction.users.remove(user.id);
                    }
                }
            }

            await message.react('☑');
            logger.info(`Role Manager initialized`);
        } catch (ex) {
            logger.error(ex.message);
        }
    }

    async onMessage(message) {
        try {
            const promises = this.getCommands().map(command => {
                return command.execute(message);
            });

            await Promise.all(promises);
        } catch (ex) {
            logger.error(ex.message);
        }
    }

    async assignMemberRole(message, user) {
        const memberRoleId = process.env.MEMBER_ROLE;
        const oldMemberRoleId = process.env.OLD_MEMBER_ROLE;
        const role = await message.guild.roles.fetch(memberRoleId);
        const oldRole = await message.guild.roles.fetch(oldMemberRoleId);
        const member = await message.guild.member(user);

        logger.info(`Assigning member role to user ${user.tag}`);
        await member.roles.add(role);

        logger.info(`Removing old member role from user ${user.tag}`);
        await member.roles.remove(oldRole);
    }

    async onMessageReactionAdd(reaction, user) {
        try {
            const messageId = process.env.WELCOME_MESSAGE_ID;
            const message = reaction.message;
            if (user.tag !== 'NINA.Bot#9210' && message.id === messageId) {
                if (reaction.emoji.name === '☑') {
                    await this.assignMemberRole(message, user);
                }
                logger.info(
                    `Removing emoji ${reaction.emoji.name} by ${user.tag} from message`
                );
                await reaction.users.remove(user.id);
            }
        } catch (ex) {
            logger.error(ex.message);
        }
    }
}

module.exports = Bot;
