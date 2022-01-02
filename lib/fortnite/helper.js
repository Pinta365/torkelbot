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

const getHistoricalStats = async (fortniteClient, players, startDate) => {
	const stats = [];
	for await (player of players) {
		const stat = {
			player: player.fortnite_username,
			type: 'weeklyHistory'
		}
		fortnitePlayer = await fortniteClient.searchProfiles(player.fortnite_username, player.fortnite_platform);
		const allStats = [];
		for await (period of await createPeriods(startDate)) {
			const filename = period.period + '-' + player.discord_id + '.json';
			try {				
				const periodFile = JSON.parse(await readFromFile(filename));
				period.stats = periodFile;
			} catch (e) {
				periodStats = await fortnitePlayer[0].getBRStats(period.start, period.end);
				period.stats = periodStats.stats;
				await writeToFile(periodStats.stats, filename);
			}
			allStats.push(period);
		};
		stat.stats = allStats;
		stats.push(stat);
	};
	return stats;
}
const createPeriods = async (startDate = "2021-12-06") => {
	let cursorDate = new Date(startDate + " 06:00:00");
	let dates = [];
	while (cursorDate <= new Date()) {
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

module.exports.getHistoricalStats = getHistoricalStats;
module.exports.createPeriods = createPeriods;
