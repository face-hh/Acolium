module.exports = {
	token: process.env.TOKEN,
	prefix: process.env.PREFIX,
	developers: process.env.DEVELOPERS,

	devMode: true,
	craftData: [
		{ name: 'Scope', neededItems: [{ DuckTape: 1, Glass: 1 }], Coins: 25000, description: 'Boosts hunt chances by 25%.' },
		{ name: 'Glass', neededItems: [{ Sand: 1, FireEssence: 1 }], Coins: 1000, description: 'Used in crafting.' },
		{ name: 'Water Purifier', neededItems: [{ WaterEssence: 4 }], Coins: 30000, description: 'Boosts chances of fishing a treasure by 400% `(2% => 8%)`.' },
		{ name: 'Coin Amulet', neededItems: [{ Glass: 2 }], Coins: 125000, description: 'Increases the amount of coins you get by 10%.' },
	],
	itemsData: [
		// CRAFT
		{ name: 'Scope', price: null, type: 'POWERUP', emoji: '<:scope:928657776849326110>' },
		{ name: 'Glass', price: 500, type: 'COLLECTABLE', emoji: '<:glass:929736092809326632>' },
		{ name: 'Water Purifier', price: null, type: 'POWERUP', emoji: '<:water_purifier:929323189039943721>' },
		{ name: 'Coin Amulet', price: null, type: 'POWERUP', emoji: '<:coin_amulet:928639227795755028>' },
		// HUNT
		{ name: 'Chad', price: 1000000, type: 'COLLECTABLE', emoji: '<a:giga_chad:928650772676231200>' },
		{ name: 'Bird', price: 50000, type: 'COLLECTABLE', emoji: '<:bird_bot:928645444345659513>' },
		{ name: 'Sheep', price: 10000, type: 'COLLECTABLE', emoji: '<:sheep_bot:928645886316261406>' },
		{ name: 'Wolf', price: 2500, type: 'COLLECTABLE', emoji: '<:wolf_bot:928645445377458226>' },
		{ name: 'Chicken', price: 500, type: 'COLLECTABLE', emoji: '<:chicken_bot:928645445335539712>' },
		// FISH
		{ name: 'Treasure', price: 500000, type: 'COLLECTABLE', emoji: '<:treasure:928639227783168050>' },
		{ name: 'Whale', price: 25000, type: 'COLLECTABLE', emoji: '<:whale_bot:929645852069355571>' },
		{ name: 'Exotic Fish', price: 5000, type: 'COLLECTABLE', emoji: '<:ducktape:929320660277264385>' },
		{ name: 'Fish', price: 1000, type: 'COLLECTABLE', emoji: '<:fish_bot:929320660466024518>' },
		{ name: 'DuckTape', price: 700, type: 'COLLECTABLE', emoji: '<:exotic_fish:929320660306645023>' },
		{ name: 'Sand', price: 100, type: 'COLLECTABLE', emoji: '<:sand:928639227720269836>' },
		{ name: 'Garbage', price: 50, type: 'COLLECTABLE', emoji: '<:garbage:928639228051595324>' },
		// POTIONS
		{ name: 'Fire Essence', price: null, type: 'ESSENCE', emoji: '<a:fire_essence:928638912933556224>' },
		{ name: 'Water Essence', price: null, type: 'ESSENCE', emoji: '<:water_essence:928965885362864149>' },
		{ name: 'Lightning Essence', price: null, type: 'ESSENCE', emoji: '<a:lightning_essence:928980091462111242>' },
		{ name: 'Wind Essence', price: null, type: 'ESSENCE', emoji: '<a:wind_essence:928965965918638121>' },
		{ name: 'Earth Essence', price: null, type: 'ESSENCE', emoji: '<a:earth_essence:928965926924193803>' },
	],
	coinEmoji: '<:bot_coin:928639227921571850>',
	cooldowns: {
		achievements: 6000,
		backpack: 6000,
		craft: 6000,
		fish: 35000,
		hunt: 30000,
		profile: 6000,
		sell: 6000,
	},
	achievements: {
		// sadly jerson went to sleep while i was making the achievements and i couldn't add emojis to them :c

		ACH1: { emoji: '', name: 'Gettin\' on gear' },
		ACH2: { emoji: '', name: 'Professional Hunter' },
		ACH3: { emoji: '', name: 'Treasure hunter' },
		ACH4: { emoji: '', name: 'Active wiz' },
		ACH5: { emoji: '', name: 'Fightin\' boy' },
		ACH6: { emoji: '', name: 'Catch that fish' },
		ACH7: { emoji: '', name: 'Gettin\' into huntin\'' },
		ACH8: { emoji: '', name: 'Complete the GAME' },
	},
	mobs: [
		{ name: 'Bear', hp: 60, essence: 'EarthEssence' },
		{ name: 'Cloud', hp: 30, essence: 'LightningEssence' },
		{ name: 'Fire Leaves', hp: 70, essence: 'FireEssence' },
		{ name: 'Water Worm', hp: 70, essence: 'WaterEssence' },
		{ name: 'Air', hp: 5, essence: 'WindEssence' },
	],
};