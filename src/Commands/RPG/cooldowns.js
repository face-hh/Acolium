const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'cooldowns',
			description: 'If you ever wanna know what command is in cooldown!',
			cooldown: 6000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {

		const arr = [
			':red_square:',
			':green_square:',
		];
		const client = this.client;

		let map = '';

		Object.keys(this.client.config.cooldowns).forEach((command) => {
			const cooldown = this.client.cooldowns.get(command);

			if(cooldown.has(interaction.member.id)) {
				map += `${arr[0]} **${command}**: Will be ready in \`${client.utils.ms((cooldown.get(interaction.member.id) + this.client.config.cooldowns[command]) - Date.now())}\`\n`;
			}
			else {
				map += `${arr[1]} **${command}**.\n`;
			}
		});
		interaction.createFollowup({
			embed: {
				description: map,
				author: { name: interaction.member.user.username, icon_url: interaction.member.user.dynamicAvatarURL('png') },
			},
		});
	}
};