const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'achievements',
			description: 'See the achievements you achieved and how many left!',
			cooldown: 6000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		const data = await this.client.db.findUser(interaction.member.id);

		// Achievements.
		const achievements = [];

		// Getting the array of keys from data.Achievements || Mapping them by using the key, if the value of the achievement is true, add it's emoji.
		Object.keys(data.Achievements).forEach(key => {
			achievements.push({ inline: true, value: '\u200b', name: data.Achievements[key] === false ? '`???`' : this.client.config.achievements[key].emoji + this.client.config.achievements[key].name });
		});

		const embed = {
			title: 'Achievements!',
			fields: achievements,
			thumbnail: { url: interaction.member.user.dynamicAvatarURL('png') },
			color: this.client.utils.randomHex(),
		};

		await interaction.acknowledge();
		interaction.createFollowup({ embed: embed });
	}
};