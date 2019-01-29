const {
    Structures,
    MessageEmbed
} = require('discord.js');

Structures.extend('Guild', Guild => {
    class GuildExt extends Guild {
        constructor(...args) {
            super(...args);
        }
        
        /* Config */
        get config() {
            return {
                mutedRole: {
                    SCHEMA: 'Role',
                    data: this.client.db.get(`mutedRole_${this.id}`) || null
                },
                modLog: {
                    SCHEMA: 'Channel',
                    data: this.client.db.get(`modLog_${this.id}`) || null
                }
            }
        }
        
        get pings() {
            return this.client.db.get(`pings_${this.id}`);   
        }
        
        /* Limits */
        get limits() {
            return {
                memberRemovals: {
                    minute: this.client.db.get(`limits_1_${this.id}`) || 8,
                    hour: this.client.db.get(`limits_2_${this.id}`) || 24
                },
                channelCreations: {
                    minute: this.client.db.get(`limits_3_${this.id}`) || 4,
                    hour: this.client.db.get(`limits_4_${this.id}`) || 12
                },
                channelDeletions: {
                    minute: this.client.db.get(`limits_5_${this.id}`) || 4,
                    hour: this.client.db.get(`limits_6_${this.id}`) || 12
                },
                roleCreations: {
                    minute: this.client.db.get(`limits_7_${this.id}`) || 4,
                    hour: this.client.db.get(`limits_8_${this.id}`) || 12
                },
                roleDeletions: {
                    minute: this.client.db.get(`limits_9_${this.id}`) || 4,
                    hour: this.client.db.get(`limits_10_${this.id}`) || 12
                },
                pings: {
                    minute: this.client.db.get(`limits_11_${this.id}`) || 8
                }
            }
        }

        checkLimits(type, executorID) {

            // Owner Bypass
            if (executorID === this.owner.id) return;
            
            // Variables
            let limits = this.limits;
            let data = (type === 'pings' ? this.client.pings.get(`${this.id}_${executorID}`) : this.client.db.get(`${type}_${this.id}_${executorID}`));
            let reached = false;

            // Action Limits
            let actionsPerMinute = data.slice(limits[type].minute * -1).reverse();
            let actionsPerHour = data.slice(limits[type].hour * -1).reverse();
            let lastActionMinute = actionsPerMinute[limits[type].minute - 1];
            let lastActionHour = actionsPerHour[limits[type].hour - 1];
            
            // Reached?
            if (lastActionMinute && Date.now() - lastActionMinute.timestamp < 60000) reached = 'Minute';
            if (type !== 'pings' && lastActionHour && Date.now() - lastActionHour.timestamp < 3.6e+6) reached = 'Hour';
            if (!reached) return;
            
            // Remove Roles [If not pings]
            let member = this.members.get(executorID);
            if (type !== 'pings') member.roles.set([]).catch(e => console.trace('Remove All Roles'));
            
            // If main, output information
            if (!this.client.main) return;
            
            // Update Type & Data
            if (type === 'roleDeletions' || type === 'channelDeletions') type = '**deleted**';
            else if (type === 'roleCreations' || type === 'channelCreations') type = '**created**';
            data = (reached === 'Minute' ? actionsPerMinute : actionsPerHour);
            
            // Create Description
            let description = '';
            for (var i in data) description += `\`${this.client.parseTime(data[i].timestamp)}\` | ${data[i].executor.tag} **${data[i].type}** ${data[i].target.tag}\n`;
            
            // Create Embed
            const embed = new MessageEmbed()
                .setColor(this.client.COLOR_RED)
                .setTitle(`Limit Reached - ${reached}`)
                .setDescription(description)
                .addField('Limit Reached By', `${member.user.tag} (${member.id})`)
                
            // Actions
            if (type === 'pings') {
                let role = this.roles.get(this.config.mutedRole.data);
                if (!role || member.roles.find(r => r.name === role.name)) return console.log('Already has muted role, force exiting...');
                else if (role) {
                    member.roles.add(role);
                    embed.setFooter('Automatic Action: Added Muted Role');
                } else embed.setFooter('Automatic Action: Nothing, set muted role in g!config');
            } else {
                embed.setFooter('Automatic Action: All of the user\'s roles have been removed');
                this.owner.send(embed).catch(err => console.trace('Send To Owner'));
            }
            
            // Mod Log
            let modLog = this.channels.get(this.config.modLog.data);
            if (modLog) modLog.send(embed).catch(err => console.trace('Send to Mod Log'))
            
            member.send(embed).catch(err => console.trace('Send To Executor'));
            
        }
        
    }
    return GuildExt;
});
