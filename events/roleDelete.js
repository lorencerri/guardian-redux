exports.run = async (client, role) => {
    
    // Verify Bot's Permissions
    if (!role.guild || !role.guild.me.hasPermission('ADMINISTRATOR')) return;
    
    // Fetch Last Audit Entry
    let entry = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_DELETE' });
    entry = entry.entries.first();
    if (!entry) return;

    // Variables
    let target = entry.target;
    let executor = entry.executor;
    let guild = role.guild;
    let guildKey = `roleDeletions_${guild.id}`
    let memberKey = `roleDeletions_${guild.id}_${executor.id}`;

    let data = {
        target: { id: target.id, tag: `@${entry.changes[3].old}` },
        executor: { id: executor.id, tag: `@${executor.username}#${executor.discriminator}`},
        timestamp: Date.now(),
        type: 'deleted role'
    }
    
    // Update Database (Guild)
    if (!client.db.get(guildKey)) client.db.set(guildKey, [data]);
    else client.db.push(guildKey, data);
    
    // Update Database (Member)
    if (!client.db.get(memberKey)) client.db.set(memberKey, [data]);
    else client.db.push(memberKey, data);
    
    // Check Limits
    guild.checkLimits('roleDeletions', executor.id);
    
}
