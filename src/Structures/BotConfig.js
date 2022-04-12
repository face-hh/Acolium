const achievements = require('../Resources/achievements');
const items = require('../Resources/items');
const craft = require('../Resources/craft');
const mobs = require('../Resources/mobs');
// const quests = require('../Resources/quests');

module.exports = {
	/** ******************* ******************* */
	devMode: false,

	coinEmoji: '<:bot_coin:928639227921571850>',
	arrowEmoji: '╰─',
	/** ******************* ******************* */
	craftData: craft,
	itemsData: items,
	achievements: achievements,
	mobs: mobs,
	// quests: quests,
};
