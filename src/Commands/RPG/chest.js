const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'chest',
			description: 'Wanna open some chests?',
			options: [
				{ type: 3, name: 'rarity', description: 'Which rarity would you like to open?', required: true },
			],
			cooldown: 35000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {

		const data = await this.client.db.findUser(interaction.member.id);
		const client = this.client;
		const itemData = this.client.config.itemsData.find((x) => x.name.toLowerCase().replace(/ /gi, '') === interaction.data.options[0].value
			.toLowerCase()
			.replace(/chest/gi, '')
			.replace(/ /gi, '') + 'chest');
		if(!itemData) return interaction.createFollowup({ content: 'Couldn\'t find this rarity..?' });

		const whereIsTheItem = Object.keys(data.Backpack).filter(x => data.Backpack[x][itemData.name.replace(/ /gi, '')] !== undefined);

		if(data.Backpack[whereIsTheItem][itemData.name.replace(/ /gi, '')] <= 0) return interaction.createFollowup('You don\'t have that item!');

		let string = '';
		const id = String(Math.random());
		const a = data.Backpack[whereIsTheItem[0]][itemData.name.replace(/ /gi, '')];
		const componentsArray = [
			{
				type: 1,
				components: [
					{ type: 2, style: 1, label: `Open another! (${a})`, custom_id: id, disabled: a <= 1 ? true : false },
				],
			},
		];

		function open(boolean = false) {
			const aa = data.Backpack[whereIsTheItem[0]][itemData.name.replace(/ /gi, '')];
			componentsArray[0].components[0].label = `Open another! (${aa})`;

			const randomChance = Math.floor(Math.random() * 100) + 1;
			let e = false;
			itemData.chest.forEach((x) => {
				const i = itemData.chest.indexOf(x);
				if (randomChance <= itemData.chest[i].max) {
					const bool = itemData.chest[i].prize === 'Coins';
					const amount = Math.floor(Math.random() * itemData.chest[i].rand) + 1;
					const itemData2 = bool ? { emoji: client.config.coinEmoji, name: 'Coins' } : client.config.itemsData.find((y) => y.name
						.replace(/ /gi, '') === itemData.chest[i].prize
						.replace(/ /gi, ''));
					const whereIsTheItem2 = Object.keys(data.Backpack).filter(xx => data.Backpack[xx][itemData.chest[i].prize.replace(/ /gi, '')] !== undefined);

					if(itemData.chest[i].prize === 'Coins') {data.Coins += amount;}
					else {data.Backpack[whereIsTheItem2[0]][itemData.chest[i].prize.replace(/ /, '')] += amount;}
					if(e === false) data.Backpack[whereIsTheItem[0]][itemData.name.replace(/ /gi, '')]--; e = true;

					client.db.forceUpdate({ UserId: interaction.member.id }, data, require('../../Schemas/Users'));

					string += bool ? `\`${amount}x\` ${itemData2.emoji} ${itemData2.name}\n` : `╰─ \`${amount}x\` ${itemData2.emoji} ${itemData2.name}\n`;
				}
			});
			const embed = {
				title: `${interaction.member.user.username.slice(0, 10)} opens a ${itemData.name}...`,
				description: string,
				color: client.utils.randomHex(),
				thumbnail: { url: `https://cdn.discordapp.com/emojis/${itemData.emoji.replace(/\D/g, '').replace(/>/, '')}.gif` },
			};
			if(boolean) interaction.editOriginalMessage({ embed: embed, components: componentsArray });
		}
		open();
		interaction.createFollowup({ content: `${interaction.member.user.username.slice(0, 10)} opens a ${itemData.emoji} ${itemData.name}...` });
		setTimeout(async () => {
			const embed = {
				title: `${interaction.member.user.username.slice(0, 10)} opens a ${itemData.name}...`,
				description: string,
				color: client.utils.randomHex(),
				thumbnail: { url: `https://cdn.discordapp.com/emojis/${itemData.emoji.replace(/\D/g, '').replace(/>/, '')}.gif` },
			};
			interaction.editOriginalMessage({ embed: embed, components: componentsArray });

			const collector = await client.utils.createInteractionCollector({
				client: client,
				interaction: interaction,
				componentType: 2,
				filter: (user2) => user2.member.user.id === interaction.member.user.id,
			});

			function checkForRemaining() {
				if(data.Backpack[whereIsTheItem[0]][itemData.name.replace(/ /gi, '')] <= 0) {
					componentsArray[0].components[0].disabled = true;
					collector.stopListening('end');
					interaction.editOriginalMessage({ embed: embed, components: componentsArray });
				}
			}
			collector.on('collect', async button => {
				if (button.data.custom_id !== id) return;
				checkForRemaining();

				string = '';
				open(true);
			});
		}, 2000);
	}
};
