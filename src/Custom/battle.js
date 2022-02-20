module.exports = async (Canvas, randomEnemy, interaction, client, data, data2) => {
	const assets = {
		background: await Canvas.loadImage('src/Assets/background.png'),
		wizwiz: await Canvas.loadImage('src/Assets/wizwiz.png'),
		enemy: randomEnemy.isPlayer === true ? null : await Canvas.loadImage(`src/Assets/${randomEnemy.name.replace(/ /gi, '_').toLowerCase()}.png`),
		scroll: await Canvas.loadImage('src/Assets/scroll.png'),
		heart: await Canvas.loadImage('src/Assets/heart.png'),
		blue_heart: await Canvas.loadImage('src/Assets/blue_heart.png'),
	};
	const gameData = [
		{ NAME: interaction.member.user.username.slice(0, 11), HP: 100, turn: true, shield: 0, id: interaction.member.user.id, stunned: 0 },
		{ NAME: randomEnemy.name.slice(0, 11), HP: randomEnemy.hp, turn: false, shield: 0, id: randomEnemy.id, stunned: 0 },
	];
	let string = '```cs\n[START] The battle starts. [PAGE #1]\n';

	const idsData = {
		attack: String(Math.random()),
		defend: String(Math.random()),
		arrow: String(Math.random()),
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

	if (data.Backpack.Useable.CupidArrow > 0) componentsArray[0].components.push({ type: 2, label: 'Use cupid arrow', custom_id: idsData.arrow, emoji: { id: '942415806329921566' }, style: 3 });

	let gameEnded = false;
	let pages = 1;
	let stunnedUsed = 0;

	const messageObject = {
		components: componentsArray,
		embeds: [{
			description: string + '```',
			author: {
				icon_url: interaction.member.user.dynamicAvatarURL('png'),
				name: interaction.member.username + '#' + interaction.member.discriminator,
			},
			fields: [
				{ inline: true, name: '🟥', value: `<@${interaction.member.user.id}>` },
				{ inline: true, name: '\u200b', value: '\u200b' },
				{ inline: true, name: '🟦', value: randomEnemy.isPlayer ? `<@${randomEnemy.id}>` : `**${randomEnemy.name}**` },
			],
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

		ctx.drawImage(assets.scroll, 0, 0, 666, 232);
		ctx.drawImage(assets.scroll, 1254, 0, 666, 232);
		ctx.drawImage(assets.heart, 29, 26, 162, 162);
		ctx.drawImage(assets.blue_heart, 1286, 26, 162, 162);

		if (gameEnded === true) gameData[1].HP <= 0 ? gameData[1].HP = 0 : gameData[0].HP = 0;

		ctx.font = '150px "Minecraft"';
		ctx.fillStyle = 'red';
		ctx.fillText(gameData2[0].HP, 210, 170);
		ctx.fillText(gameData2[1].HP, 1470, 170);

		if (randomEnemy.isPlayer === true) {
			ctx.scale(-1, 1);
			ctx.drawImage(assets.wizwiz, -1810, 210, 424, 424);
		}
		else { ctx.drawImage(assets.enemy, 1163, 172, 848, 485); }

		return canvas.toBuffer();
	}
	interaction.createFollowup(messageObject, { name: 'file.png', file: dababy(gameData) });

	const filter = (user) => {
		if (randomEnemy.isPlayer === true) {
			return user.member.user.id === interaction.member.user.id
				|| user.member.user.id === randomEnemy.id;
		}
		else {
			return user.member.user.id === interaction.member.user.id;
		}
	};
	const collector = await client.utils.createInteractionCollector({
		client: client,
		interaction: interaction,
		componentType: 2,
		filter: filter,
	});

	collector.on('collect', async (button) => {
		if (gameEnded === true) return;

		const whoClicked = gameData.find((x) => x.id === button.member.user.id);

		if (!whoClicked) return;
		if (!Object.values(idsData).includes(button.data.custom_id)) return;
		if (whoClicked.turn === false) return;

		if (data.Backpack.Useable.CupidArrow > 0 && !componentsArray[0].components[2]) componentsArray[0].components.push({ type: 2, label: 'Use cupid arrow', custom_id: idsData.arrow, emoji: { id: '942415806329921566' }, style: 3 });

		const index = whoClicked.NAME === randomEnemy.name ? 1 : 0;

		if (button.data.custom_id === idsData.arrow) {
			stunnedUsed++;
			gameData[Math.abs(index - 1)].stunned += 3;
			string += `[POTION] ${whoClicked.NAME} shot a Cupid Arrow.\n`;
			messageObject.embeds[0].description = string + '```';

			data.Backpack.Useable.CupidArrow--;
			client.db.forceUpdate({ UserId: interaction.member.id }, data, require('../Schemas/Users'));

		}
		gameData.find((x) => x.turn === true).turn = false;
		gameData.find((x) => x.turn === false).turn = true;

		if (button.data.custom_id === idsData.attack) attack(whoClicked.NAME);
		else if (button.data.custom_id === idsData.defend) defend(whoClicked.NAME);

		checkForTooLong();
		messageObject.embeds[0].description = string + '```';

		if (!randomEnemy.isPlayer) {
			if (gameData[Math.abs(index - 1)].stunned === 0) disableButtons(true);
			interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });
		}

		if (gameData[Math.abs(index - 1)].stunned !== 0) {
			gameData[Math.abs(index - 1)].stunned--;
			string += `[STUNNED] ${gameData[Math.abs(index - 1)].NAME} fallen in love for you. (${gameData[Math.abs(index - 1)].stunned})\n`;
			messageObject.embeds[0].description = string + '```';
			interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });
		}
		else { await update(index); }
		await checkForWin();
	});

	client.on('command', (interact) => {
		if (interact.member.user.id === interaction.member.user.id) {
			client.removeListener('command', () => '');
			return collector.stopListening('end');
		}
	});

	function checkForTooLong() {
		if (string.split('\n').length > 10) {
			pages++;
			string = `\`\`\`cs\n[START] The battle starts. [PAGE #${pages}]\n`;
		}
	}
	function attack(who1) {
		if (gameEnded === true) return;

		const max = 50;
		const who2 = who1 === randomEnemy.name ? gameData[0].NAME : gameData[1].NAME;
		const index = who1 === randomEnemy.name ? 0 : 1;
		const amount = Math.floor(Math.random() * max) + 2;
		const randomChanceToMiss = Math.floor(Math.random() * 100);

		if (randomChanceToMiss <= 15) {
			string += `[MISS] ${who1} attacks ${who2} for ${amount} HP.\n`;
		}
		else {
			gameData[index].HP -= amount - gameData[index].shield;
			gameData[index].shield = 0;
			if (gameData[index].HP <= 0) gameData[index].HP = 0;

			string += `[ATTACK] ${who1} attacks ${who2} for ${amount} HP.\n`;
		}
	}

	function defend(who1) {
		const amount = Math.floor(Math.random() * 15) + 2;
		const index = who1 === randomEnemy.name ? 1 : 0;

		gameData[index].shield += amount;
		if (gameEnded === true) return;
		string += `[DEFEND] ${who1} defends next attack for ${amount} HP.\n`;
	}

	function disableButtons(bool = true) {
		componentsArray[0].components[0].disabled = bool;
		componentsArray[0].components[1].disabled = bool;
		if (componentsArray[0].components[2] && stunnedUsed !== 2) componentsArray[0].components[2].disabled = bool;
	}

	async function checkForWin() {
		if (gameData[1].HP <= 0 || gameData[0].HP <= 0) {
			const wonByWho = gameData[1].HP <= 0 ? gameData[0] : gameData[1];

			gameEnded = true;
			string += `[END] This game has ended!\n[END] The winner is ${wonByWho.NAME}.`;
			collector.stopListening('end');

			if (!randomEnemy.isPlayer && wonByWho.NAME === interaction.member.user.username) {
				const loot = await client.utils.generateBattleLoot(data, randomEnemy);
				data = loot.data;
				data.Achievements = (await client.db.addAchievement('ACH5', interaction, client)).Achievements;

				string += `\`\`\`${loot.str}`;
				messageObject.embeds[0].description = string;
				client.db.forceUpdate({ UserId: interaction.member.id }, data, require('../Schemas/Users'));
			}
			else {messageObject.embeds[0].description = string + '```';}
			disableButtons();
			interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });
		}
	}

	async function update(who) {
		if (!randomEnemy.isPlayer) {
			setTimeout(() => {
				const random = Math.floor(Math.random() * 100);

				if (random <= 30) defend(gameData[1].NAME);
				else attack(gameData[1].NAME);

				gameData[1].turn = false;
				gameData[0].turn = true;
				if (gameEnded === false) disableButtons(false);
				if (gameEnded === false) messageObject.embeds[0].description = string + '```';
				if (componentsArray[0].components[2]) {
					if (stunnedUsed === 2) componentsArray[0].components[2].disabled = true;
				}
				if (gameEnded === false) interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });

				return '';
			}, 3000);
		}
		else {
			gameData[who].turn = false;
			gameData[Math.abs(who - 1)].turn = true;
			if (Math.abs(who - 1) === 1) {
				componentsArray[0].components[0].emoji = { id: '942016115624796190' };
			}
			else { componentsArray[0].components[0].emoji = { id: '927567553721684038' }; }

			if (componentsArray[0].components[2]) {
				if (data.Backpack.Useable.CupidArrow <= 0 && gameData[who].id === interaction.member.user.id) componentsArray[0].components.splice(2, 1);
				if (data2.Backpack.Useable.CupidArrow <= 0 && gameData[Math.abs(who - 1)].id !== interaction.member.user.id) componentsArray[0].components.splice(2, 1);
				if (stunnedUsed === 2) componentsArray[0].components[2].disabled = true;
			}
			messageObject.embeds[0].description = string + '```';

			interaction.editOriginalMessage(messageObject, { name: 'file.png', file: dababy(gameData) });
		}
	}
};