const BaseCommand = require('./BaseCommand');

class GalleryWatchdogCommand extends BaseCommand {
    async process(message) {
        if (message.channel.id == process.env.GALLERY_CHANNEL) {
            if (message.attachments.size === 0) {
                await message.delete();

                const member = message.member;

                await message.author.send(
                    `${member} please don't chat inside gallery. Only post pictures and acquisition details there in one single post. If you need to add more details please edit the original post. Thank you.`
                );
            }
        }
    }
}

module.exports = GalleryWatchdogCommand;
