const Discord = require('discord.js');
const BaseCommand = require('./BaseCommand');

class HelpCommand extends BaseCommand {
  process(message) {
    this.currentMessage = message.content;
    switch (message.content) {
      case '!donate': {
        message.reply('Thank you for considering a donation! Please find more information about how to donate on the homepage at https://nighttime-imaging.eu/donate/');
        break;
      }
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
      case '!conform': {
        const embed = new Discord.RichEmbed()
        .setTitle('ASCOM Conformance check')          
        .setURL('https://github.com/ASCOMInitiative/Conform/releases/')
        .setThumbnail('https://avatars3.githubusercontent.com/u/38851363?s=400&v=4')
        .setColor('0x00AE86')
        .setDescription(`
        Some ASCOM drivers do not conform to the ASCOM interface.          
        This tool performs a comprehensive set of tests on a driver to determine its conformance with the relevant ASCOM interface standard as well as tests to some aspects of driver behavior against the reference implementation. 
        It is adviced to run the conformance checker against those drivers and report issues to the driver manufacturer to fix these issues.
        `)
        .setFooter('Make sure to select the correct driver prior to testing under Options->Select Driver')
        message.reply(embed);
        break;
      }
      case '!32bitascom': {
        const embed = new Discord.RichEmbed()
        .setTitle('How to use 32bit COM objects in 64bit environments')          
        .setURL('https://techtalk.gfi.com/32bit-object-64bit-environment/')
        .setThumbnail('https://www.techtalk.gfi.com/wp-content/uploads/2009/09/Using-32bit-COM-in-64bit-environment-300x300.jpg')
        .setColor('0x00AE86')
        .setDescription(`
        Some ASCOM drivers are only provided as 32bit. Using the above linked method it is possible to make this 32bit ASCOM driver accessible to a 64bit N.I.N.A. application.
        `)
        message.reply(embed);
        break;
        
      }
      case '!help': {
        message.reply('Available commands: !donate, !logs, !docs, !devdocs, !tracker, !issue, !repository, !nina, !nina.docs, !troubleshoot, !conform, !32bitascom');
        break;
      }
      default:
        break;
    }
  }
}

module.exports = HelpCommand;
