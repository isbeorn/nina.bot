const BaseCommand = require('./BaseCommand');

class HelpCommand extends BaseCommand {
    process(message) {
        switch(message.content) {
            case '!logs': {
                message.reply('%LOCALAPPDATA%\NINA\Logs');
                break;
            }
            case '!docs': {
                message.reply('https://nighttime-imaging.eu/docs/develop/site/');
                break;
            }
        }
    }
}

module.exports = HelpCommand;