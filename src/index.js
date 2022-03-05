console.time('\x1b[32m[BOOT] \x1b[0mConnected to Discord in');

require('dotenv').config();

const Acol = require('./Structures/Bot');

const client = new Acol();

client.connect();

console.timeEnd('\x1b[32m[BOOT] \x1b[0mConnected to Discord in');