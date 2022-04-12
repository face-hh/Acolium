const Event = require('../Structures/EventBase');
const Schema = require('../Schemas/Users');

module.exports = class extends Event {
	async run(interaction) {
		const data = await Schema.findOneAndUpdate({ UserId: interaction.member.id }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }).select('Statistics Coins Achievements');
		data.Statistics.CommandsUsed.push(interaction.data.name);

		const leveledUp = await this.client.db.addXP(data, Math.floor(Math.random() * 10) + 1);
		const coins = await this.client.db.addCoins(data, 1200 * data.Statistics.LEVEL);

		data.Statistics.XP = leveledUp.data.Statistics.XP;
		data.Statistics.LEVEL = leveledUp.data.Statistics.LEVEL;

		if(leveledUp.bool === true) {
			data.Coins = coins.Coins;
			this.client.createMessage(interaction.channel.id, `\`[🎉]\` LEVEL UP!\n\`[  ]\` Level: **${data.Statistics.LEVEL}**, +**${1200 * data.Statistics.LEVEL} ${this.client.config.coinEmoji}**`);
		}

		if(data.Statistics.CommandsUsed.length === 100) data.Achievements = (await this.client.db.addAchievement('ACH4', interaction, data, this.client)).Achievements;

		data.save();
	}
};