/**
 * @typedef {import('eris').Client} Client
 */
module.exports = class Interaction {
	constructor(client, name, options = {}) {
		/**
		 * @type {Client}
		 */
		this.client = client;
		this.name = options.name || name;
		this.description = options.description || 'No description.';
		this.options = options.options || [];
		this.cooldown = options.cooldown || 6000;
	}
	async run() {
		throw new Error(`Interaction ${this.name} doesn't provide a run method`);
	}
};