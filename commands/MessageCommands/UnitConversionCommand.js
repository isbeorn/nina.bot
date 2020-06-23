const mathjs = require('mathjs');
const { MessageCommand } = require('./MessageCommand');

class UnitConversionCommand extends MessageCommand {
    constructor() {
        super(['!lbs', '!kg']);
    }

    async process(message) {        
        const parts = message.content.split(' ');
        if(parts.length > 1) {
            const value = parseFloat(parts[1]);
            let translated = NaN;
            let baseUnit;
            let translatedUnit;
            switch(parts[0]) {
                case '!lbs': {
                    const factor = 1/2.2046;
                    baseUnit = 'lbs';
                    translatedUnit = 'kg'
                    translated = this.translateByFactor(value, factor);
                    break;
                }
                case '!kg': {
                    const factor = 2.2046;
                    baseUnit = 'kg';
                    translatedUnit = 'lbs'
                    translated = this.translateByFactor(value, factor);
                    break;
                }
            }

            if(!isNaN(translated)) {
                await message.reply(`${value}${baseUnit} = ${translated}${translatedUnit}`)
            }
        }
    }

    translateByFactor(value, factor, addition = 0) {
        return mathjs.round(value * factor + addition,2);
    }
}

module.exports.UnitConversionCommand = UnitConversionCommand;
