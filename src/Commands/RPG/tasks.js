const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'quests',
			description: 'See your quests!',
			cooldown: 35000,
		});
	}
	/**
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async run(interaction) {
		const data = await Schema.findOneAndUpdate({ UserId: interaction.member.id }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }).select('Quests').lean();

		const map = data.Quests.map((el, i) => {
			return `\`${i + 1}.\` ${this.client.config.quests[el]}`;
		});

		interaction.createFollowup({
			embeds: [{
				title: 'Your active quests...',
				description: map.join('\n'),
				footer: { text: 'Quests expire & renew in: ' },
				timestamp: Date.now() - data.QuestsEndAt,
			}],
		});
	}
};