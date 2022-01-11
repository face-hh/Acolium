const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'craft',
			description: 'Let\'s get advanced into gear!',
			cooldown: 6000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		const data = await this.client.db.findUser(interaction.member.id);

		let i = 0;

		const componentsArray = [{
			type: 1,
			components: [
				{ type: 2, emoji: { name: '⬅️' }, label: '\u200b', custom_id: 'left', style: 1, disabled: true },
				{ type: 2, label: 'Craft x1', custom_id: 'craft1', style: 2 },
				{ type: 2, emoji: { name: '➡️' }, label: '\u200b', custom_id: 'right', style: 4 },
			],
		}];
		const embeds = [];

		this.client.config.craftData.forEach((craftData) => {
			const itemData = this.client.config.itemsData.find((x) => x.name.replace(/ /gi, '').includes(craftData.name.replace(/ /gi, '')));
			const emoji = itemData.emoji.split(':');
			const thumbnail = `https://cdn.discordapp.com/emojis/${emoji[2].replace('>', '')}.${emoji[0] === '<a' ? 'gif' : 'png'}`;

			const neededItems = [];

			let requiredItemsString = '';
			const array2 = [];

			craftData.neededItems.forEach((item) => {
				Object.keys(item).forEach((e) => {
					const whereIsTheItem = Object.keys(data.Backpack).filter(x => data.Backpack[x][e] !== undefined);
					neededItems.push([e, data.Backpack[whereIsTheItem[0]][e], item[e]]);
				});
			});

			neededItems.forEach((item) => {
				const itemData2 = this.client.config.itemsData.find((x) => x.name.replace(/ /gi, '') === item[0]);

				array2.push([itemData2, item[1], item[2] ]);

				let name = item[0];

				if(item[1] >= item[2]) name = `**${name}**`;

				requiredItemsString += `${itemData2.emoji} \`[${item[1]}/${item[2]}]\` ${name}\n`;
			});
			requiredItemsString += `${this.client.config.coinEmoji} \`[${data.Coins}/${craftData.Coins}]\` ${craftData.Coins <= data.Coins ? '**Coins**' : 'Coins'}`;
			embeds.push([array2, { title: craftData.name, description: `${craftData.description}\n${requiredItemsString}`, color: this.client.utils.randomHex(), thumbnail:  { url: thumbnail } }]);
		});

		embeds[0][1].footer = { text: `1/${embeds.length}` };

		await interaction.acknowledge();
		interaction.createFollowup({ embed: embeds[0][1], components: componentsArray });

		const collector = await this.client.utils.createInteractionCollector({
			client: this.client,
			interaction: interaction,
			componentType: 2,
			filter: (user) => user.member.user.id === interaction.member.user.id,
		});

		collector.on('collect', async button => {
			if(!['left', 'craft1', 'right'].includes(button.data.custom_id)) return;
			if(button.acknowledged === false) await button.acknowledge();
			// SET
			if(button.data.custom_id === 'left') i--;
			if(button.data.custom_id === 'right') i++;
			if(i !== 0) componentsArray[0].components[0].disabled = false;
			if(i === 0) componentsArray[0].components[0].disabled = true;
			if(i === embeds.length - 1) componentsArray[0].components[2].disabled = true;
			if(i !== embeds.length - 1) componentsArray[0].components[2].disabled = false;

			if(button.data.custom_id === 'craft1') {
				let success = false;
				const itemname = embeds[i][1].title.replace(/ /gi, '');
				const whereIsTheItem1 = Object.keys(data.Backpack).filter(x => data.Backpack[x][itemname] !== undefined);
				const itemInfo = this.client.config.itemsData.find((x) => x.name.replace(/ /gi, '').includes(itemname));
				const itemInfoCraft = this.client.config.craftData.find((x) => x.name.replace(/ /gi, '').includes(itemname));

				if(itemInfoCraft.Coins > data.Coins) return interaction.createFollowup({ content: 'Insufficient coins.', flags: 64 });

				embeds[i][0].forEach(async (e) => {

					const whereIsTheItem2 = Object.keys(data.Backpack).filter(x => data.Backpack[x][e[0].name.replace(/ /gi, '')] !== undefined);

					if(e[1] >= e[2]) {
						data.Coins -= itemInfoCraft.Coins;
						data.Backpack[whereIsTheItem2[0]][e[0].name.replace(/ /gi, '')] -= e[2];
						success = true;

						await this.client.db.forceUpdate({ UserId: button.member.user.id }, data, require('../../Schemas/Users'));
					}
					else {success = false;}
				});

				if(success === false) {
					return interaction.createFollowup({ content: 'Insufficient materials.', flags: 64 });
				}
				else {
					data.Backpack[whereIsTheItem1[0]][itemname]++;

					interaction.createFollowup({ content: `Successfully crafted **x1 ${itemInfo.emoji} ${embeds[i][1].title}**.`, ephemeral: true });


					const achieved = await this.client.db.addAchievement('ACH1', interaction, this.client);
					data.Achievements = achieved.Achievements;

					await this.client.db.forceUpdate({ UserId: button.member.user.id }, data, require('../../Schemas/Users'));
				}
			}
			embeds[i][1].footer = { text: `${i + 1}/${embeds.length}` };

			interaction.editOriginalMessage({ embed: embeds[i][1], components: componentsArray });
			// in case user runs 2 commands
		});
		this.client.on('command', (interact) => {if(interact.member.user.id === interaction.member.user.id) return collector.stopListening('end');});

	}
};