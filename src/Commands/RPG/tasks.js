const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'tasks',
			description: 'See your tasks!',
			cooldown: 35000,
		});
	}
	/**
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async run(interaction) {
		const data = await Schema.findOne({ UserId: interaction.member.id }).select('Tasks TasksEndAt').lean();

		const map = data.Tasks.map((el, i) => {
			return `\`${i + 1}.\` ${this.client.config.tasks[el]}`;
		});

		interaction.createFollowup({
			embeds: [{
				title: 'Your active tasks...',
				description: map.join('\n'),
				footer: { text: 'Tasks expire & renew in: ' },
				timestamp: Date.now() - data.TasksEndAt,
			}],
		});
	}
};