const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class ConformCommand extends MessageCommand {
    constructor() {
        super(['!conform'], 'conform', 'How to check ASCOM conformance');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('ASCOM Conformance check')
            .setURL('https://github.com/ASCOMInitiative/ConformU/releases')
            .setThumbnail(
                'https://avatars3.githubusercontent.com/u/38851363?s=400&v=4'
            )
            .setDescription(
                `
                Some ASCOM drivers do not conform to the ASCOM interface.          
                This tool performs a comprehensive set of tests on a driver to determine its conformance with the relevant ASCOM interface standard as well as tests to some aspects of driver behavior against the reference implementation. 
                It is adviced to run the conformance checker against those drivers and report issues to the driver manufacturer to fix these issues.
                `
            )
            .setFooter({
                text: 'Make sure to select the correct driver prior to testing under Options->Select Driver'
            });
        await message.reply({ embeds: [embed] });
    }
}

module.exports.ConformCommand = ConformCommand;
