const mathjs = require('mathjs');
const { SlashCommandBuilder } = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class UnitConversionCommand extends MessageCommand {
    constructor() {
        super(['!lbs', '!kg']);
    }

    getApplicationCommands() {
        return [
            new SlashCommandBuilder()
                .setName('lbs')
                .setDescription('Convert pounds to kilograms')
                .addNumberOption((option) =>
                    option
                        .setName('value')
                        .setDescription('Pounds to convert')
                        .setRequired(true)
                ),
            new SlashCommandBuilder()
                .setName('kg')
                .setDescription('Convert kilograms to pounds')
                .addNumberOption((option) =>
                    option
                        .setName('value')
                        .setDescription('Kilograms to convert')
                        .setRequired(true)
                )
        ];
    }

    handlesInteraction(interaction) {
        return ['lbs', 'kg'].includes(interaction.commandName);
    }

    async process(interaction) {
        const value = interaction.options.getNumber('value');
        let translated;
        let baseUnit;
        let translatedUnit;

        if (interaction.commandName === 'lbs') {
            baseUnit = 'lbs';
            translatedUnit = 'kg';
            translated = this.translateByFactor(value, 1 / 2.2046);
        } else {
            baseUnit = 'kg';
            translatedUnit = 'lbs';
            translated = this.translateByFactor(value, 2.2046);
        }

        await interaction.reply(
            `${value}${baseUnit} = ${translated}${translatedUnit}`
        );
    }

    translateByFactor(value, factor, addition = 0) {
        return mathjs.round(value * factor + addition, 2);
    }
}

module.exports.UnitConversionCommand = UnitConversionCommand;
