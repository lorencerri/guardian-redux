const Client = require('./structures/Client');
const client = new Client();

/* client.run();

Parameter | Type | Default | Description

options | object | none
options.main | boolean | false | Dictates if it's the main Guardian instance
options.evalID | string | null | The sole ID that can run the eval command
*/

client.run({ main: true, evalID: 'your id' });
client.login('bot token');
