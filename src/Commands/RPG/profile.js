const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class Command extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'profile',
			description: 'See your profile!',
			options: [
				{ name: 'user', type: 6, description: 'Whose profile do you wanna see?' },
			],
			cooldown: 6000,
		});
	}
	/**
	 * @typedef {import('eris').CommandInteraction} Interaction
	 * @param {Interaction} interaction
	 */
	async run(interaction) {
		const user = interaction.data.options === undefined ? interaction.member : await this.client.getRESTUser(interaction.data.options[0].value);
		const data = await Schema.findOne({ UserId: user.id }).select('Statistics Coins Achievements').lean();
		const topCommands = this.client.utils.topCommonElementsInArray(data.Statistics.CommandsUsed);
		const timestamp = Math.round(data.Statistics.RegisteredAt / 1000);

		// Achievements.
		let achievements = '';

		// Getting the array of keys from data.Achievements || Mapping them by using the key, if the value of the achievement is true, add it's emoji.
		Object.keys(data.Achievements).map(key => { if (data.Achievements[key] === true) achievements += this.client.config.achievements[key].emoji; });

		const embed = {
			fields: [
				{ inline: true, name: 'Achievements', value: achievements === '' ? 'None lsoer' : achievements },
				{ inline: true, name: 'Playing since', value: `<t:${timestamp}> (<t:${timestamp}:R>)` },
				{ inline: true, name: 'XP', value: this.client.utils.emojifiedPercentage(data.Statistics.XP / (data.Statistics.LEVEL * 100) * 100) },
				{ inline: true, name: 'Level', value: data.Statistics.LEVEL },
				{ inline: true, name: '\u200b', value: '\u200b' },
				{ inline: true, name: 'Commands Used', value: data.Statistics.CommandsUsed.length },
				{ inline: true, name: 'Most used commands', value: topCommands.slice(0, 5).map((val) => `\`${topCommands.indexOf(val) + 1}\`. **${val[0]}** (x${val[1]})`).join('\n') || 'None to display!' },
				{ inline: true, name: '\u200b', value: '\u200b' },
				{ inline: true, name: 'Balance', value: data.Coins.toLocaleString() + this.client.config.coinEmoji },
			],
			thumbnail: { url: user === interaction.member ? user.user.dynamicAvatarURL('png') : user.dynamicAvatarURL('png') },
			color: this.client.utils.randomHex(),
		};

		interaction.createFollowup({ embed: embed });
	}
};
