const {
    Structures,
    MessageEmbed
} = require('discord.js');

Structures.extend('Guild', Guild => {
    class GuildExt extends Guild {
        constructor(...args) {
            super(...args);
        }
        
        /* Limits */
        get limits() {
            return {
                memberRemovals: {
                    minute: this.client.db.get(`limits_1_${this.id}`) || 6,
                    hour: this.client.db.get(`limits_2_${this.id}`) || 24
                },
                channelCreations: {
                    minute: this.client.db.get(`limits_3_${this.id}`) || 3,
                    hour: this.client.db.get(`limits_4_${this.id}`) || 12
                },
                channelDeletions: {
                    minute: this.client.db.get(`limits_5_${this.id}`) || 3,
                    hour: this.client.db.get(`limits_6_${this.id}`) || 12
                },
                roleCreations: {
                    minute: this.client.db.get(`limits_7_${this.id}`) || 3,
                    hour: this.client.db.get(`limits_8_${this.id}`) || 12
                },
                roleDeletions: {
                    minute: this.client.db.get(`limits_9_${this.id}`) || 3,
                    hour: this.client.db.get(`limits_10_${this.id}`) || 12
                },
                pings: {
                    minute: this.client.db.get(`limits_11_${this.id}`) || 12
                }
            }
        }

        checkLimits(type, executorID) {
            
            // Owner Bypass
            if (executorID === this.owner.id) return;
            
            // Variables
            let limits = this.limits;
            let data = this.client.db.get(`${type}_${this.id}_${executorID}`);
            let reached = false;
            
            // Action Limits
            let actionsPerMinute = data.slice(limits[type].minute * -1).reverse();
            let actionsPerHour = data.slice(limits[type].hour * -1).reverse();
            let lastActionMinute = actionsPerMinute[limits[type].minute - 1];
            let lastActionHour = actionsPerHour[limits[type].hour - 1];
            
            // Reached?
            if (lastActionMinute && Date.now() - lastActionMinute.timestamp < 60000) reached = 'Minute';
            if (lastActionHour && Date.now() - lastActionHour.timestamp < 3.6e+6) reached = 'Hour';
            if (!reached) return;
            
            // Remove Roles
            let member = this.members.get(executorID);
            member.roles.set([]).catch(e => console.trace('Remove All Roles'));
            
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
                .setFooter('All of the user\'s roles have been automatically removed');
                
            // Send Embeds
            this.owner.send(embed).catch(err => console.trace('Send To Owner'));
            member.send(embed).catch(err => console.trace('Send To Executor'));
            
        }
    
    }
    return GuildExt;
});
