/* eslint-disable no-unused-vars */
const database = require('mongoose');
const User = require('../Schemas/Users');
const config = require('./BotConfig');

module.exports = class AcoliumDatabase {
	async loadDatabase() {

		database.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			connectTimeoutMS: 30000,
			family: 4,
		});

		database.connection.on('connected', () => {
			console.log('\x1b[32m[BOOT] \x1b[0mConnected to MongoDB!');
		});

		database.connection.on('err', (err) => {
			console.minor(`Unable to connect to the MongoDB: ${err}`);
		});

		database.connection.on('disconnected', () => {
			console.fatal('MongoDB connection is disconnected.');
		});
	}

	/** Let's take a moment to commemorate the dumb findUser function. */

	async addXP(data, amount) {
		let bool = false;

		data.Statistics.XP += amount;

		if(data.Statistics.XP >= data.Statistics.LEVEL * 100) {
			data.Statistics.XP = 0;
			data.Statistics.LEVEL++;
			data.Coins += 1200 * data.Statistics.LEVEL;

			bool = true;
			return { data, bool };
		}

		return { data, bool };
	}

	async addCoins(data, amount) {
		amount = data.Backpack.Craftable.CoinAmulet > 0 ? amount + (amount * (10 / 100)) : amount;
		data.Coins += amount;

		return data;
	}

	async addAchievement(which, interaction, data, client) {
		if(data.Achievements[which] === true) return data;

		client.createMessage(interaction.channel.id, `\`[🐒]\` New achievement!\n\`[  ]\` **${config.achievements[which].emoji + config.achievements[which].name}**.`);
		data.Achievements[which] = true;

		return data;
	}
};