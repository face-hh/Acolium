const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'bossfight',
			description: 'Feeling ready?',
			cooldown: 35000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		const data = await this.client.db.findUser(interaction.member.user.id);
		await interaction.acknowledge();

		const client = this.client;
		const randomEnemy = { name: 'Billy', hp: 530 };
		const Canvas = require('canvas');

		require('../../Custom/battle')(Canvas, randomEnemy, interaction, client, data);
	}
};