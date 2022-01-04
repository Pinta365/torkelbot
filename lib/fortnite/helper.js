const fs = require('fs').promises;

const getYearWeek = (dateTS) => {
	var date = new Date(dateTS);
	date.setHours(0, 0, 0, 0);
	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
	// January 4 is always in week 1.
	var week1 = new Date(date.getFullYear(), 0, 4);
	// Adjust to Thursday in week 1 and count number of weeks from date to week1.		
	return date.getFullYear() + "-" + (1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
		- 3 + (week1.getDay() + 6) % 7) / 7));
}

const writeToFile = async (content, filename) => {
	await fs.writeFile('./stats/' + filename, JSON.stringify(content, null, 4));
}

const readFromFile = async (filename) => {
	return await fs.readFile('./stats/' + filename);
}

const getMonday = (date) => {
	let currentDate = new Date(date);
	let currentWeekDay = currentDate.getDay();
	let monday = new Date(currentDate.setDate(currentDate.getDate() - currentWeekDay + (currentWeekDay == 0 ? -6 : 1)));
	return monday;
}

const createWeeklyPeriods = async (startDate = "2021-12-06") => {
	let cursorDate = new Date(getMonday(startDate).toLocaleDateString() + " 06:00:00");
	let dates = [];
	while (cursorDate <= getMonday(new Date().toLocaleDateString())) {
		let start = new Date(Number(cursorDate)).setDate(cursorDate.getDate());
		let end = new Date(Number(cursorDate)).setDate(cursorDate.getDate() + 7);
		dates.push({
			period: getYearWeek(start),
			start: start / 1000,
			end: end / 1000
		});
		cursorDate.setDate(cursorDate.getDate() + 7);
	}
	return dates;
}

const generateWeeklyStats = async (fortniteClient, players, startDate) => {
	const stats = [];
	const periods = await createWeeklyPeriods(startDate);
	for await (player of players) {
		let fortnitePlayer = await fortniteClient.searchProfiles(player.fortnite_username, player.fortnite_platform);
		for await (period of periods) {			
			let periodStats = await fortnitePlayer[0].getBRStats(period.start, period.end);

			Object.keys(periodStats.stats).forEach(function (key) {
				if (key.endsWith('playlist_defaultsolo') || key.endsWith('playlist_defaultduo') || key.endsWith('playlist_trio') || key.endsWith('playlist_defaultsquad')) {
					let stat = { period: period.period, player: player.fortnite_username };
					stat[key] = periodStats.stats[key]
					stats.push(stat);
				}
			});
		}
	}

	await writeToFile(stats, 'weeklystats.json');
	return stats;
}

const getWeeklyStats = async (player) => {
	if (player) {
		let stats = JSON.parse(await readFromFile('weeklystats.json'));
		return stats.filter(stat => stat.player === player);
	} else {
		return JSON.parse(await readFromFile('weeklystats.json'));
	}

}

module.exports.generateWeeklyStats = generateWeeklyStats;
module.exports.getWeeklyStats = getWeeklyStats;
