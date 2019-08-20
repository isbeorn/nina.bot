const BaseCommand = require('./BaseCommand');

class HelpCommand extends BaseCommand {
  process(message) {
    this.currentMessage = message.content;
    switch (message.content) {
      case '!logs': {
        message.reply('%LOCALAPPDATA%\\NINA\\Logs');
        break;
      }
      case '!docs': {
        message.reply('https://nighttime-imaging.eu/docs/develop/site/');
        break;
      }
      case '!tracker':
      case '!issue': {
        message.reply('https://bitbucket.org/Isbeorn/nina/issues?status=new&status=open');
        break;
      }
      case '!repository': {
        message.reply('https://bitbucket.org/Isbeorn/nina');
        break;
      }
      case '!troubleshoot': {
        message.reply('https://nighttime-imaging.eu/docs/develop/site/troubleshooting/');
        break;
      }
      case '!help': {
        message.reply('Available commands: !logs, !docs, !tracker, !issue, !repository, !troubleshoot, !help');
        break;
      }
      default:
        break;
    }
  }
}

module.exports = HelpCommand;
