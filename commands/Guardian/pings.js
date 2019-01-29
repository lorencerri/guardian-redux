const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

const MAX_PER_PAGE = 25;

class Pings extends Command {
    constructor(client) {
        super({
            name: 'pings'
        });

        this.client = client;
    }

    async exec(message, args) {

        // Variables
        let guild = message.guild;
        let pings = (guild.pings || []);
        let page = 1;
        let pages = Math.ceil(pings.length / MAX_PER_PAGE);
        
        // Create Embed
        const embed = new MessageEmbed()
            .setColor(this.client.EMBED_COLOR);
        
        // Display Pings
        this.display(embed, pings, page, pages, guild);
        
        // Send Message
        let msg = await message.channel.send(embed);
        
        // Pagination
        if (pages > 1) {
            
            // Create Collectors
            const back = msg.createReactionCollector((r, u) => r.emoji.name === '👈' && u.id !== this.client.user.id, { time: 300000 });
            const forward = msg.createReactionCollector((r, u) => r.emoji.name === '👉' && u.id !== this.client.user.id, { time: 300000 });
            
            // Collect
            back.on('collect', (r, u) => {
                page--;
                if (page <= pages && page >= 1) this.display(embed, pings, page, pages, guild);
                msg.edit(embed);
                r.users.remove(u.id);
            });
            
            forward.on('collect', (r, u) => {
                page++;
                if (page <= pages && page >= 1) this.display(embed, pings, page, pages, guild);
                msg.edit(embed);
                r.users.remove(u.id);
            });
            
            back.on('end', c => msg.reactions.removeAll());
            forward.on('end', c => msg.reactions.removeAll());
            
            await msg.react('👈');
            await msg.react('👉');
            
        }
        
    }
    
    display(embed, pings, page, pages, guild) {
        
        page = ( page > pages ? pages : page );
        
        embed.setTitle(`Pings in ${guild.name} | Page ${page} of ${pages}`);
        
        let start = (page - 1) * MAX_PER_PAGE; // 0 25 50
        let end = (page * MAX_PER_PAGE); // 24 49 74
        let range = pings.slice(start, end).reverse();
        let desc = '';

        for (var i = 0; i < range.length; i++) desc += `\`${this.client.parseTime(range[i].timestamp)}\` | ${this.client.users.get(range[i].executor.id)} ${range[i].type} ${range[i].target.tag}\n`;
        
        if (!desc) embed.setDescription('No recent pings...');
        else embed.setDescription(desc).setFooter(`Showing ${start + 1} to ${range.length + start} of ${pings.length} entries`);

    }

}

module.exports = Pings;
