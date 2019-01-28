const Discord = require('discord.js');
const Enmap = require('enmap');
const db = new Enmap({ name: 'db' });
const parsems = require('parse-ms');

require('./Guild');

class Base extends Discord.Client {
    constructor(...args) {
        super(...args);
        
        // General
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        this.CommandHandler = new (require('./CommandHandler'))(this);
        this.EventHandler = new (require('./EventHandler'))(this);
        
        // Modules
        this.db = db;
        this.pings = new Map();

        // Constants
        this.prefix = 'g!';
        this.EMBED_COLOR = 0x7289DA;
        this.COLOR_RED = 0xf04747;
        
    }
    
    run(settings) {
        
        this.main = !!(settings || {}).main;
        this.evalID = (settings || {}).evalID || null;
        
        this.CommandHandler.load();
        this.EventHandler.load();
        
    }
    
    camelToString(s) {
        return s.charAt(0).toUpperCase() + s.replace(/([A-Z])/g, ' $1').trim().substr(1);
    }
    
    parseTime(ms, { fromNow = false, includeSeconds = false, base = '' } = {}) {
        
        let obj = (fromNow ? parsems(ms) : parsems(Date.now() - ms));

        for (var i in obj) {
            if (obj[i] === 0 || ['milliseconds', 'microseconds', 'nanoseconds'].includes(i) || (!includeSeconds && i === 'seconds')) continue;
            base += `${obj[i]} ${(obj[i] === 1 ? i.slice(0, -1) : i)} `;
        }
        
        return (!base ? 'Just now' : base + 'ago');
        
    }
    
}

module.exports = Base;
