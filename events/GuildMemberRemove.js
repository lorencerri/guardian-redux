exports.run = async (client, member) => {
    
    // Verify Bot's Permissions
    if (!member.guild.me.hasPermission('ADMINISTRATOR')) return;
    
    // Fetch Last Audit Entry
    let entry = await member.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK' });
    entry = entry.entries.first();
    if (!entry) return;
    
    // Variables
    let target = entry.target;
    let executor = entry.executor;
    let guild = member.guild;
    let guildKey = `memberRemovals_${guild.id}`
    let memberKey = `memberRemovals_${guild.id}_${executor.id}`;
    
    // Check if they weren't kicked
    if (target.id !== member.id) return;
    let data = {
        target: { id: target.id, tag: `@${target.username}#${target.discriminator}` },
        executor: { id: executor.id, tag: `@${executor.username}#${executor.discriminator}`},
        timestamp: Date.now(),
        type: 'kicked'
    }
    
    // Ignore Bots
    if (target.bot && client.ignoreBots) return;
    
    // Update Database (Guild)
    if (!client.db.get(guildKey)) client.db.set(guildKey, [data]);
    else client.db.push(guildKey, data);
    
    // Update Database (Member)
    if (!client.db.get(memberKey)) client.db.set(memberKey, [data]);
    else client.db.push(memberKey, data);
    
    // Check Limits
    guild.checkLimits('memberRemovals', executor.id);
    
}
