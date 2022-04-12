const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class Command extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'fish',
			description: 'Let\'s chill and fish!',
			cooldown: 35000,
		});
	}
	/**
	 * @typedef {import('eris').CommandInteraction} Interaction
	 * @param {Interaction} interaction
	 */
	async run(interaction) {

		const data = await Schema.findOneAndUpdate({ UserId: interaction.member.id }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }).select('Backpack Achievements Coins');
		const fish = this.client.utils.fish(data);
		const emoji = this.client.config.itemsData.find((x) => x.name === fish.prize).emoji;

		if(data.Coins < 60) return interaction.createFollowup('You need 60 coins to run this command!');

		const customID = String(Math.random());
		const AOF = ['', '', '', '', '', ''].fill('<a:water:950366761138679879>');
		const AOA = ['', '', '', '', '', ''].fill('<:yes:950313260400386109>');
		const componentsArray = [{ type: 1, components: [{
			type: 2,
			style: 1,
			label: 'Pull',
			custom_id: customID,
		}] }];
		const indexOfFish = Math.floor(Math.random() * AOF.length);

		let lastIndex;
		let gameEnded;
		let i = 0;

		AOF[indexOfFish] = '<a:water_found:950369743485943848>';

		interaction.createFollowup({ content: 'Loading the minigame...', flags: 64, components: componentsArray });

		const interval = setInterval(() => {
			i++;
			AOA[lastIndex] = '<:yes:950313260400386109>';
			lastIndex = Math.floor(Math.random() * AOA.length);

			AOA[lastIndex] = '⤴️';

			if(i === 20) {
				interaction.editOriginalMessage({ components: [], content: `<@${interaction.member.user.id}> missed his **${emoji} ${fish.prize}** due to inactivity...` });
				gameEnded = true;
			}
			if(gameEnded) return clearInterval(interval);

			interaction.editOriginalMessage({ content: `${AOF.join('')}\n${AOA.join('')}`, flags: 64 });
		}, 1500);

		const collector = await this.client.utils.createInteractionCollector({
			client: this.client,
			interaction: interaction,
			componentType: 2,
			filter: (u) => u.member.user.id === interaction.member.user.id,
		});

		collector.on('collect', async button => {
			if(button.data.custom_id !== customID) return;

			collector.stopListening('end');
			gameEnded = true;

			if(AOF.indexOf(emoji) === lastIndex) {
				const achieved = await this.client.db.addAchievement('ACH6', interaction, data, this.client);
				data.Achievements = achieved.Achievements;

				if(fish.prize === 'Treasure') {
					const e = await this.client.db.addAchievement('ACH3', interaction, data, this.client);
					data.Achievements = e.Achievements;
				}

				const embed = {
					title: 'You went to fish and found...',
					description: `\u200b\n[\`${fish.tier}\`] You found a **${fish.prize}**.`,
					color: fish.color,
					thumbnail: { url: `https://cdn.discordapp.com/emojis/${emoji.replace(/\D/g, '')}.png?size=124` },
				};

				data.Backpack.Fishes[fish.prize.replace(/ /gi, '')]++;
				data.Coins -= 60;
				data.save();

				interaction.editOriginalMessage({ content: '\u200b', embed: embed, components: [] });
			}
			else {
				interaction.editOriginalMessage({ content: `<@${interaction.member.user.id}> missed his **${emoji} ${fish.prize}**...`, components: [] });
			}

		});

		this.client.on('command', (interact) => {if(interact.member.user.id === interaction.member.user.id) return collector.stopListening('end');});


	}
};