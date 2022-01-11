const Event = require('../Structures/EventBase');
const Schema = require('../Schemas/Users');

module.exports = class extends Event {
	async run(interaction) {
		const data = await this.client.db.findUser(interaction.member.id);
		data.Statistics.CommandsUsed.push(interaction.data.name);

		const leveledUp = await this.client.db.addXP(interaction.member.id, Math.floor(Math.random() * 10) + 1);
		const coins = await this.client.db.addCoins(interaction.member.id, 1200 * data.Statistics.LEVEL);

		data.Statistics.XP = leveledUp.data.Statistics.XP;
		data.Statistics.LEVEL = leveledUp.data.Statistics.LEVEL;

		if(leveledUp.bool === true) {
			data.Coins = coins.Coins;
			this.client.createMessage(interaction.channel.id, `\`[🎉]\` LEVEL UP!\n\`[  ]\` Level: **${data.Statistics.LEVEL}**, +**${1200 * data.Statistics.LEVEL} ${this.client.config.coinEmoji}**`);
		}

		if(data.Statistics.CommandsUsed.length === 100) {
			const achieved = await this.client.db.addAchievement('ACH4', interaction, this.client);
			data.Achievements = achieved.Achievements;
		}

		await this.client.db.forceUpdate({ UserId: interaction.member.id }, data, Schema);
	}
};