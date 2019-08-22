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
        message.reply('https://nighttime-imaging.eu/docs/master/site/');
        break;
      }
      case '!devdocs': {
        message.reply('https://nighttime-imaging.eu/docs/develop/site/');
        break;
      }
      case '!tracker':
      case '!issue': {
        message.reply('https://bitbucket.org/Isbeorn/nina/issues?status=new&status=open');
        break;
      }
      case '!repository':
      case '!nina': {
        message.reply('https://bitbucket.org/Isbeorn/nina');
        break;
      }
      case '!nina.docs': {
        message.reply('https://bitbucket.org/Isbeorn/nina.docs');
        break;
      }
      case '!troubleshoot': {
        message.reply('https://nighttime-imaging.eu/docs/develop/site/troubleshooting/');
        break;
      }
      case '!help': {
        message.reply('Available commands: !logs, !docs, !devdocs, !tracker, !issue, !repository, !nina, !nina.docs, !troubleshoot, !help');
        break;
      }
      default:
        break;
    }
  }
}

module.exports = HelpCommand;
