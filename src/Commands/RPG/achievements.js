const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class Command extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'achievements',
			description: 'See the achievements you achieved and how many left!',
			options: [
				{ name: 'user', type: 6, description: 'Whose achievements do you wanna see?' },
			],
		});
	}
	/**
	 * @typedef {import('eris').CommandInteraction} Interaction
	 * @param {Interaction} interaction
	 */
	async run(interaction) {
		const user = interaction.data.options === undefined ? interaction.member : await this.client.getRESTUser(interaction.data.options[0].value);
		const data = await Schema.findOneAndUpdate({ UserId: user.id }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }).select('Achievements').lean();

		const achievements = [];

		// Getting the array of keys from data.Achievements || Mapping them by using the key, if the value of the achievement is true, add it's emoji.
		Object.keys(data.Achievements).forEach(key => {
			const name = data.Achievements[key] === false ? '`???`' : this.client.config.achievements[key].emoji + this.client.config.achievements[key].name;
			const desc = data.Achievements[key] === false ? '> `?????????`' : `> ${this.client.config.achievements[key].description}`;

			achievements.push({ inline: false, value: desc, name: name });
		});

		const embed = {
			title: 'Achievements!',
			fields: achievements,
			thumbnail: { url: interaction.member.user.dynamicAvatarURL('png') },
			color: this.client.utils.randomHex(),
		};

		interaction.createFollowup({ embed: embed });
	}
};