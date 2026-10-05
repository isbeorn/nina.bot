const {
    ActionRowBuilder,
    ApplicationCommandType,
    MessageFlags,
    StringSelectMenuBuilder
} = require('discord.js');
const { MessageCommand } = require('./MessageCommands/MessageCommand');
const { categories } = require('./MessageCommands');
const { createReplyCard } = require('./ReplyCard');

const CATEGORY_MENU_ID = 'help:category:v1';

class HelpCommand extends MessageCommand {
    constructor(getCommands) {
        super([], 'help', 'List available NINA.Bot commands');
        this.category = 'guides';
        this.getCommands = getCommands;
    }

    handlesInteraction(interaction) {
        return (
            (interaction.isStringSelectMenu?.() &&
                interaction.customId === CATEGORY_MENU_ID) ||
            (interaction.isChatInputCommand() &&
                interaction.commandName === this.interactionMessage)
        );
    }

    async process(interaction) {
        if (interaction.isStringSelectMenu?.()) {
            const values = interaction.values;
            if (
                values.length !== 1 ||
                ![
                    'overview',
                    ...categories.map((category) => category.id)
                ].includes(values[0])
            ) {
                await interaction.reply({
                    content:
                        'That help category is unavailable. Run /help to open the current menu.',
                    flags: MessageFlags.Ephemeral,
                    allowedMentions: { parse: [] }
                });
                return;
            }

            await interaction.update(this.createResponse(values[0]));
            return;
        }

        const response = this.createResponse('overview');
        response.flags |= MessageFlags.Ephemeral;
        await interaction.reply(response);
    }

    createResponse(categoryId) {
        const entries = this.getCommands().flatMap((command) =>
            command.getApplicationCommands().map((builder) => ({
                ...builder.toJSON(),
                category: command.category
            }))
        );
        const overview = categoryId === 'overview';
        const category = categories.find((item) => item.id === categoryId);
        const commands = entries
            .filter(
                (entry) =>
                    entry.type === ApplicationCommandType.ChatInput &&
                    (overview
                        ? ['docs', 'support', 'logs', 'afreport'].includes(
                              entry.name
                          )
                        : entry.category === categoryId)
            )
            .sort((left, right) => left.name.localeCompare(right.name));
        const sections = [
            {
                heading: overview ? 'Common starting points' : 'Commands',
                text: commands
                    .map(
                        (command) =>
                            `\`/${command.name}\` - ${command.description}`
                    )
                    .join('\n')
            }
        ];
        const contextActions = entries.filter(
            (entry) =>
                entry.type === ApplicationCommandType.Message &&
                entry.category === categoryId
        );
        if (contextActions.length > 0) {
            sections.push({
                heading: 'Message actions',
                text: contextActions
                    .map(
                        (action) =>
                            `Right-click a report message and choose **Apps > ${action.name}**.`
                    )
                    .join('\n')
            });
        }

        const response = createReplyCard({
            title: overview ? 'NINA.Bot help' : category.label,
            introduction:
                'Choose a category to browse commands privately. Run a slash command separately to use it. Support replies are public; /expressions opens a private learning guide.',
            sections
        });
        response.components.push(
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(CATEGORY_MENU_ID)
                    .setPlaceholder('Choose a category')
                    .addOptions(
                        [
                            { id: 'overview', label: 'Overview' },
                            ...categories
                        ].map((item) => ({
                            label: item.label,
                            value: item.id,
                            default: item.id === categoryId
                        }))
                    )
            )
        );
        return response;
    }
}

module.exports = { HelpCommand };
