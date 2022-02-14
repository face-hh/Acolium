const Event = require('../Structures/EventBase');
const Schema = require('../Schemas/Users');
const replies = [
	'Holy! there\'s a cupid in AIR!',
	'Ayo there\'s a flying object up??',
	'Why are arrows flying around?',
	'Is that a plane?',
	'Why\'s a baby with wings in the air??',
];

module.exports = class extends Event {
	async run(interaction) {
		const data = await this.client.db.findUser(interaction.member.id);
		data.Statistics.CommandsUsed.push(interaction.data.name);

		const leveledUp = await this.client.db.addXP(interaction.member.id, Math.floor(Math.random() * 10) + 1);
		const coins = await this.client.db.addCoins(interaction.member.id, 1200 * data.Statistics.LEVEL);
		const id = String(Math.floor());
		const client = this.client;

		data.Statistics.XP = leveledUp.data.Statistics.XP;
		data.Statistics.LEVEL = leveledUp.data.Statistics.LEVEL;

		if(leveledUp.bool === true) {
			data.Coins = coins.Coins;
			this.client.createMessage(interaction.channel.id, `\`[🎉]\` LEVEL UP!\n\`[  ]\` Level: **${data.Statistics.LEVEL}**, +**${1200 * data.Statistics.LEVEL} ${this.client.config.coinEmoji}**`);
		}

		if(data.Statistics.CommandsUsed.length === 100) data.Achievements = (await this.client.db.addAchievement('ACH4', interaction, this.client)).Achievements;

		if(Math.floor(Math.random() * 100) <= 20) {
			let ended = data.Backpack.Essences.WindEssence <= 0 ? true : false;
			const componentsArray = [{ type: 1, components: [{
				type: 2,
				style: 1,
				emoji: { id: client.config.itemsData.find((e) => e.name === 'Wind Essence').emoji.replace(/^\D+/g, '').replace(/>/gi, '') },
				label: 'THROW THE ESSENCE TO FLY',
				custom_id: id,
				disabled: ended,
			}],
			}];

			const msg = await client.createMessage(interaction.channel.id, {
				content: replies[Math.floor(Math.random() * replies.length)],
				components: componentsArray,
			});
			const collector = await client.utils.createInteractionCollector({
				client: client,
				interaction: interaction,
				componentType: 2,
				filter: (user2) => user2.member.user.id === interaction.member.user.id,
			});

			collector.on('collect', async int => {
				if(!int.acknowledged) await int.acknowledge().catch(() => {});

				if(int.data.custom_id !== id) return;

				data.Backpack.Useable.CupidArrow++;
				data.Backpack.Essences.WindEssence--;
				ended = true;

				await this.client.db.forceUpdate({ UserId: interaction.member.id }, data, Schema);

				componentsArray[0].components[0].disabled = true;
				msg.edit({ content: `SEE? I was right, and you found a ${client.config.itemsData.find((e) => e.name === 'Cupid Arrow').emoji} **Cupid Arrow**!`, components: componentsArray });
			});

			setTimeout(() => {
				if(ended === false) {
					componentsArray[0].components[0].disabled = true;
					msg.edit({ content: `HE RAN AWAY! Anyway, I'll take **140 ${client.config.coinEmoji}** from you, nerd.`, components: componentsArray });
					data.Coins -= 140;
					collector.stopListening('end');
				}
			}, 2000);
		}


		await this.client.db.forceUpdate({ UserId: interaction.member.id }, data, Schema);
	}
};