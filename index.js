const Client = require('./structures/Client');
const client = new Client();
const hidden = require('./data/info.json');

/* client.run();

Parameter | Type | Default | Description

options | object | none
options.main | boolean | false | Dictates if it's the main Guardian instance
options.evalID | string | null | The sole userID that can run the eval command
*/

client.run({ main: true, evalID: hidden.evalID });
client.login(hidden.token);

process.on("unhandledRejection", error => {
    console.error("Unhandled promise rejection:", error);
});