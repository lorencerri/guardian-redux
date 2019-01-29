const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

class Help extends Command {
    constructor(client) {
        super({
            name: 'help'
        });
        
        this.client = client;

    }
    
    exec(message) {
        
      // Create Embed
      const embed = new MessageEmbed()
        .setColor(0x7289DA)
        .setTitle('Guardian Redux')
        .setDescription('This is a simple program that blocks server nuke attempts within staff.')
        .addField('➜ Getting Started', 'Ensure Guardian has the **administrator** permission and is **highest** on the role list.\nYou can view the action limits & change them using **\`g!limits\`**.')
        .addField('➜ Commands', '\`g!limits, g!config, g!recent, g!pings, g!help, g!ping\`')
        .addField('➜ Additional Resources', '**[Support Discord](https://discord.gg/plexidev)\n[Invite This Bot](https://discordapp.com/api/oauth2/authorize?client_id=539012442311884810&permissions=8&scope=bot)\n[Source Code](https://github.com/TrueXPixels/guardian-redux)**')
        .setFooter('Created By Plexi Development - discord.gg/plexidev');
      
      // Send Embed
      message.channel.send(embed)
      
    }
    
}

module.exports = Help;