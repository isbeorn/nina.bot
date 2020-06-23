//const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class UnitConversionCommand extends MessageCommand {
    constructor() {
        super(['!lbs']);
    }

    async process(message) {

        const parts = message.content.split(' ');
        if(parts.length > 1) {
            const value = parseFloat(parts[1]);
            if(!isNaN(value)) {
                const factor = 1/2.2046;
    
                await message.reply(`${value}lbs = ${value * factor} kg`)
            }
            
        }
    }
}

module.exports.UnitConversionCommand = UnitConversionCommand;
