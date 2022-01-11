const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'fish',
			description: 'Let\'s chill and fish!',
			cooldown: 35000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		await interaction.acknowledge();

		const data = await this.client.db.findUser(interaction.member.id);
		const fish = this.client.utils.fish(data);
		const emoji = this.client.config.itemsData.find((x) => x.name === fish.prize).emoji;


		if(data.Coins < 60) return interaction.createFollowup('You need 60 coins to run this command!');

		const achieved = await this.client.db.addAchievement('ACH6', interaction, this.client);
		data.Achievements = achieved.Achievements;

		if(fish.prize === 'Treasure') {
			const e = await this.client.db.addAchievement('ACH3', interaction, this.client);
			data.Achievements = e.Achievements;
		}

		const embed = {
			title: 'You went to fish and found...',
			description: `[\`${fish.tier}\`] You found a **${emoji} ${fish.prize}**.`,
			color: fish.color,
		};

<<<<<<< HEAD
		data.Backpack.Fishes[fish.prize]++;
=======
		data.Backpack.Fishes[fish.prize.replace(/ /gi, '')]++;
>>>>>>> [CHANGES] Commit.
		data.Coins -= 60;
		this.client.db.forceUpdate({ UserId: interaction.member.id }, data, require('../../Schemas/Users'));

		interaction.createFollowup({ embed: embed });
	}
};