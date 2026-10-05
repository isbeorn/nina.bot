const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    StringSelectMenuBuilder
} = require('discord.js');
const { MessageCommand } = require('../MessageCommands/MessageCommand');
const { createReplyCard } = require('../ReplyCard');
const lessons = require('./lessons');

const TOPIC_MENU_ID = 'expressions:topic:v1';
const PAGE_PREFIX = 'expressions:page:v1:';
const PAGE_ID = /^expressions:page:v1:([a-z-]+):(previous|next|overview)$/;

class ExpressionGuideCommand extends MessageCommand {
    constructor() {
        super(
            [],
            'expressions',
            'Learn N.I.N.A. 3.3 expressions in a private step-by-step guide'
        );
    }

    handlesInteraction(interaction) {
        return (
            (interaction.isChatInputCommand() &&
                interaction.commandName === this.interactionMessage) ||
            (interaction.isStringSelectMenu?.() &&
                interaction.customId === TOPIC_MENU_ID) ||
            (interaction.isButton?.() &&
                interaction.customId?.startsWith(PAGE_PREFIX))
        );
    }

    async process(interaction) {
        if (interaction.isChatInputCommand()) {
            const response = this.createResponse(0);
            response.flags |= MessageFlags.Ephemeral;
            await interaction.reply(response);
            return;
        }

        let lessonId;
        if (interaction.isStringSelectMenu?.()) {
            if (
                Array.isArray(interaction.values) &&
                interaction.values.length === 1
            ) {
                lessonId = interaction.values[0];
            }
        } else {
            lessonId = PAGE_ID.exec(interaction.customId)?.[1];
        }
        const index = lessons.findIndex((lesson) => lesson.id === lessonId);
        if (index === -1) {
            await interaction.reply({
                content:
                    'That expression lesson is unavailable. Run /expressions to open the current guide.',
                flags: MessageFlags.Ephemeral,
                allowedMentions: { parse: [] }
            });
            return;
        }

        // Updating the original message preserves its ephemeral visibility.
        await interaction.update(this.createResponse(index));
    }

    createResponse(index) {
        const lesson = lessons[index];
        const response = createReplyCard({
            ...lesson,
            introduction: `N.I.N.A. 3.3 | Page ${index + 1} of ${lessons.length}\n\n${lesson.introduction}`,
            links: [
                {
                    label: 'Nightly documentation',
                    url: 'https://nighttime-imaging.eu/docs/develop/site/'
                }
            ]
        });
        response.components.push(
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(TOPIC_MENU_ID)
                    .setPlaceholder('Choose a lesson')
                    .addOptions(
                        lessons.map((item, itemIndex) => ({
                            label: item.title,
                            value: item.id,
                            default: itemIndex === index
                        }))
                    )
            ),
            new ActionRowBuilder().addComponents(
                [
                    {
                        label: 'Previous',
                        action: 'previous',
                        index: Math.max(0, index - 1),
                        disabled: index === 0
                    },
                    {
                        label: 'Next',
                        action: 'next',
                        index: Math.min(lessons.length - 1, index + 1),
                        disabled: index === lessons.length - 1
                    },
                    {
                        label: 'Overview',
                        action: 'overview',
                        index: 0,
                        disabled: index === 0
                    }
                ].map((button) =>
                    new ButtonBuilder()
                        // Previous and Overview can share a destination, but Discord requires unique custom IDs.
                        .setCustomId(
                            `${PAGE_PREFIX}${lessons[button.index].id}:${button.action}`
                        )
                        .setLabel(button.label)
                        .setStyle(
                            button.action === 'next'
                                ? ButtonStyle.Primary
                                : ButtonStyle.Secondary
                        )
                        .setDisabled(button.disabled)
                )
            )
        );
        return response;
    }
}

module.exports = { ExpressionGuideCommand };
