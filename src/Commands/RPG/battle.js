const InteractionBase = require('../../Structures/CommandBase');

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'battle',
			description: 'Let\'s get some loot and battle!',
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
		const randomEnemy = this.client.config.mobs[Math.floor(Math.random() * this.client.config.mobs.length)];
		const Canvas = require('canvas');

		const assets = {
			background: await Canvas.loadImage('src/Assets/background.png'),
			wizwiz: await Canvas.loadImage('src/Assets/wizwiz.png'),
			enemy: await Canvas.loadImage(`src/Assets/${randomEnemy.name.replace(/ /gi, '_').toLowerCase()}.png`),
			scroll: await Canvas.loadImage('src/Assets/scroll.png'),
			heart: await Canvas.loadImage('src/Assets/heart.png'),
		};
		const gameData = [
			{ NAME: interaction.member.user.id, HP: 100, turn: true, shield: 0 },
			{ NAME: randomEnemy.name, HP: randomEnemy.hp, turn: false, shield: 0 },
		];
		let string = '```cs\n[START] The battle starts.\n';

		const idsData = {
			attack: String(Math.random()),
			defend: String(Math.random()),
		};

		const componentsArray = [
			{
				type: 1,
				components: [
					{ type: 2, label: 'Attack', custom_id: idsData.attack, emoji: { id: '927567553721684038' }, style: 1 },
					{ type: 2, label: 'Defend', custom_id: idsData.defend, emoji: { id: '927567572478595072' }, style: 2 },
				],
			},
		];

		let gameEnded = false;

		const messageObject = {
			components: componentsArray,
			embeds: [{
				description: string + '```',
				author: {
					icon_url: interaction.member.user.dynamicAvatarURL('png'),
					name: interaction.member.username + '#' + interaction.member.discriminator,
				},
				image: { url: 'attachment://file.png' },
				color: 0xFFFFFF,
			}],
			attachments: [],
		};

		Canvas.registerFont('src/Assets/MinecraftTen-VGORe.ttf', { family: 'Minecraft' });

		function dababy(gameData2) {
			const canvas = Canvas.createCanvas(1920, 786);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(assets.background, 0, 0, 1920, 768);
			ctx.drawImage(assets.wizwiz, 111, 203, 424, 424);
			ctx.drawImage(assets.enemy, 1163, 172, 848, 485);
			ctx.drawImage(assets.scroll, 0, 0, 666, 232);
			ctx.drawImage(assets.scroll, 1254, 0, 666, 232);
			ctx.drawImage(assets.heart, 29, 26, 162, 162);
			ctx.drawImage(assets.heart, 1286, 26, 162, 162);

			if(gameEnded === true) gameData[1].HP <= 0 ? gameData[1].HP = 0 : gameData[0].HP = 0;

			ctx.font = '150px "Minecraft"';
			ctx.fillStyle = 'red';
			ctx.fillText(gameData2[0].HP, 210, 170);
			ctx.fillText(gameData2[1].HP, 1470, 170);

			return canvas.toBuffer();
		}
		interaction.createFollowup(messageObject, { name: 'file.png', file: dababy(gameData) });

		const collector = await this.client.utils.createInteractionCollector({
			client: this.client,
			interaction: interaction,
			componentType: 2,
			filter: (user) => user.member.user.id === interaction.member.user.id,
		});

		collector.on('collect', async (button) => {
			if(!Object.values(idsData).includes(button.data.custom_id)) return;
			if(button.member.id !== gameData[0].NAME) return;
			if(gameData[0].turn === false) return;

			if(button.acknowledged === false) await button.acknowledge();
			gameData[0].turn = false;
			gameData[1].turn = true;

			if(button.data.custom_id === idsData.attack) attack('WizWiz', gameData[1].NAME, 1);
			else if(button.data.custom_id === idsData.defend) defend('WizWiz', 0);

			componentsArray[0].components[0].disabled = true;
			componentsArray[0].components[1].disabled = true;
			messageObject.embeds[0].description = string + '```';

			interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });

			await update();

			await checkForWin();
		});

		this.client.on('command', (interact) => {
			if(interact.member.user.id === interaction.member.user.id) {
				this.client.removeListener('command', () => '');
				return collector.stopListening('end');
			}
		});

		function attack(who1, who2, index) {
			if(gameEnded === true) return;

			// let's bully that enemy >:)
			const max = who1 === randomEnemy.name ? 20 : 50;
			const amount = Math.floor(Math.random() * max) + 2;
			const randomChanceToMiss = Math.floor(Math.random() * 100);

			if(randomChanceToMiss <= 15) {
				string += `[MISS] ${who1} attacks ${who2} for ${amount} HP.\n`;
			}
			else {
				gameData[index].HP -= amount - gameData[index].shield;
				gameData[index].shield = 0;
				if(gameData[index].HP <= 0) gameData[index].HP = 0;

				string += `[ATTACK] ${who1} attacks ${who2} for ${amount} HP.\n`;
			}
		}

		function defend(who1, index) {
			const amount = Math.floor(Math.random() * 15) + 2;

			gameData[index].shield += amount;
			if(gameEnded === true) return;
			string += `[DEFEND] ${who1} defends the next attack with ${amount} HP.\n`;
		}

		function disableButtons() {
			componentsArray[0].components[0].disabled = true;
			componentsArray[0].components[1].disabled = true;
		}

		async function checkForWin() {
			if(gameData[1].HP <= 0 || gameData[0].HP <= 0) {
				const wonByWho = gameData[1].HP <= 0 ? 'WizWiz' : gameData[1].NAME;

				if(wonByWho === 'WizWiz') {
					const e = await client.db.addAchievement('ACH5', interaction, client);
					data.Achievements = e.Achievements;
					data.Backpack.Essences[randomEnemy.essence]++;
					data.Backpack.Craftable.DuckTape++;
					client.db.forceUpdate({ UserId: interaction.member.id }, data, require('../../Schemas/Users'));
				}
				gameEnded = true;
				string += `[END] This game has ended!\n[END] The winner is ${gameData[1].HP <= 0 ? 'WizWiz\n[END](+1 ' + randomEnemy.essence + ' | ' + '+1 Duck Tape' + ')' : gameData[1].NAME}.`;
				collector.stopListening('end');

				disableButtons();
				interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });
			}
		}

		async function update() {
			setTimeout(() => {
				const random = Math.floor(Math.random() * 100);

				if(random <= 30) defend(gameData[1].NAME, 1);
				else attack(gameData[1].NAME, 'WizWiz', 0);

				gameData[1].turn = false;
				gameData[0].turn = true;
				if(gameEnded === false) componentsArray[0].components[0].disabled = false;
				if(gameEnded === false) componentsArray[0].components[1].disabled = false;
				messageObject.embeds[0].description = string + '```';

				interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });

				return '';
			}, 3000);
		}
	}
};
