const mathjs = require('mathjs');
const { SlashCommandBuilder } = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

const UNIT_DEFINITIONS = {
    g: { dimension: 'mass', factor: 0.001 },
    gram: { dimension: 'mass', factor: 0.001 },
    grams: { dimension: 'mass', factor: 0.001 },
    kg: { dimension: 'mass', factor: 1 },
    kilogram: { dimension: 'mass', factor: 1 },
    kilograms: { dimension: 'mass', factor: 1 },
    lb: { dimension: 'mass', factor: 1 / 2.2046226218, label: 'lbs' },
    lbs: { dimension: 'mass', factor: 1 / 2.2046226218 },
    pound: { dimension: 'mass', factor: 1 / 2.2046226218, label: 'lbs' },
    pounds: { dimension: 'mass', factor: 1 / 2.2046226218, label: 'lbs' },
    oz: { dimension: 'mass', factor: 0.028349523125 },
    ounce: { dimension: 'mass', factor: 0.028349523125, label: 'oz' },
    ounces: { dimension: 'mass', factor: 0.028349523125, label: 'oz' },

    mm: { dimension: 'length', factor: 0.001 },
    millimeter: { dimension: 'length', factor: 0.001, label: 'mm' },
    millimeters: { dimension: 'length', factor: 0.001, label: 'mm' },
    cm: { dimension: 'length', factor: 0.01 },
    centimeter: { dimension: 'length', factor: 0.01, label: 'cm' },
    centimeters: { dimension: 'length', factor: 0.01, label: 'cm' },
    m: { dimension: 'length', factor: 1 },
    meter: { dimension: 'length', factor: 1, label: 'm' },
    meters: { dimension: 'length', factor: 1, label: 'm' },
    km: { dimension: 'length', factor: 1000 },
    kilometer: { dimension: 'length', factor: 1000, label: 'km' },
    kilometers: { dimension: 'length', factor: 1000, label: 'km' },
    in: { dimension: 'length', factor: 0.0254 },
    inch: { dimension: 'length', factor: 0.0254, label: 'in' },
    inches: { dimension: 'length', factor: 0.0254, label: 'in' },
    ft: { dimension: 'length', factor: 0.3048 },
    foot: { dimension: 'length', factor: 0.3048, label: 'ft' },
    feet: { dimension: 'length', factor: 0.3048, label: 'ft' },
    yd: { dimension: 'length', factor: 0.9144 },
    yard: { dimension: 'length', factor: 0.9144, label: 'yd' },
    yards: { dimension: 'length', factor: 0.9144, label: 'yd' },
    mi: { dimension: 'length', factor: 1609.344 },
    mile: { dimension: 'length', factor: 1609.344, label: 'mi' },
    miles: { dimension: 'length', factor: 1609.344, label: 'mi' },

    c: { dimension: 'temperature', label: 'C' },
    celcius: { dimension: 'temperature', label: 'C' },
    celsius: { dimension: 'temperature', label: 'C' },
    f: { dimension: 'temperature', label: 'F' },
    fahrenheit: { dimension: 'temperature', label: 'F' },
    k: { dimension: 'temperature', label: 'K' },
    kelvin: { dimension: 'temperature', label: 'K' },

    ms: { dimension: 'time', factor: 0.001 },
    millisecond: { dimension: 'time', factor: 0.001, label: 'ms' },
    milliseconds: { dimension: 'time', factor: 0.001, label: 'ms' },
    s: { dimension: 'time', factor: 1 },
    sec: { dimension: 'time', factor: 1, label: 's' },
    second: { dimension: 'time', factor: 1, label: 's' },
    seconds: { dimension: 'time', factor: 1, label: 's' },
    min: { dimension: 'time', factor: 60 },
    minute: { dimension: 'time', factor: 60, label: 'min' },
    minutes: { dimension: 'time', factor: 60, label: 'min' },
    h: { dimension: 'time', factor: 3600 },
    hr: { dimension: 'time', factor: 3600, label: 'h' },
    hour: { dimension: 'time', factor: 3600, label: 'h' },
    hours: { dimension: 'time', factor: 3600, label: 'h' },
    day: { dimension: 'time', factor: 86400, label: 'd' },
    days: { dimension: 'time', factor: 86400, label: 'd' },
    d: { dimension: 'time', factor: 86400 },

    deg: { dimension: 'angle', factor: 1 },
    degree: { dimension: 'angle', factor: 1, label: 'deg' },
    degrees: { dimension: 'angle', factor: 1, label: 'deg' },
    arcmin: { dimension: 'angle', factor: 1 / 60 },
    arcminute: { dimension: 'angle', factor: 1 / 60, label: 'arcmin' },
    arcminutes: { dimension: 'angle', factor: 1 / 60, label: 'arcmin' },
    arcsec: { dimension: 'angle', factor: 1 / 3600 },
    arcsecond: { dimension: 'angle', factor: 1 / 3600, label: 'arcsec' },
    arcseconds: { dimension: 'angle', factor: 1 / 3600, label: 'arcsec' },
    rad: { dimension: 'angle', factor: 180 / Math.PI },
    radian: { dimension: 'angle', factor: 180 / Math.PI, label: 'rad' },
    radians: { dimension: 'angle', factor: 180 / Math.PI, label: 'rad' },

    px: { dimension: 'pixel', factor: 1 },
    pixel: { dimension: 'pixel', factor: 1, label: 'px' },
    pixels: { dimension: 'pixel', factor: 1, label: 'px' },

    'm/s': { dimension: 'speed', factor: 1 },
    mps: { dimension: 'speed', factor: 1, label: 'm/s' },
    'km/h': { dimension: 'speed', factor: 1 / 3.6 },
    kph: { dimension: 'speed', factor: 1 / 3.6, label: 'km/h' },
    mph: { dimension: 'speed', factor: 0.44704 },

    b: { dimension: 'bytes', factor: 1, label: 'B' },
    byte: { dimension: 'bytes', factor: 1, label: 'B' },
    bytes: { dimension: 'bytes', factor: 1, label: 'B' },
    kb: { dimension: 'bytes', factor: 1000, label: 'KB' },
    mb: { dimension: 'bytes', factor: 1000000, label: 'MB' },
    gb: { dimension: 'bytes', factor: 1000000000, label: 'GB' },
    kib: { dimension: 'bytes', factor: 1024, label: 'KiB' },
    mib: { dimension: 'bytes', factor: 1048576, label: 'MiB' },
    gib: { dimension: 'bytes', factor: 1073741824, label: 'GiB' }
};

