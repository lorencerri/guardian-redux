const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class Limits extends Command {
    constructor(client) {
        super({
            name: 'limits'
        });

        this.client = client;
    }

    exec(message, args) {

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(this.client.EMBED_COLOR);
            
        // Check Permissions
        if (this.client.main && !message.member.hasPermission('ADMINISTRATOR'))
            return message.channel.send(embed.setFooter('Sorry, only administrators can run this command.'));
    
        // Variables
        let guild = message.guild;
        let limits = guild.limits;
        let index = args.shift();
        let value = args.shift();
        
        // Value Provided?
        if (!value) {
            
            // Return if not main node
            if (!this.client.main) return;
            
            // Update Embed
            embed.setTitle(`Server Limits for ${guild.name}`);
            embed.addField(`Kicks & Bans`, `**1.** Per Minute: **\`${limits.memberRemovals.minute}\`**\n **2.** Per Hour: **\`${limits.memberRemovals.hour}\`**`, true);
            embed.addField(`Channel Creations`, `**3.** Per Minute: **\`${limits.channelCreations.minute}\`**\n **4.** Per Hour: **\`${limits.channelCreations.hour}\`**`, true);
            embed.addField(`Channel Deletions`, `**5.** Per Minute: **\`${limits.channelDeletions.minute}\`**\n **6.** Per Hour: **\`${limits.channelDeletions.hour}\`**`, true);
            embed.addField(`Role Creations`, `**7.** Per Minute: **\`${limits.roleCreations.minute}\`**\n **8.** Per Hour: **\`${limits.roleCreations.hour}\`**`, true);
            embed.addField(`Role Deletions`, `**9.** Per Minute: **\`${limits.roleDeletions.minute}\`**\n **10.** Per Hour: **\`${limits.roleDeletions.hour}\`**`, true);
            embed.addField(`Pings`, `**11.** Per Minute: **\`${limits.pings.minute}\`**`, true);
            embed.setFooter('All of the user\'s roles are auto-removed if these limits are reached [Excluding Pings]');
            embed.setDescription(`Updating Limits: **\`g!limits index value\`**`);
            
            // Send Embed
            return message.channel.send(embed);
            
        }
        
        // Check Index Bounds
        if (index > 11 || index < 1)
            return message.channel.send(embed.setFooter(`[Error] Choose an index between 1-11`));
            
        // Check Value Bounds
        if (value > 30 || index < 1)
            return message.channel.send(embed.setFooter(`[Error] Choose a value between 1-30`));
            
        // Update Database
        this.client.db.set(`limits_${index}_${guild.id}`, value);
        
        // Send Confirmation
        message.channel.send(embed.setFooter(`${this.client.main ? '[Primary Node]' : '[Fallback Node]'} Index #${index} successfully updated to ${value}`));
    
    }

}

module.exports = Limits;
