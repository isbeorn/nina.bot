const Discord = require('discord.js');
const BaseCommand = require('./BaseCommand');

class HelpCommand extends BaseCommand {
  async process(message) {
    this.currentMessage = message.content;
    switch (message.content) {
      case '!donate': {
        await message.reply('Thank you for considering a donation! Please find more information about how to donate on the homepage at https://nighttime-imaging.eu/donate/');
        break;
      }
      case '!logs': {
        const embed = new Discord.RichEmbed()
        .setTitle('N.I.N.A. Logs')          
        .setThumbnail('https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png')
        .setColor('0x00AE86')
        .setDescription(`
        The logs written by N.I.N.A. can be found at "%LOCALAPPDATA%\\NINA\\Logs".
        Furthermore the logs can be opened directly inside the application via the button next to Options->Log Level
        `)
        .setFooter('You can drag and drop the log file into N.I.N.A. discord to report problems')
        await message.reply(embed);
        break;
      }
      case '!docs': {
        const embed = new Discord.RichEmbed()
        .setTitle('N.I.N.A. Documentation')          
        .setURL('https://nighttime-imaging.eu/docs/master/site/')
        .setThumbnail('https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png')
        .setColor('0x00AE86')
        .setDescription(`
        Detailed manual about the application as well as some tipps and tricks and how to contribute to the project
        `)
        .setFooter('This documentation covers the current release build')
        await message.reply(embed);
        break;
      }
      case '!devdocs': {
        const embed = new Discord.RichEmbed()
        .setTitle('N.I.N.A. Documentation')          
        .setURL('https://nighttime-imaging.eu/docs/develop/site/')
        .setThumbnail('https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png')
        .setColor('0x00AE86')
        .setDescription(`
        Detailed manual about the application as well as some tipps and tricks and how to contribute to the project
        `)
        .setFooter('This documentation covers the current nightly build')
        await message.reply(embed);
        break;
      }
      case '!tracker':
      case '!issue': {
        const embed = new Discord.RichEmbed()
        .setTitle('N.I.N.A. Issue Tracker')          
        .setURL('https://bitbucket.org/Isbeorn/nina/issues?status=new&status=open')
        .setThumbnail('https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png')
        .setColor('0x00AE86')
        .setDescription(`
        Please use the issue tracker for bug reports. The more details you put into the report, the more likely it is that someone can fix it quickly.
        Furthermore the tracker can be used for suggestions and improvements.
        `)
        await message.reply(embed);
        break;
      }
      case '!repository':
      case '!nina': {
        await message.reply('https://bitbucket.org/Isbeorn/nina');
        break;
      }
      case '!nina.docs': {
        const embed = new Discord.RichEmbed()
        .setTitle('N.I.N.A. Documentation Repository')          
        .setURL('https://bitbucket.org/Isbeorn/nina.docs')
        .setThumbnail('https://nighttime-imaging.eu/docs/master/site/images/nina-icon.png')
        .setColor('0x00AE86')
        .setDescription(`
        This repository covers the source code for the N.I.N.A. documentation. If you want to improve the documentation, this is the place to go to.        
        `)
        await message.reply(embed);
        break;
      }
      case '!troubleshoot': {
        await message.reply('https://nighttime-imaging.eu/docs/develop/site/troubleshooting/');
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
        await message.reply(embed);
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
        await message.reply(embed);
        break;
        
      }
      case '!help': {
        await message.reply('Available commands: !donate, !logs, !docs, !devdocs, !tracker, !issue, !repository, !nina, !nina.docs, !troubleshoot, !conform, !32bitascom');
        break;
      }
      default:
        break;
    }
  }
}

module.exports = HelpCommand;
