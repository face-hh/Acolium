module.exports = [
	// CRAFT
	{ name: 'Scope', price: null, type: 'POWERUP', rarity: 'Epic', emoji: '<:scope:928657776849326110>' },
	{ name: 'Glass', price: 500, type: 'COLLECTABLE', rarity: 'Rare', emoji: '<:glass:929736092809326632>' },
	{ name: 'Water Purifier', price: null, type: 'POWERUP', rarity: 'Epic', emoji: '<:water_purifier:929323189039943721>' },
	{ name: 'Coin Amulet', price: null, type: 'POWERUP', rarity: 'Legendary', emoji: '<:coin_amulet:928639227795755028>' },
	// HUNT
	{ name: 'Chad', price: 500000, type: 'COLLECTABLE', rarity: 'Legendary', emoji: '<a:giga_chad:928650772676231200>' },
	{ name: 'Bird', price: 50000, type: 'COLLECTABLE', rarity: 'Epic', emoji: '<:bird_bot:928645444345659513>' },
	{ name: 'Sheep', price: 10000, type: 'COLLECTABLE', rarity: 'Rare', emoji: '<:sheep_bot:928645886316261406>' },
	{ name: 'Wolf', price: 2500, type: 'COLLECTABLE', rarity: 'Uncommon', emoji: '<:wolf_bot:928645445377458226>' },
	{ name: 'Chicken', price: 500, type: 'COLLECTABLE', rarity: 'Common', emoji: '<:chicken_bot:928645445335539712>' },
	// FISH
	{ name: 'Treasure', price: 150000, type: 'COLLECTABLE', rarity: 'Legendary', emoji: '<:treasure:942117942005473320>' },
	{ name: 'Whale', price: 25000, type: 'COLLECTABLE', rarity: 'Epic', emoji: '<:whale_bot:942115970581925948>' },
	{ name: 'Exotic Fish', price: 5000, type: 'COLLECTABLE', rarity: 'Rare', emoji: '<:exotic_fish:942115970783264859>' },
	{ name: 'Fish', price: 1000, type: 'COLLECTABLE', rarity: 'Uncommon', emoji: '<:fish_bot:942115970594512966>' },
	{ name: 'DuckTape', price: 700, type: 'COLLECTABLE', rarity: 'Uncommon', emoji: '<:ducktape:929320660277264385>' },
	{ name: 'Sand', price: 100, type: 'COLLECTABLE', rarity: 'Common', emoji: '<:sand:942115970724528168>' },
	{ name: 'Garbage', price: 50, type: 'COLLECTABLE', rarity: 'Bruh', emoji: '<:garbage:942115970632253534>' },
	// POTIONS
	{ name: 'Fire Essence', price: null, type: 'ESSENCE', rarity: 'Uncommon', emoji: '<a:fire_essence:928638912933556224>' },
	{ name: 'Water Essence', price: null, type: 'ESSENCE', rarity: 'Uncommon', emoji: '<:water_essence:928965885362864149>' },
	{ name: 'Lightning Essence', price: null, type: 'ESSENCE', rarity: 'Uncommon', emoji: '<a:lightning_essence:928980091462111242>' },
	{ name: 'Wind Essence', price: 1000, type: 'ESSENCE', rarity: 'Uncommon', emoji: '<a:wind_essence:928965965918638121>' },
	{ name: 'Earth Essence', price: null, type: 'ESSENCE', rarity: 'Uncommon', emoji: '<a:earth_essence:928965926924193803>' },
	// USABLE
	{ name: 'Cupid Arrow', price: 5000, type: 'POWERUP', rarity: 'Rare', emoji: '<a:e:942415806329921566>' },
	{ name: 'Common Chest', price: 2500, type: 'POWERUP', rarity: 'Common', emoji: '<a:e:942802954635862026>', chest: [
		{ min: 100, max: 100, prize: 'Coins', rand: 1200 },
		{ min: 80, max: 100, prize: 'Garbage', rand: 4 },
		{ min: 60, max: 80, prize: 'Sand', rand: 3 },
		{ min: 30, max: 60, prize: 'DuckTape', rand: 2 },
		{ min: 10, max: 30, prize: 'Scope', rand: 1 },
	] },
	{ name: 'Uncommon Chest', price: 4000, type: 'POWERUP', rarity: 'Uncommon', emoji: '<a:e:942802967508180993>', chest: [
		{ min: 100, max: 100, prize: 'Coins', rand: 1200 },
		{ min: 80, max: 100, prize: 'Wind Essence', rand: 4 },
		{ min: 60, max: 80, prize: 'Fire Essence', rand: 3 },
		{ min: 30, max: 60, prize: 'Glass', rand: 2 },
		{ min: 10, max: 30, prize: 'Water Purifier', rand: 1 },
	] },
];