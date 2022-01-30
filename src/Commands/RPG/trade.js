const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'trade',
			description: 'Want to trade something? Use this!',
			options: [
				{ type: 6, name: 'user', description: 'Who\'s the user you wanna give these to?', required: true },
				{ type: 3, name: 'you_give', description: 'How many item/coins do you want to give?', required: true },
				{ type: 3, name: 'user_gives', description: 'How many item/coins do you want the user to give?', required: true },
			],
			cooldown: 6000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		await interaction.acknowledge();
		const data = await this.client.db.findUser(interaction.member.id);
		const data2 = await this.client.db.findUser(interaction.data.options[0].value);
		const options = interaction.data.options;
		const client = this.client;
		const itemsData = require('../../Structures/BotConfig').itemsData;
		const user = await this.client.getRESTUser(options[0].value);
		const customIds = {
			accept: String(Math.random()),
			decline: String(Math.random()),
		};
		const componentsArray = [{
			type: 1, components: [
				{ type: 2, label: 'I accept.', custom_id: customIds.accept, style: 3 },
				{ type: 2, label: 'I decline.', custom_id: customIds.decline, style: 4 },
			],
		}];
		const itemAuthor = { amount: NaN, item: null };
		const itemUser = { amount: NaN, item: null };

		// AUTHOR

		if (options[1].value.toLowerCase().replace(/[0-9]/g, '').replace(/ /gi, '') !== 'coins') {
			try {
				const customFound = customFind(itemsData, options[1].value.toLowerCase().replace(/[0-9]/g, '').replace(/ /gi, ''));

				if (customFound === undefined) {
					throw new TypeError('i am here to break yo dreams');
				}
				itemAuthor.item = customReplace(options[1].value, data, Object.keys(data.Backpack).filter(x =>
					data.Backpack[x][customFound.name.replace(/ /gi, '')] !== undefined),
				);
			}
			catch (error) { return interaction.createFollowup('That item doesn\'t exist!'); }
		}
		else {
			itemAuthor.item = 'Coins';
		}
		itemAuthor.item.charAt(0).toUpperCase() + itemAuthor.item.slice(1);
		itemAuthor.amount = options[1].value.match(/\d+/) === null ? 1 : options[1].value.match(/\d+/)[0];

		// USER
		if (options[2].value.toLowerCase().replace(/[0-9]/g, '').replace(/ /gi, '') !== 'coins') {
			try {
				const customFound = customFind(itemsData, options[2].value.toLowerCase().replace(/[0-9]/g, '').replace(/ /gi, ''));

				if (customFound === undefined) throw new TypeError('i am here to break yo dreams');
				itemUser.item = customReplace(options[2].value, data2, Object.keys(data2.Backpack).filter(x =>
					data2.Backpack[x][customFound.name.replace(/ /gi, '')] !== undefined),
				);
			}
			catch (error) { return interaction.createFollowup('That item doesn\'t exist!'); }
		}
		else {
			itemUser.item = 'Coins';
		}
		itemUser.item.charAt(0).toUpperCase() + itemUser.item.slice(1);
		itemUser.amount = options[2].value.match(/\d+/) === null ? 1 : options[2].value.match(/\d+/)[0];

		let specifiedItemData = itemsData.find((x) => x.name.toLowerCase().replace(/ /gi, '') === itemAuthor.item.toLowerCase());
		let specifiedItemData2 = itemsData.find((x) => x.name.toLowerCase().replace(/ /gi, '') === itemUser.item.toLowerCase());

		if (specifiedItemData === undefined && itemAuthor.item !== 'Coins') return interaction.createFollowup({ content: 'The provided item in `you_give` option is invalid!' });
		if (specifiedItemData2 === undefined && itemUser.item !== 'Coins') return interaction.createFollowup({ content: 'The provided item in `user_gives` option is invalid!' });

		if (specifiedItemData === undefined && itemAuthor.item === 'Coins') specifiedItemData = { emoji: this.client.config.coinEmoji, name: 'Coins' };
		if (specifiedItemData2 === undefined && itemUser.item === 'Coins') specifiedItemData2 = { emoji: this.client.config.coinEmoji, name: 'Coins' };

		const databaseItemName = specifiedItemData.name.replace(/ /gi, '');
		const databaseItemName2 = specifiedItemData2.name.replace(/ /gi, '');
		const whereIsTheItem = Object.keys(data.Backpack).filter(x => data.Backpack[x][databaseItemName] !== undefined);
		const whereIsTheItem2 = Object.keys(data2.Backpack).filter(x => data2.Backpack[x][databaseItemName2] !== undefined);

		const where = itemAuthor.item === 'Coins' ? data.Coins : data.Backpack[whereIsTheItem[0]][databaseItemName];
		const where2 = itemUser.item === 'Coins' ? data2.Coins : data2.Backpack[whereIsTheItem2[0]][databaseItemName2];

		function customReplace(str, dat, whereIsTheIte) {
			const item = itemsData.find((x) => x.name.toLowerCase().replace(/ /gi, '') === str.replace(/[0-9]/g, '').replace(/ /gi, '').toLowerCase());

			if (item === undefined) throw new TypeError('hi i am here to break your mood');

			return str.replace(/coins/gi, 'Coins')
				.replace(/ /gi, '')
				.replace(/all/gi, str.includes('Coins') ? String(data.Coins) : String(dat.Backpack[whereIsTheIte[0]][item.name.replace(/ /gi, '')]))
				.replace(/half/gi, str.includes('Coins') ? String(data.Coins) : String(dat.Backpack[whereIsTheIte[0]][item.name.replace(/ /gi, '')]) / 2)
				.replace(/[0-9]/g, '');
		}

		function customFind(arr, item) {
			let res;
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].name.toLowerCase().replace(/ /gi, '') == item) {
					res = arr[i];
				}
			}
			return res;
		}

		async function confirmation(cb) {
			interaction.createFollowup({
				content: `${interaction.member.user.username} gives you **${itemAuthor.amount} ${specifiedItemData.emoji} ${specifiedItemData.name}**\n` +
					`You give them **${itemUser.amount} ${specifiedItemData2.emoji} ${specifiedItemData2.name}**\n\n<@${user.id}> click the buttons below to accept or decline!`,
				components: componentsArray,
			});

			const collector = await client.utils.createInteractionCollector({
				client: client,
				interaction: interaction,
				componentType: 2,
				filter: (user2) => user2.member.user.id === user.id,
			});
			let ended = false;

			collector.on('collect', async button => {
				await button.acknowledge();

				lockButtons();
				if (button.data.custom_id === customIds.accept) {
					cb();
				}
				else if (button.data.custom_id === customIds.decline) {
					interaction.editOriginalMessage({ content: `\`${user.username}\` declined.` });
				}
				collector.stopListening('end');
				ended = true;
			});

			setTimeout(() => {
				if (ended === false) {
					lockButtons();
					interaction.editOriginalMessage({ content: `\`${user.username}\` didn't respond.`, components: componentsArray });
					collector.stopListening('end');
				}
			}, 2000);
		}

		function lockButtons() {
			componentsArray[0].components[0].disabled = true;
			componentsArray[0].components[1].disabled = true;
		}
		if (where < itemAuthor.amount) return interaction.createFollowup('You don\'t have that many items!');
		if (where2 < itemUser.amount) return interaction.createFollowup(`${user.username} doesn't have that many items!`);

		await confirmation(() => {
			itemAuthor.item === 'Coins' ? data.Coins -= itemAuthor.amount : data.Backpack[whereIsTheItem[0]][databaseItemName] -= itemAuthor.amount;
			itemUser.item === 'Coins' ? data2.Coins -= itemUser.amount : data2.Backpack[whereIsTheItem2[0]][databaseItemName2] -= itemUser.amount;

			this.client.db.forceUpdate({ UserId: interaction.member.id }, data, require('../../Schemas/Users'));
			this.client.db.forceUpdate({ UserId: user.id }, data2, require('../../Schemas/Users'));

			interaction.editOriginalMessage({
				embed: {
					description: `\`[✅]\` \`${interaction.member.user.username}\` successfully gave \`${user.username}\` **${itemAuthor.amount} ${specifiedItemData.emoji} ${specifiedItemData.name}**\n` +
						`\`[✅]\` ${user.username} successfully gave \`${interaction.member.user.username}\` ** ${itemUser.amount} ${specifiedItemData2.emoji} ${specifiedItemData2.name}**.`,
					color: 0x0aff00,
					author: { name: interaction.member.user.username, icon_url: interaction.member.user.dynamicAvatarURL('png') },
				}, components: [], content: '\u200b',
			});
		});

	}
};