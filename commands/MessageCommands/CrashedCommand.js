const { MessageCommand } = require('./MessageCommand');

class CrashedCommand extends MessageCommand {
    constructor() {
        super(['!crash', "!crashed"], 'crash', 'In case of application crashes');
    }

    async process(message) {
        const response = `
        **In case of application crashes**

When the application crashes the log file will most likely not contain any details about the crash, as the application is not able to write this info while crashing.

You can however check if a crash dump is available at \`%localappdata%\\NINA\\CrashDump\` and share it.

If no crash dump is available you can also scan the windows event viewer. ('https://nighttime-imaging.eu/docs/master/site/troubleshooting/general/#event-viewer')
                `;
        
        await message.reply(response);
    }
}

module.exports.CrashedCommand = CrashedCommand;
