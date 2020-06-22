//const Discord = require('discord.js');
const BaseCommand = require('./BaseCommand');

class NotifyOutdatedRoleCommand extends BaseCommand {
    async process(message) {
        const oldRole = await this.getRole(message);
        
        const member = await message.guild.member(message.author);
        if(member.roles.cache.find(r => r.id === oldRole.id)) {
            await message.reply(`Please read and click the ☑ inside the #welcome channel. You still have the outdated member_ role which will get removed soon!`);
        }
    }

    async getRole(message) {
        if(!this.role) {
            const oldMemberRoleId = process.env.OLD_MEMBER_ROLE;
            this.role = await message.guild.roles.fetch(oldMemberRoleId);
        }
        return this.role;
    }
}

module.exports.NotifyOutdatedRoleCommand = NotifyOutdatedRoleCommand;
