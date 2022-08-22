const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');

class InstallerIssuesCommand extends MessageCommand {
    constructor() {
        super(['!installertroubleshoot'], 'installertroubleshoot', 'Troubleshoot issues with installer being unable to install or uninstall the application');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
        .setTitle('Installer Troubleshooter')
        .setURL('https://support.microsoft.com/en-gb/topic/fix-problems-that-block-programs-from-being-installed-or-removed-cca7d1b6-65a9-3d98-426b-e9f927e1eb4d')
        .setDescription(
            `
            In case your N.I.N.A. installer is unable to install or uninstall the program due to a missing file in Package Cache, try running the Windows Troubleshooter from the link above.
            `
        );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.InstallerIssuesCommand = InstallerIssuesCommand;
