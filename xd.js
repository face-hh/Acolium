const top = require('top.gg-core');
const webhook = new top.Webhook('faceDevStuffOk');

const express = require('express');
const app = express();

app.post('/e', webhook.advanced(), (req) => {
	console.log(req.vote);
});
app.listen('8080', () => {
	console.log('App listening on port 8080');
});app.post('/e', webhook.advanced(), (req) => {
	console.log(req);
});
app.listen('19644', () => {
	console.log('App listening on port 19644');
});