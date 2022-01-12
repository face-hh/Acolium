const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'stats',
			description: 'Want some info?',
			cooldown: 30000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		await interaction.acknowledge();

		const Schema = require('../../Schemas/Users');


		await Schema.collection.stats((_err, cb) => {

			const databaseSize = this.client.utils.convertBytes(cb.size);
			const usersSize = this.client.guilds.reduce((total, guild) => total + guild.memberCount, 0);
			const serversSize = this.client.guilds.size;
			const uptime = this.client.utils.convertSecToTime(Math.round(process.uptime()));

			const embed = {
				title: `Information regarding ${this.client.user.username}.\n`,
				description: 'Bot developer/owner: `FaceDev#0981`\nBot assets/emojis maker: `Jerson.EXE#9864`',
				fields: [
					{ inline: true, name: 'Servers', value: `\`${serversSize}\`` },
					{ inline: true, name: 'Members', value: `\`${usersSize}\`` },
					{ inline: true, name: 'Uptime', value: `\`${uptime}\`` },
					{ inline: true, name: 'Database size', value: `\`${databaseSize}\`` },
				],
				color: this.client.utils.randomHex(),
				thumbnail: { url: this.client.user.dynamicAvatarURL('png') },
			};
			interaction.createFollowup({ embed: embed });
		});
	}
};