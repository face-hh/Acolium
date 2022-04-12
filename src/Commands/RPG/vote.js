const InteractionBase = require('../../Structures/CommandBase');

module.exports = class Command extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'vote',
			description: 'Vote for me on top.gg! You support me, and get some rewards in exchange!',
			cooldown: 30000,
		});
	}
	/**
	 * @typedef {import('eris').CommandInteraction} Interaction
	 * @param {Interaction} interaction
	 */
	async run(interaction) {
		interaction.createFollowup({
			content: 'Thanks for supporting this project, this helps us a lot!',
			embed: {
				description: `Vote [here](https://top.gg/bot/904756860475826176/vote) and receive:\n${this.client.config.coinEmoji} 2,500 \n${this.client.config.itemsData.find((y) => y.name === 'Common Chest').emoji} 1`,
				footer: { text: 'Tip: You get double rewards on weekend!' },
			},
		});
	}
};