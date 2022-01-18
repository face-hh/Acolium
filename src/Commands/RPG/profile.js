const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'profile',
			description: 'See your profile!',
			opions: [{
				name: 'user',
				type: 6,
				description: 'You want to see a profile of a user in particular?',
			}],
			cooldown: 6000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		const user = interaction.data.options[0].value === undefined ? interaction.member : await client.getRESTUser(interaction.data.options[0].value)
		const data = await this.client.db.findUser(interaction.member.id);
		const topCommands = this.client.utils.topCommonElementsInArray(data.Statistics.CommandsUsed);

		// Achievements.
		let achievements = '';

		// Getting the array of keys from data.Achievements || Mapping them by using the key, if the value of the achievement is true, add it's emoji.
		Object.keys(data.Achievements).map(key => { if(data.Achievements[key] === true) achievements += this.client.config.achievements[key].emoji; });

		const embed = {
			fields: [
				{ inline: true, name: 'Achievements', value: achievements === '' ? 'None lsoer' : achievements },
				{ inline: true, name: 'Playing since', value: `<t:${Math.round(data.Statistics.RegisteredAt / 1000)}> (<t:${Math.round(data.Statistics.RegisteredAt / 1000)}:R>)` },
				{ inline: true, name: 'XP', value: this.client.utils.emojifiedPercentage(data.Statistics.XP / (data.Statistics.LEVEL * 100) * 100) },
				{ inline: true, name: 'Level', value: data.Statistics.LEVEL },
				{ inline: true, name: '\u200b', value: '\u200b' },
				{ inline: true, name: 'Commands Used', value: data.Statistics.CommandsUsed.length },
				{ inline: true, name: 'Most used commands', value: topCommands.slice(0, 5).map((val) => `\`${topCommands.indexOf(val) + 1}\`. **${val[0]}** (x${val[1]})`).join('\n') || 'None to display!' },
				{ inline: true, name: '\u200b', value: '\u200b' },
				{ inline: true, name: 'Balance', value: data.Coins.toLocaleString() + this.client.config.coinEmoji },
			],
			thumbnail: { url: interaction.member.user.dynamicAvatarURL('png') },
			color: this.client.utils.randomHex(),

		};

		await interaction.acknowledge();
		interaction.createFollowup({ embed: embed });
	}
};
