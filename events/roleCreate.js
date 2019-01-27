exports.run = async (client, role) => {
    
    // Verify Bot's Permissions
    if (!role.guild || !role.guild.me.hasPermission('ADMINISTRATOR')) return;
    
    // Fetch Last Audit Entry
    let entry = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' });
    entry = entry.entries.first();
    if (!entry) return;

    // Variables
    let target = entry.target;
    let executor = entry.executor;
    let guild = role.guild;
    let guildKey = `roleCreations_${guild.id}`
    let memberKey = `roleCreations_${guild.id}_${executor.id}`;
    
    let data = {
        target: { id: target.id, tag: `@${target.name}` },
        executor: { id: executor.id, tag: `@${executor.username}#${executor.discriminator}`},
        timestamp: Date.now(),
        type: 'created role'
    }
    
    // Update Database (Guild)
    if (!client.db.get(guildKey)) client.db.set(guildKey, [data]);
    else client.db.push(guildKey, data);
    
    // Update Database (Member)
    if (!client.db.get(memberKey)) client.db.set(memberKey, [data]);
    else client.db.push(memberKey, data);
    
    // Check Limits
    guild.checkLimits('roleCreations', executor.id);
    
}
