const { MessageFlags, SlashCommandBuilder } = require('discord.js');
const { MessageCommand } = require('./MessageCommand');
const { createReplyCard } = require('../ReplyCard');

// Match N.I.N.A.'s AstroUtil.ArcsecPerPixel: micrometers and millimeters.
const ARCSECONDS_PER_RADIAN_PER_1000 = ((180 / Math.PI) * 3600) / 1000;

class ImageScaleCommand extends MessageCommand {
    constructor() {
        super(
            [],
            'imagescale',
            'Calculate image scale and optional field of view'
        );
    }

    getApplicationCommands() {
        return [
            new SlashCommandBuilder()
                .setName(this.interactionMessage)
                .setDescription(this.interactionHelp)
                .addNumberOption((option) =>
                    option
                        .setName('pixelsize')
                        .setDescription(
                            'Unbinned sensor pixel size in micrometers (positive)'
                        )
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('focallength')
                        .setDescription(
                            'Effective focal length in millimeters, including reducers or Barlows (positive)'
                        )
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName('width')
                        .setDescription(
                            'Native sensor width in pixels; also provide height'
                        )
                        .setMinValue(1)
                )
                .addIntegerOption((option) =>
                    option
                        .setName('height')
                        .setDescription(
                            'Native sensor height in pixels; also provide width'
                        )
                        .setMinValue(1)
                )
        ];
    }

    async process(interaction) {
        const pixelSize = interaction.options.getNumber('pixelsize');
        const focalLength = interaction.options.getNumber('focallength');
        const width = interaction.options.getInteger('width');
        const height = interaction.options.getInteger('height');
        const hasWidth = width != null;
        const hasHeight = height != null;
        let error;

        if (
            ![pixelSize, focalLength].every(
                (value) => Number.isFinite(value) && value > 0
            )
        ) {
            error =
                'Pixel size and focal length must be positive, finite numbers. Use micrometers for pixel size and millimeters for focal length.';
        } else if (hasWidth !== hasHeight) {
            error =
                'Provide both width and height in native sensor pixels, or omit both to calculate image scale only.';
        } else if (
            hasWidth &&
            ![width, height].every(
                (value) => Number.isSafeInteger(value) && value > 0
            )
        ) {
            error =
                'Sensor dimensions must be positive, safe integers in native sensor pixels.';
        }

        if (error) {
            await this.replyError(interaction, error);
            return;
        }

        const scale =
            (pixelSize / focalLength) * ARCSECONDS_PER_RADIAN_PER_1000;
        const fieldOfView = hasWidth
            ? [(scale * width) / 60, (scale * height) / 60]
            : [];
        if (
            ![scale, ...fieldOfView].every(
                (value) => Number.isFinite(value) && value > 0
            )
        ) {
            await this.replyError(
                interaction,
                'These values produce a result outside the supported numeric range. Use less extreme values.'
            );
            return;
        }

        const sections = [
            {
                heading: 'Inputs',
                text: `Pixel size: **${pixelSize} micrometers**\nEffective focal length: **${focalLength} mm**`
            }
        ];
        if (hasWidth) {
            sections.push({
                heading: 'Approximate field of view',
                text: `**${fieldOfView[0].toFixed(4)} x ${fieldOfView[1].toFixed(4)} arcmin** (horizontal x vertical)\nNative sensor: **${width} x ${height} pixels**`
            });
        }
        sections.push({
            heading: 'Using this result',
            text: 'This is the scale of an unbinned sensor. Use the effective focal length of your optical train, including reducers or Barlows. Field of view uses the small-angle approximation.'
        });
        await interaction.reply(
            createReplyCard({
                title: 'N.I.N.A. image scale',
                introduction: `**${scale.toFixed(4)} arcsec/pixel**`,
                sections
            })
        );
    }

    async replyError(interaction, content) {
        await interaction.reply({
            content,
            flags: MessageFlags.Ephemeral,
            allowedMentions: { parse: [] }
        });
    }
}

module.exports = { ImageScaleCommand };
