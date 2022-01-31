const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'dex',
			description: 'Wanna take a look at an item?',
			cooldown: 6000,
			options: [
				{ type: 3, name: 'item', description: 'Info of which item you wanna know?', required: true },
			],
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		await interaction.acknowledge();

		const Canvas = require('canvas');

		const info = this.client.config.itemsData.find((x) => x.name.replace(/ /gi, '').toLowerCase() === interaction.data.options[0].value.replace(/ /gi, '').toLowerCase());
		const assets = {
			background: await Canvas.loadImage('src/Assets/scroll_dex.png'),
			item: await Canvas.loadImage(`https://cdn.discordapp.com/emojis/${info.emoji.replace(/\D/g, '')}.png`),
		};

		const canvas = Canvas.createCanvas(700, 700);
		const ctx = canvas.getContext('2d');

		Canvas.registerFont('src/Assets/MinecraftTen-VGORe.ttf', { family: 'Minecraft' });

		ctx.drawImage(assets.background, 0, 0, 700, 700);
		ctx.drawImage(assets.item, 132, 163, 80, 80);

		ctx.font = '24px "Minecraft"';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText(info.name, 230, 125);
		ctx.fillText(info.price === null ? 'None' : info.price.toLocaleString(), 330, 180);
		ctx.fillText(info.rarity, 345, 225);
		ctx.font = '20px "Minecraft"';
		ctx.fillText(info.type, 345, 270);

		interaction.createFollowup('', { name: 'file.png', file: await canvas.toBuffer() });
	}
};