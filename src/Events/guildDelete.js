const Event = require('../Structures/EventBase');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}
	async run(guild) {
		this.client.createMessage('934187656873644042', `Left **${guild.name}** with **${guild.memberCount}** members!`);
	}
};
