exports.run = (client, message) => {
    
    if (!message.channel.guild || !message.guild) return;
    
    // Variables
    let userInfo = { id: message.author.id, tag: message.author.tag };
    let guildPings = client.db.get(`pings_${message.guild.id}`) || [];
    let memberPings = client.pings.get(`${message.guild.id}_${userInfo.id}`) || [];
    let mentions = message.mentions;
    
    if (mentions.everyone) { // Everyone/Here
        memberPings.push({ target: { tag: `everyone/@here` }, type: 'pinged', executor: userInfo, timestamp: Date.now() });
        guildPings.push({ target: { tag: `everyone/@here` }, type: 'pinged', executor: userInfo, timestamp: Date.now() });
    }

    mentions.members.filter(m => !m.user.bot && m.id !== userInfo.id).forEach(member => { // Members
        memberPings.push({ target: { tag: member.user.tag }, type: 'pinged', executor: userInfo, timestamp: Date.now() });
        guildPings.push({ target: { tag: member.user.tag }, type: 'pinged', executor: userInfo, timestamp: Date.now() });
    })
    
    mentions.roles.forEach(role => { // Roles
        memberPings.push({ target: { tag: role.name }, type: 'pinged', executor: userInfo, timestamp: Date.now() });
        guildPings.push({ target: { tag: role.name }, type: 'pinged', executor: userInfo, timestamp: Date.now() });
    });

    if (memberPings.length >= 1 && guildPings.length >= 1) { // Check Limits
        client.db.set(`pings_${message.guild.id}`, guildPings);
        client.pings.set(`${message.guild.id}_${userInfo.id}`, memberPings);
        message.guild.checkLimits('pings', userInfo.id);
    }
    
    // Return Statements Pt.1
    if (!message.content.startsWith(client.prefix)) return;
    if (message.author.bot) return;
    
    // Declare & Initialize Variables
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    // Return Statements Pt.2
    if (!client.commands.has(cmd)) return;
    if (!client.main && !['limits', 'ping'].includes(cmd)) return;
    
    // Run Command
    const command = client.commands.get(cmd);
    command.exec(message, args);
    
}
