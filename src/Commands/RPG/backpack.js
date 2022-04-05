const InteractionBase = require('../../Structures/CommandBase');
const Schema = require('../../Schemas/Users');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'backpack',
			description: 'See what you got there!',
			options: [
				{ name: 'user', type: 6, description: 'Whose backpack do you wanna see?' },
			],
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		const user = interaction.data.options === undefined ? interaction.member : await this.client.getRESTUser(interaction.data.options[0].value);
		const data = await Schema.findOne({ UserId: user.id }).select('Backpack').lean();
		const client = this.client;

		const componentsArray = [{
			type: 1,
			components: [
				{ type: 2, label: 'Fishes', custom_id: 'Fishes', style: 1, disabled: true },
				{ type: 2, label: 'Animals', custom_id: 'Animals', style: 2 },
				{ type: 2, label: 'Essences', custom_id: 'Essences', style: 3 },
				{ type: 2, label: 'Craftable', custom_id: 'Craftable', style: 4 },
				{ type: 2, label: 'Useables', custom_id: 'Useable', style: 1 },
			],
		}];
		const embed1 = { title: 'Backpack: Fishes', description: '', color: this.client.utils.randomHex() };
		const embed2 = { title: 'Backpack: Animals', description: '', color: this.client.utils.randomHex() };
		const embed3 = { title: 'Backpack: Essences', description: '', color: this.client.utils.randomHex() };
		const embed4 = { title: 'Backpack: Craftable', description: '', color: this.client.utils.randomHex() };
		const embed5 = { title: 'Backpack: Useable', description: '', color: this.client.utils.randomHex() };


		function findItemInfo(key) {
			return client.config.itemsData.find((x) => x.name.replace(/ /gi, '') === key);

		}

		Object.keys(this.client.utils.filterTheItems(data.Backpack.Fishes)).forEach((key) => embed1.description += `[\`${data.Backpack.Fishes[key].toLocaleString()}\`] **${findItemInfo(key).emoji} ${key}**\n_ _   ${this.client.config.arrowEmoji} Type: \`${findItemInfo(key).type}\`\n`);
		Object.keys(this.client.utils.filterTheItems(data.Backpack.Animals)).forEach((key) => embed2.description += `[\`${data.Backpack.Animals[key].toLocaleString()}\`] **${findItemInfo(key).emoji} ${key}**\n_ _   ${this.client.config.arrowEmoji} Type: \`${findItemInfo(key).type}\`\n`);
		Object.keys(this.client.utils.filterTheItems(data.Backpack.Essences)).forEach((key) => embed3.description += `[\`${data.Backpack.Essences[key].toLocaleString()}\`] **${findItemInfo(key).emoji} ${key}**\n_ _   ${this.client.config.arrowEmoji} Type: \`${findItemInfo(key).type}\`\n`);
		Object.keys(this.client.utils.filterTheItems(data.Backpack.Craftable)).forEach((key) => embed4.description += `[\`${data.Backpack.Craftable[key].toLocaleString()}\`] **${findItemInfo(key).emoji} ${key}**\n_ _  ${this.client.config.arrowEmoji} Type: \`${findItemInfo(key).type}\`\n`);
		Object.keys(this.client.utils.filterTheItems(data.Backpack.Useable)).forEach((key) => embed5.description += `[\`${data.Backpack.Useable[key].toLocaleString()}\`] **${findItemInfo(key).emoji} ${key}**\n_ _  ${this.client.config.arrowEmoji} Type: \`${findItemInfo(key).type}\`\n`);

		const mappedIds = {
			'Fishes': embed1,
			'Animals': embed2,
			'Essences': embed3,
			'Craftable': embed4,
			'Useable': embed5,
		};

		interaction.createFollowup({ embed: embed1, components: componentsArray });

		const collector = await this.client.utils.createInteractionCollector({
			client: this.client,
			interaction: interaction,
			componentType: 2,
			filter: (u) => u.member.user.id === interaction.member.user.id,
		});

		collector.on('collect', async button => {
			if(!Object.keys(mappedIds).includes(button.data.custom_id)) return;

			// SET
			componentsArray[0].components[Object.keys(mappedIds).indexOf(button.data.custom_id)].disabled = true;
			if(button.data.custom_id !== 'Fishes') componentsArray[0].components[0].disabled = false;

			interaction.editOriginalMessage({ embed: mappedIds[button.data.custom_id], components: componentsArray });

			// RETREAT
			componentsArray[0].components[Object.keys(mappedIds).indexOf(button.data.custom_id)].disabled = false;

			// in case user runs 2 commands
		});

		this.client.on('command', (interact) => {if(interact.member.user.id === interaction.member.user.id) return collector.stopListening('end');});
	}
};