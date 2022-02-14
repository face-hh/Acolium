const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'hunt',
			description: 'Let\'s get into the adventure of hunting!',
			cooldown: 30000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {

		const data = await this.client.db.findUser(interaction.member.id);
		const hunt = this.client.utils.hunt(data);
		const emoji = this.client.config.itemsData.find((x) => x.name === hunt.prize).emoji;


		if(data.Coins < 550) return interaction.createFollowup('You need 600 coins to run this command!');


		const achieved = await this.client.db.addAchievement('ACH7', interaction, this.client);
		data.Achievements = achieved.Achievements;

		if(hunt.prize === 'Chad') {
			const achieved2 = await this.client.db.addAchievement('ACH2', interaction, this.client);
			data.Achievements = achieved2.Achievements;
		}

		const embed = {
			title: 'You went to hunt and found...',
			description: `\u200b\n[\`${hunt.tier}\`] You found a **${hunt.prize}**.`,
			color: hunt.color,
			thumbnail: { url: `https://cdn.discordapp.com/emojis/${emoji.replace(/\D/g, '')}.png` },
		};

		data.Backpack.Animals[hunt.prize]++;
		data.Coins -= 550;
		this.client.db.forceUpdate({ UserId: interaction.member.id }, data, require('../../Schemas/Users'));

		interaction.createFollowup({ embed: embed });
	}
};
