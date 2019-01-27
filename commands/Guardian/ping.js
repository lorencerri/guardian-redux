const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class Ping extends Command {
    constructor(client) {
        super({
            name: 'ping'
        });
        
        this.client = client;
    }
    
    exec(message) {
        
        const embed = new MessageEmbed()
            .setColor(this.client.EMBED_COLOR)
            .setFooter(`${this.client.main ? '[Primary Node]' : '[Fallback Node]'} Pong!`);

        return message.channel.send(embed);
        
    }
    
}

module.exports = Ping;
