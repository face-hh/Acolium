const { Client } = require('eris');
const Utils = require('./BotUtils.js');
const AcoliumDatabase = require('./BotDatabase');
const config = require('./BotConfig');

/**
 * Dear Face.
 * I can not explain how dumb you are while coding.
 * Please stop the music you're playing rightnow.
 *
 * Thanks!!
 */
module.exports = class BotClient extends Client {
	constructor(options = config) {
		options.token = config.devMode === true ? process.env.TOKEN_DEV : process.env.TOKEN;

		super(options.token, { restMode: true });

		this.validate(options);

		this.interactions = new Map();
		this.devMode = true;
		this.events = new Map();
		this.utils = new Utils(this);
		this.cooldowns = new Map();
		this.config = config;

		this.db = new AcoliumDatabase();
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		this.token = options.token;
		this.prefix = options.prefix;
		this.developers = options.developers;
		this.devMode = options.devmode;

	}

	async connect() {
		require('events').EventEmitter.defaultMaxListeners = 0;
		await this.utils.loadEvents();
		await this.db.loadDatabase();
		await this.utils.loadProperties();

		if(config.devMode !== true) await this.utils.loadDBL();

		await super.connect();

		setTimeout(() => {
			console.table([{
				Events: true,
				Database: true,
				Properties: true,
				Interactions: true,
				DBL: config.devMode ? false : true,
			}]);
		}, 1000);
	}
};