const SUPPORTED_UNIT_NAMES = Object.keys(UNIT_DEFINITIONS).sort();

class UnitConversionCommand extends MessageCommand {
    constructor() {
        super([], 'convert', 'Convert common astronomy units');
    }

    getApplicationCommands() {
        return [
            new SlashCommandBuilder()
                .setName('convert')
                .setDescription('Convert common astronomy units')
                .addNumberOption((option) =>
                    option
                        .setName('value')
                        .setDescription('Value to convert')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('from')
                        .setDescription('Source unit')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('to')
                        .setDescription('Target unit')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ];
    }

    handlesInteraction(interaction) {
        return interaction.commandName === 'convert';
    }

    async process(interaction) {
        const value = interaction.options.getNumber('value');
        const from = interaction.options.getString('from');
        const to = interaction.options.getString('to');
        const conversion = this.convert(value, from, to);

        if (!conversion) {
            await interaction.reply(
                `Unsupported conversion. Supported units: ${SUPPORTED_UNIT_NAMES.join(', ')}`
            );
            return;
        }

        await interaction.reply(this.formatConversion(conversion));
    }

    async autocomplete(interaction) {
        const focused = interaction.options.getFocused().toLowerCase();
        const choices = SUPPORTED_UNIT_NAMES.filter((unit) =>
            unit.includes(focused)
        )
            .slice(0, 25)
            .map((unit) => ({
                name: unit,
                value: unit
            }));

        await interaction.respond(choices);
    }

    convert(value, fromUnit, toUnit) {
        const from = this.getUnit(fromUnit);
        const to = this.getUnit(toUnit);

        if (!from || !to || from.dimension !== to.dimension) {
            return undefined;
        }

        const translated =
            from.dimension === 'temperature'
                ? this.convertTemperature(value, from.label, to.label)
                : (value * from.factor) / to.factor;

        return {
            value,
            fromUnit: from.label,
            translated: this.round(translated),
            toUnit: to.label
        };
    }

    getUnit(unit) {
        if (typeof unit !== 'string') {
            return undefined;
        }

        const normalized = unit.trim().toLowerCase();
        const definition = UNIT_DEFINITIONS[normalized];
        if (!definition) {
            return undefined;
        }

        return {
            ...definition,
            label: definition.label || normalized
        };
    }

    convertTemperature(value, fromUnit, toUnit) {
        let celsius;
        switch (fromUnit) {
            case 'F':
                celsius = (value - 32) * (5 / 9);
                break;
            case 'K':
                celsius = value - 273.15;
                break;
            default:
                celsius = value;
                break;
        }

        switch (toUnit) {
            case 'F':
                return celsius * (9 / 5) + 32;
            case 'K':
                return celsius + 273.15;
            default:
                return celsius;
        }
    }

    formatConversion(conversion) {
        return `${conversion.value}${conversion.fromUnit} = ${conversion.translated}${conversion.toUnit}`;
    }

    round(value) {
        return mathjs.round(value, 4);
    }

    translateByFactor(value, factor, addition = 0) {
        return mathjs.round(value * factor + addition, 2);
    }
}

module.exports.UnitConversionCommand = UnitConversionCommand;
