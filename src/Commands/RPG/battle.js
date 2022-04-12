const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class Command extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'battle',
			description: 'Let\'s get some loot and battle!',
			options: [
				{ name: 'user', type: 6, description: 'Who do you wanna fight?' },
			],
			cooldown: 35000,
		});
	}
	/**
	 * @typedef {import('eris').CommandInteraction} Interaction
	 * @param {Interaction} interaction
	 */
	async run(interaction) {
		const data = await Schema.findOneAndUpdate({ UserId: interaction.member.id }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }).select('Backpack Achievements');

		const randomEnemy =
		interaction.data.options
			? { name: (await this.client.getRESTUser(interaction.data.options[0].value)).username, hp: 100, id: interaction.data.options[0].value, isPlayer: true }
			: this.client.config.mobs[Math.floor(Math.random() * this.client.config.mobs.length)];
		const Canvas = require('canvas');

		require('../../Custom/battle')(Canvas, randomEnemy, interaction, this.client, data, interaction.data.options
			? await Schema.findOneAndUpdate({ UserId: interaction.data.options[0].value }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }).select('Backpack Achievements')
			: { Backpack: { Useable: { CupidArrow: 0 } },
			});
	}
};
