const { Client, GatewayIntentBits, Routes, SlashCommandBuilder } = require('discord.js');
const log4js = require('log4js');
log4js.configure({
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: ['console'], level: 'debug' } }
});

const logger = log4js.getLogger();

const MessageCommands = require('./commands/MessageCommands');
const AFGraphCommand = require('./commands/AFGraphCommand');
const { HelpCommand } = require('./commands/HelpCommand');
const GalleryWatchdogCommand = require('./commands/GalleryWatchdogCommand');

class Bot {
    constructor(token, rest) {
        this.rest = rest;
        this.token = token;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.MessageContent
            ]
        });
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('messageCreate', this.onMessage.bind(this));
        this.client.on('interactionCreate', this.onInteraction.bind(this));

        this.client.on(
            'messageReactionAdd',
            this.onMessageReactionAdd.bind(this)
        );
        //this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));

        // this.client.on('guildMemberAdd'), this.onGuildMemberAdd.bind(this));
        this.slashCommands = [];
        this.registerCommand(new GalleryWatchdogCommand(this.client));
        //this.registerCommand(new HelpCommand(this.client));
        this.registerCommand(new AFGraphCommand(this.client));
        this.registerCommand(new HelpCommand());

        for (const key in MessageCommands) {
            this.registerCommand(new MessageCommands[key]());
        }

        this.rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: this.slashCommands.map(x => x.toJSON())
            }
        );
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

        if (command.interactionMessage && command.interactionHelp) {
            this.slashCommands.push(new SlashCommandBuilder().setName(command.interactionMessage).setDescription(command.interactionHelp));
            
            // this.client.api
            //     .applications(process.env.CLIENT_ID)
            //     .guilds(process.env.GUILD_ID)
            //     .commands.post({
            //         data: {
            //             name: command.interactionMessage,
            //             description: command.interactionHelp
            //         }
            //     });
        }
    }

    async onReady() {
        logger.info('Client ready');

        //await this.initializeRoleManager();

        //setInterval(this.initializeRoleManager.bind(this), 5*60*1000);
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

            // const embed = new Discord.EmbedBuilder()
            //   .setTitle('Welcome to the N.I.N.A. - Nighttime Imaging \'N\' Astronomy community chat!')
            //   .setThumbnail('https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png')
            //   .setAuthor('Isbeorn', 'https://nighttime-imaging.eu/wp-content/uploads/2019/02/Logo_Nina.png')
            //   .setURL('https://nighttime-imaging.eu')
            //   .setColor('0x00AE86')
            //   .setDescription(`
            //     This server is for support and general discussion about the open source astrophotography alternative.
            //     If you have questions, suggestions or want to chitchat about the software in general feel free to use the appropriate channels.

            //     Please keep the discussion friendly and civil. NSFW content is not allowed.
            // `)
            //   .addField('__**Rules**__', `
            //   1. Treat everyone with respect. Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated.
            //   2. No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.
            //   3. No spam or self-promotion (server invites, advertisements, etc) without permission from a staff member. This includes DMing fellow members.
            //   4. Please do not DM the creator, moderators or contributors for support queries. Use the appropriate support channels in case you need help. The community can then try to help you out!
            //   5. Support is given on a volunteer basis, free of charge, and cannot be guaranteed. Please be respectful of the time given to you for any support query.
            //   `)
            //   .addField('__**About N.I.N.A.**__', `N.I.N.A. is a free open source project dedicated to deep sky astrophotography.
            //   The software is created and maintained by me (Isbeorn aka Stefan Berg) and the community on a volunteer basis.
            //   Everybody is welcome to participate and have an impact on the project.
            //   Suggestions and feedback for improval are appreciated, but please be constructive with your request and don't expect something be worked upon right away.`)
            //   .addField('__**Project Homepage**__', 'https://nighttime-imaging.eu')
            //   .addField('__**Donate**__', 'If N.I.N.A. helps you on your journey for amazing images, please consider a [donation](https://nighttime-imaging.eu/donate/)')
            //   .addField('__**Download**__', 'The latest official builds can be found at the [download page](https://nighttime-imaging.eu/download/)')
            //   .addField('__**Contributing**__', 'Interested in contributing? Refer to the [contributing guide](https://bitbucket.org/Isbeorn/nina/src/develop/CONTRIBUTING.md)!')
            //   .addField('__**Application Support**__', 'Please use the appropriate support channels in case you need help. The community can then try to help you out!')
            //   .addField('__**Invite a friend**__', 'In case you want to invite a friend to our server you can use this link: https://discord.gg/rWRbVbw')
            //   .setFooter('');

            // await channel.send({ embed });

            logger.info(`Fetching message with id ${messageId}`);
            const message = await channel.messages.fetch(messageId);
            //const reactions = await message.reactions.fetch();

            logger.info('Checking message for reactions');
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
            logger.info(`Finished checking for reactions`);
        } catch (ex) {
            logger.error(ex.message);
        }
    }

    async onMessage(message) {
        try {
            const promises = this.getCommands().map((command) => {
                return command.execute(message);
            });

            await Promise.all(promises);
        } catch (ex) {
            logger.error(ex.message);
        }
    }

    async onInteraction(interaction) {
        if (!interaction.isCommand()) return;

        for (let cmd of this.getCommands()) {
            if (cmd.interactionMessage) {
                if (interaction.commandName === cmd.interactionMessage) {
                    await cmd.process(interaction);
                }
            }
        }
    }

    async assignMemberRole(message, user) {
        logger.info(`Assigning member role to user ${user.tag}`);

        const memberRoleId = process.env.MEMBER_ROLE;
        const role = await message.guild.roles.fetch(memberRoleId);
        const member = await message.guild.members.fetch({
            user,
            cache: false
        });

        try {
            await member.roles.add(role);
        } catch (e) {
            logger.error(
                `Failed to assign role to user ${user.tag} due to ${e.message}`
            );
        }
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
