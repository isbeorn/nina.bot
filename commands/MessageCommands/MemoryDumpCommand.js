const { MessageCommand } = require('./MessageCommand');

class MemoryDumpCommand extends MessageCommand {
    constructor() {
        super(['!memorydump'], 'memorydump', 'How to create a memory dump');
    }

    async process(message) {
        const response = `
        To create a memory dump file to analyze problems of a running N.I.N.A. instance you can create it with this tool:
        https://learn.microsoft.com/en-us/sysinternals/downloads/procdump
        Once downloaded you can then run the following command
        \`procdump.exe -ma NINA.exe\`
                `;
        
        await message.reply(response);
    }
}

module.exports.MemoryDumpCommand = MemoryDumpCommand;
