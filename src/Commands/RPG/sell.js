const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class Command extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'sell',
			description: 'Got a item to sell for coins? We got you covered!',
			options: [
				{ type: 3, name: 'item', description: 'What item do you want to sell?', required: true },
				{ type: 3, name: 'amount', description: 'How many items do you wanna sell?', required: false },
			],
			cooldown: 6000,
		});
	}
	/**
	 * @typedef {import('eris').CommandInteraction} Interaction
	 * @param {Interaction} interaction
	 */
	async run(interaction) {

		const data = await Schema.findOne({ UserId: interaction.member.id }).select('Statistics Coins Achievements').lean();
		const options = interaction.data.options;
		const itemsData = require('../../Structures/BotConfig').itemsData;
		const specifiedItemData = itemsData.find((x) => x.name.toLowerCase() === options[0].value.toLowerCase());

		if(specifiedItemData === undefined) return interaction.createFollowup('I could not find that item! :(');
		if(specifiedItemData.price === null) return interaction.createFollowup('That item is not sellable! :(');

		const databaseItemName = specifiedItemData.name.replace(/ /gi, '');
		const whereIsTheItem = Object.keys(data.Backpack).filter(x => data.Backpack[x][databaseItemName] !== undefined);

		let amount = options[1] === undefined ? '1' : options[1].value;

		amount = amount
			.replace(/k/gi, '000')
			.replace(/all/gi, String(data.Backpack[whereIsTheItem[0]][databaseItemName]))
			.replace(/half/gi, String(data.Backpack[whereIsTheItem[0]][databaseItemName] / 2));

		if(isNaN(amount) === true || amount <= 0) amount = '1';

		amount = parseInt(amount);

		if(data.Backpack[whereIsTheItem[0]][databaseItemName] < amount) return interaction.createFollowup('It seems like the specified amount is bigger than what you have...');

		const totalGain = specifiedItemData.price * amount;
		const coins = await this.client.db.addCoins(interaction.member.id, totalGain);

		data.Backpack[whereIsTheItem[0]][databaseItemName] -= amount;
		data.Coins = coins.Coins;
		data.save();

		interaction.createFollowup({ embed: {
			description: `\`[✅]\` You've successfully sold **${amount} ${specifiedItemData.emoji} ${specifiedItemData.name}** for **${totalGain.toLocaleString()} ${this.client.config.coinEmoji}**`,
			color: 0x0aff00,
			author: { name: interaction.member.user.username, icon_url: interaction.member.user.dynamicAvatarURL('png') },
		} });
	}
};