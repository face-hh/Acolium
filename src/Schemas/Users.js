const { Schema, model } = require('mongoose');
const sinon = require('sinon')
const Users = new Schema({
	UserId: { type: String, required: true },
	Statistics: {
		XP: { type: Number, default: 0 },
		LEVEL: { type: Number, default: 1 },
		CommandsUsed: { type: Array, default: [] },
		RegisteredAt: { type: Number, default: Date.now() },
		/** ******************* ******************* */
		Lifetime: {
			Traded: { type: Number, default: 0 },
			Battled: { type: Number, default: 0 },
			Quests: { type: Number, default: 0 },
			Recieved: { type: Number, default: 0 },
		},
	},
	Coins: { type: Number, default: 5000 },

	// Quests: { type: Array, default: [] },
	// QuestsEndAt: { type: Date, default: null },

	Backpack: {
		Essences: {
			FireEssence: { type: Number, default: 0 },
			WindEssence: { type: Number, default: 0 },
			EarthEssence: { type: Number, default: 0 },
			LightningEssence: { type: Number, default: 0 },
			WaterEssence: { type: Number, default: 0 },
		},
		Useable: {
			CupidArrow: { type: Number, default: 0 },
			CommonChest: { type: Number, default: 0 },
			UncommonChest: { type: Number, default: 0 },
		},
		Craftable: {
			DuckTape: { type: Number, default: 0 },
			Scope: { type: Number, default: 0 },
			Glass: { type: Number, default: 0 },
			WaterPurifier: { type: Number, default: 0 },
			CoinAmulet: { type: Number, default: 0 },
		},
		Animals: {
			Chicken: { type: Number, default: 0 },
			Wolf: { type: Number, default: 0 },
			Sheep: { type: Number, default: 0 },
			Bird: { type: Number, default: 0 },
			Chad: { type: Number, default: 0 },
		},
		Fishes: {
			Garbage: { type: Number, default: 0 },
			Sand: { type: Number, default: 0 },
			Fish: { type: Number, default: 0 },
			ExoticFish: { type: Number, default: 0 },
			Whale: { type: Number, default: 0 },
			Treasure: { type: Number, default: 0 },
		},
	},
	Achievements: {
		ACH1: { type: Boolean, default: false },
		ACH2: { type: Boolean, default: false },
		ACH3: { type: Boolean, default: false },
		ACH4: { type: Boolean, default: false },
		ACH5: { type: Boolean, default: false },
		ACH6: { type: Boolean, default: false },
		ACH7: { type: Boolean, default: false },
		ACH8: { type: Boolean, default: false },
	},
	//
});
const model2 = model('Users', Users);

Users.pre('save', async function() {
	const obj = {};

	Object.keys(this).forEach((e) => { obj[e] = this[e]; });

	delete obj._doc._id;
	delete obj._doc.UserId_1;
	delete obj._doc.__v;

	await model2.updateOne({ UserId: this.UserId }, obj._doc, { upsert: true });

	return true;
});
module.exports = model2;