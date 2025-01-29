const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class CommandLineCommand extends MessageCommand {
    constructor() {
        super(['!cmd'], 'cmd', 'N.I.N.A. Command Line Arguments');
    }

    async process(message) {
        const response = `
        **N.I.N.A. Command Line Arguments**
        \`\`\`
        -p, --profileid         Load a profile for a given ID at startup.
        -s, --sequencefile      Load a sequence file at startup.
        -r, --runsequence       Start a loaded sequence (-s) and switch to the Imaging tab.
                                (Default: false)
        -x, --exitaftersequence Exit the application after the sequence is finished.
                                (Default: false)
        -d, --debug             Enable Debug Mode to reveal additional UI elements for
                                development and testing purposes. (Default: false)
        -g, --disable-hardware-acceleration        
                                Disables UI hardware acceleration
        --help                  Display this help screen.
        --version               Display version information.
        \`\`\`
                `;
        
                await message.reply(response);
    }
}

module.exports.CommandLineCommand = CommandLineCommand;
