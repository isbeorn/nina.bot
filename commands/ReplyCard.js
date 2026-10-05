const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    MessageFlags,
    SeparatorBuilder,
    TextDisplayBuilder
} = require('discord.js');

/** Render support content without coupling topic definitions to Discord builders. */
function createReplyCard({
    title,
    introduction,
    sections = [],
    links = [],
    media = []
}) {
    const card = new ContainerBuilder()
        .setAccentColor(0x4f8fcb)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`## ${title}\n${introduction}`)
        );

    if (sections.length > 0) {
        card.addSeparatorComponents(new SeparatorBuilder());
        for (const section of sections) {
            card.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `**${section.heading}**\n${section.text}`
                )
            );
        }
    }

    if (media.length > 0) {
        card.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(
                ...media.map((item) =>
                    new MediaGalleryItemBuilder()
                        .setURL(item.url)
                        .setDescription(item.description)
                )
            )
        );
    }

    if (links.length > 0) {
        card.addActionRowComponents(
            new ActionRowBuilder().addComponents(
                ...links.map((link) =>
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(link.label)
                        .setURL(link.url)
                )
            )
        );
    }

    return {
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { parse: [] },
        components: [card]
    };
}

module.exports = { createReplyCard };
