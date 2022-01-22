const Event = require('../Structures/EventBase');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true,
		});
	}
	async run(guild) {
		this.client.getRESTChannel('934187656873644042').createMessage(`Joined **${guild.name}** with **${guild.memberCount}** members!`);
	}
};