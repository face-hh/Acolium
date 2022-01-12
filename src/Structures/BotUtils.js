const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

module.exports = class Utilities {
	constructor(client) {
		this.client = client;
	}
	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	async loadInteractions() {
		const interactions = await glob(`${this.directory}/Commands/**/*.js`);

		for (const interactionFile of interactions) {
			delete require.cache[interactionFile];
			const { name } = path.parse(interactionFile);
			const File = require(interactionFile);
			const interaction = new File(this.client, name.toLowerCase());

			this.client.interactions.set(interaction.name, interaction);
			this.client.cooldowns.set(interaction.name, new Map());
			this.client.createCommand(interaction);
		}
	}

	async loadEvents() {
		const events = await glob(`${this.directory}/Events/*.js`);
		for (const eventFile of events) {
			delete require.cache[eventFile];
			const { name } = path.parse(eventFile);
			const File = require(eventFile);
			const event = new File(this.client, name);

			this.client.events.set(event.name, event);
			event.emitter[event.type](name, (...args) => event.run(...args));

		}
	}

	async loadProperties() {
		const properties = require('../Custom/properties');

		properties;
	}

	/**
	 * @param {object} options - The options needed for the collector.
	 */
	async createInteractionCollector(options) {
		const dir = require('../Custom/interactionCollector');
		return dir.collectInteractions(options);
	}

	/**
	 * @param {object} client - The Discord Client.
	 * @param {object} interaction - The interaction.
	 * @param {object} user1 - The first user.
	 * @param {object} user2 - The second user.
	 * @param {function} callback - The callback to execute after.
	 */
	async createConfirmation(client, interaction, user1, user2, callback) {
		const dir = require('../Custom/createConfirmation');
		return new dir().start(client, interaction, user1, user2, callback);
	}

	/**
	 * @param {number} percentage - The percentage
	 */
	emojifiedPercentage(percentage) {
		if(percentage < 10) return '<:bar_start_empty:927529245310349322><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_end_empty:927529245268377720>';
		else if(percentage < 20) return '<:bar_start_mid:927529245377437766><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_end_empty:927529245268377720>';
		else if(percentage < 30) return '<:bar_start_full:927529245239029851><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_end_empty:927529245268377720>';
		else if(percentage < 40) return '<:bar_start_full:927529245239029851><:bar_mid_mid:927529245251624970><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_end_empty:927529245268377720>';
		else if(percentage < 50) return '<:bar_start_full:927529245239029851><:bar_mid_full:927529245029335081><:bar_mid_empty:927529245243224094><:bar_mid_empty:927529245243224094><:bar_end_empty:927529245268377720>';
		else if(percentage < 60) return '<:bar_start_full:927529245239029851><:bar_mid_full:927529245029335081><:bar_mid_mid:927529245251624970><:bar_mid_empty:927529245243224094><:bar_end_empty:927529245268377720>';
		else if(percentage < 70) return '<:bar_start_full:927529245239029851><:bar_mid_full:927529245029335081><:bar_mid_full:927529245029335081><:bar_mid_empty:927529245243224094><:bar_end_empty:927529245268377720>';
		else if(percentage < 80) return '<:bar_start_full:927529245239029851><:bar_mid_full:927529245029335081><:bar_mid_full:927529245029335081><:bar_mid_mid:927529245251624970><:bar_end_empty:927529245268377720>';
		else if(percentage < 90) return '<:bar_start_full:927529245239029851><:bar_mid_full:927529245029335081><:bar_mid_full:927529245029335081><:bar_mid_full:927529245029335081><:bar_end_empty:927529245268377720> ';
		else return '<:bar_start_full:927529245239029851><:bar_mid_full:927529245029335081><:bar_mid_full:927529245029335081><:bar_mid_full:927529245029335081><:bar_end_full:927529245243211776>';
	}

	randomHex() {
		return Math.floor(Math.random() * (0xffffff + 1));
	}

	/**
	 * @param {object} data - The MongoDB data.
	 */
	hunt(data) {
		const maximum = data.Backpack.Craftable.Scope > 0 ? 75 : 100;
		const randomChance = Math.floor(Math.random() * maximum) + 1;

		const prizes = [
			{ min: 1, max: 2, color: 0xffff00, tier: 'LEGENDARY', prize: 'Chad' },
			{ min: 2, max: 10, color: 0x9b00ff, tier: 'EPIC', prize: 'Bird' },
			{ min: 10, max: 30, color: 0x02ff00, tier: 'RARE', prize: 'Sheep' },
			{ min: 30, max: 60, color: 0xff9e67, tier: 'UNCOMMON', prize: 'Wolf' },
			{ min: 60, max: 100, color: 0xffffff, tier: 'COMMON', prize: 'Chicken' },
		];
		let prize;
		let tier;
		let color;

		for (let i = 0; i < prizes.length; i++) {
			if (randomChance >= prizes[i].min && randomChance <= prizes[i].max) {
				prize = prizes[i].prize;
				tier = prizes[i].tier;
				color = prizes[i].color;
			}
		}

		return { prize, tier, color };
	}

	fish(data) {
		const randomChance = Math.floor(Math.random() * 100) + 1;
		const maxChanceOfTreasure = data.Backpack.Craftable.WaterPurifier > 0 ? 7 : 2;

		const prizes = [
			{ min: 1, max: maxChanceOfTreasure, color: 0xffff00, tier: 'LEGENDARY', prize: 'Treasure' },
			{ min: maxChanceOfTreasure, max: 10, color: 0x9b00ff, tier: 'EPIC', prize: 'Whale' },
			{ min: 10, max: 30, color: 0x02ff00, tier: 'RARE', prize: 'Exotic Fish' },
			{ min: 30, max: 60, color: 0xff9e67, tier: 'UNCOMMON', prize: 'Fish' },
			{ min: 60, max: 80, color: 0xffffff, tier: 'COMMON', prize: 'Sand' },
			{ min: 80, max: 100, color: 0x202020, tier: 'bruh', prize: 'Garbage' },
		];
		let prize;
		let tier;
		let color;

		for (let i = 0; i < prizes.length; i++) {
			if (randomChance >= prizes[i].min && randomChance <= prizes[i].max) {
				prize = prizes[i].prize;
				tier = prizes[i].tier;
				color = prizes[i].color;
			}
		}

		return { prize, tier, color };
	}

	filterTheItems(data) {
		const res = {};
		for (const [key, value] of Object.entries(data)) {
			if (value === 0) continue;
			else res[key] = value;
		}

		return res;
	}
};