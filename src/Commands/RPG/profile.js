const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'profile',
			description: 'See your profile!',
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
		let achievements = '';

		// Getting the array of keys from data.Achievements || Mapping them by using the key, if the value of the achievement is true, add it's emoji.
		Object.keys(data.Achievements).map(key => { if(data.Achievements[key] === true) achievements += this.client.emojis[key]; });

		const embed = {
			fields: [
				{ inline: false, name: 'Achievements', value: achievements === '' ? 'None lsoer' : achievements },
				{ inline: true, name: 'XP', value: this.client.utils.emojifiedPercentage(data.Statistics.XP / (data.Statistics.LEVEL * 100) * 100) },
				{ inline: true, name: 'Level', value: data.Statistics.LEVEL },
				{ inline: true, name: '\u200b', value: '\u200b' },
				{ inline: true, name: 'Commands Used', value: data.Statistics.CommandsUsed.length },
				{ inline: true, name: 'Balance', value: data.Coins.toLocaleString() + this.client.config.coinEmoji },
			],
			thumbnail: { url: interaction.member.user.dynamicAvatarURL('png') },
			color: this.client.utils.randomHex(),

		};

		await interaction.acknowledge();
		interaction.createFollowup({ embed: embed });
	}
};