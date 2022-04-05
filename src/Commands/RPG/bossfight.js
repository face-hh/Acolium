const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'bossfight',
			description: 'Feeling ready?',
			cooldown: 120000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		const data = await Schema.findOne({ UserId: interaction.member.id }).select('Backpack Achievements');

		const client = this.client;
		const randomEnemy = { name: 'Billy', hp: 530 };
		const Canvas = require('canvas');

		require('../../Custom/battle')(Canvas, randomEnemy, interaction, client, data, { Backpack: { Useable: { CupidArrow: 0 } } });
	}
};