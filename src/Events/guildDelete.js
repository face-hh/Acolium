const Event = require('../Structures/EventBase');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true,
		});
	}
	async run(guild) {
		this.client.getRESTChannels('934187656873644042').createMessage(`Left **${guild.name}** with **${guild.memberCount}** members!`);
	}
};