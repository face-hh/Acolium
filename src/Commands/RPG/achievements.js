const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'achievements',
			description: 'See the achievements you achieved and how many left!',
			options: [
				{ name: 'user', type: 6, description: 'Whose achievements do you wanna see?' },
			],
			cooldown: 6000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		const user = interaction.data.options === undefined ? interaction.member : await this.client.getRESTUser(interaction.data.options[0].value);
		const data = await this.client.db.findUser(user.id);

		// Achievements.
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