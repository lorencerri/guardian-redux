const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class Recent extends Command {
    constructor(client) {
        super({
            name: 'recent'
        });

        this.client = client;
    }

    exec(message, args) {

        // Create Embed
        const embed = new MessageEmbed()
            .setColor(this.client.EMBED_COLOR);
            
        // Variables
        let guild = message.guild;
        let limits = guild.limits;
        let keys = Object.keys(limits);
        
        // Loop Through Keys [Excluding Pings]
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === 'pings') continue;
            
            // Variables
            let msg = '';
            let data = (this.client.db.get(`${keys[i]}_${guild.id}`) || []).slice(-10).reverse();
            
            // Loop through data
            for (var x in data) msg += `\`${this.client.parseTime(data[x].timestamp)}\` | ${this.client.users.get(data[x].executor.id)} ${data[x].type} ${data[x].target.tag}\n`
            embed.addField(`${this.client.camelToString(keys[i])} (${data.length})`, msg || 'none');
            
        }
        
        // Send Message
        message.channel.send(embed);
        
    }

}

module.exports = Recent;
