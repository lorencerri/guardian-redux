const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class Config extends Command {
    constructor(client) {
        super({
            name: 'config'
        });

        this.client = client;
    }

    exec(message, args) {

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(this.client.EMBED_COLOR);
            
        // Check Permissions
        if (!message.member.hasPermission('ADMINISTRATOR'))
            return message.channel.send(embed.setFooter('Sorry, only administrators can run this command.'));
    
        // Variables
        let guild = message.guild;
        let config = guild.config;
        let index = args.shift();
        let value = args.join(' ');
        
        let mutedRole = guild.roles.get(config.mutedRole.data);
        let modLog = guild.channels.get(config.modLog.data);
        
        // Value Provided?
        if (!value) {
            
            // Return if not main node
            if (!this.client.main) return;
            
            // Update Embed
            embed.setTitle(`Configuration for ${guild.name}`);
            embed.addField(`Roles`, `**1.** Muted Role: **\`${(mutedRole ? mutedRole.name : 'none')}\`**`, true);
            embed.addField(`Channels`, `**2.** Mod Log: **\`${(modLog ? `#${modLog.name}` : 'none')}\`**`)
            embed.setDescription(`Updating Config: **\`g!config <index> [ value | "none" ]\`**`);
            
            // Send Embed
            return message.channel.send(embed);
            
        }
        
        // Config
        switch (index) {
            case '1':
                
                if (value.toLowerCase() === 'none') {
                    this.client.db.delete(`mutedRole_${guild.id}`);
                    return message.channel.send(embed.setFooter(`${this.client.main ? '[Primary Node]' : '[Fallback Node]'} Muted role successfully removed`));
                }
                
                let role = guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                if (!role) return message.channel.send(embed.setFooter('[Error] Invalid role name provided'));
                
                this.client.db.set(`mutedRole_${guild.id}`, role.id);
                
                message.channel.send(embed.setFooter(`${this.client.main ? '[Primary Node]' : '[Fallback Node]'} Muted role successfully updated to @${role.name}`));
            
            break;
            case '2':
                
                if (value.toLowerCase() === 'none') {
                    this.client.db.delete(`mutedRole_${guild.id}`);
                    return message.channel.send(embed.setFooter(`${this.client.main ? '[Primary Node]' : '[Fallback Node]'} Mod log successfully disabled`));
                }
                
                let channel = message.mentions.channels.first();
                if (!channel) return message.channel.send(embed.setFooter('[Error] No channel mentioned'));
                
                this.client.db.set(`modLog_${guild.id}`, channel.id);
                
                message.channel.send(embed.setFooter(`${this.client.main ? '[Primary Node]' : '[Fallback Node]'} Mod log channel successfully set to #${channel.name}`));
                
            break;
            default:
                if (this.client.main) message.channel.send(embed.setFooter('[Error] Invalid index # provided'))
            break;
        }
        
    }

}

module.exports = Config;
