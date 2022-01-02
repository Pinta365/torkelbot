const { Client } = require("fnbr");
const helper = require("./helper")
const players = require("./players.json");

class Fortnite {
	constructor() {
	}

	async initialize(auth) {
		console.log('Fortnite: Initializing.');
		this.client = new Client({ auth });
	}

	async login() {
		await this.client.login();
		console.log(`Logged in to Fortnite as ${this.client.user.displayName}`);
	}

	async loggedIn() {
		//logik för att kolla om vi är inloggade till fortnite.
		return true;
	}

	async statistics(discord_id, start = null, end = null) {
		const player = players.filter(obj => obj.discord_id == discord_id);
		if (player.length < 1) {
			return {error: "That user is not part of Team Supreme!"};
		}
		const profile = await this.client.searchProfiles(player[0].fortnite_username, player[0].fortnite_platform);
		const startTime = (!start? new Date("2021-12-05").getTime()/1000:start);
		const endTime = end;
		console.log(startTime, endTime);
		const stats = await profile[0].getBRStats(startTime, endTime);
		console.log(stats);
		const keys = Object.keys(stats.stats);

		let validStats = {};
		//Hmm, onödig snurra, accessar alla stats via specifika nycklar ändå nedanför.. bygg om.
		for await (const stat of keys) {
			if (stat.endsWith('playlist_defaultsolo') || stat.endsWith('playlist_defaultduo') || 
				stat.endsWith('playlist_defaultsquad') || stat.endsWith('playlist_trios')) {
				validStats[stat] = stats.stats[stat];
			}
		}
		
		const statsClean = {
			startTime: startTime,
			endTime: endTime,
			solo: { 
				top1: (validStats['br_placetop1_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_placetop1_gamepad_m0_playlist_defaultsolo'] ?? 0),
				top10: (validStats['br_placetop10_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_placetop10_gamepad_m0_playlist_defaultsolo'] ?? 0),
				top25: (validStats['br_placetop25_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_placetop25_gamepad_m0_playlist_defaultsolo'] ?? 0),
				matchesPlayed: (validStats['br_matchesplayed_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_gamepad_keyboardmouse_m0_playlist_defaultsolo'] ?? 0),
				kills: (validStats['br_kills_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_kills_gamepad_m0_playlist_defaultsolo'] ?? 0),
				minutesPlayed: (validStats['br_minutesplayed_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_minutesplayed_gamepad_m0_playlist_defaultsolo'] ?? 0),
				score: (validStats['br_score_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_score_gamepad_m0_playlist_defaultsolo'] ?? 0),
				playersOutlived: (validStats['br_playersoutlived_keyboardmouse_m0_playlist_defaultsolo'] ?? 0) + (validStats['br_playersoutlived_gamepad_m0_playlist_defaultsolo'] ?? 0),
				lastModified: Math.max(validStats['br_lastmodified_keyboardmouse_m0_playlist_defaultsolo'] ?? 0, validStats['br_lastmodified_gamepad_m0_playlist_defaultsolo'] ?? 0),
			},
			duos: { 
				top1: (validStats['br_placetop1_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_placetop1_gamepad_m0_playlist_defaultduo'] ?? 0),
				top5: (validStats['br_placetop5_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_placetop5_gamepad_m0_playlist_defaultduo'] ?? 0),
				top12: (validStats['br_placetop12_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_placetop12_gamepad_m0_playlist_defaultduo'] ?? 0),
				matchesPlayed: (validStats['br_matchesplayed_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_matchesplayed_gamepad_m0_playlist_defaultduo'] ?? 0),
				kills: (validStats['br_kills_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_kills_gamepad_m0_playlist_defaultduo'] ?? 0),
				minutesPlayed: (validStats['br_minutesplayed_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_minutesplayed_gamepad_m0_playlist_defaultduo'] ?? 0),
				score: (validStats['br_score_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_score_gamepad_m0_playlist_defaultduo'] ?? 0),
				playersOutlived: (validStats['br_playersoutlived_keyboardmouse_m0_playlist_defaultduo'] ?? 0) + (validStats['br_playersoutlived_gamepad_m0_playlist_defaultduo'] ?? 0),
				lastModified: Math.max(validStats['br_lastmodified_keyboardmouse_m0_playlist_defaultduo'] ?? 0, validStats['br_lastmodified_gamepad_m0_playlist_defaultduo'] ?? 0),
			},
			trios: { 
				top1: ((validStats['br_placetop1_keyboardmouse_m0_playlist_trios'] ?? 0)) + ((validStats['br_placetop1_gamepad_m0_playlist_trios'] ?? 0)),
				top3: (validStats['br_placetop3_keyboardmouse_m0_playlist_trios'] ?? 0) + (validStats['br_placetop3_gamepad_m0_playlist_trios'] ?? 0),
				top6: (validStats['br_placetop6_keyboardmouse_m0_playlist_trios'] ?? 0) + (validStats['br_placetop6_gamepad_m0_playlist_trios'] ?? 0),
				matchesPlayed: (validStats['br_matchesplayed_keyboardmouse_m0_playlist_trios'] ?? 0) + (validStats['br_matchesplayed_gamepad_m0_playlist_trios'] ?? 0),
				kills: (validStats['br_kills_keyboardmouse_m0_playlist_trios'] ?? 0) + (validStats['br_kills_gamepad_m0_playlist_trios'] ?? 0),
				minutesPlayed: (validStats['br_minutesplayed_keyboardmouse_m0_playlist_trios'] ?? 0) + (validStats['br_minutesplayed_gamepad_m0_playlist_trios'] ?? 0),
				score: (validStats['br_score_keyboardmouse_m0_playlist_trios'] ?? 0) + (validStats['br_score_gamepad_m0_playlist_trios'] ?? 0),
				playersOutlived: (validStats['br_playersoutlived_keyboardmouse_m0_playlist_trios'] ?? 0) + (validStats['br_playersoutlived_gamepad_m0_playlist_trios'] ?? 0),
				lastModified: Math.max(validStats['br_lastmodified_keyboardmouse_m0_playlist_trios'] ?? 0, validStats['br_lastmodified_gamepad_m0_playlist_trios'] ?? 0),
			},
			squads: { 
				top1: (validStats['br_placetop1_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_placetop1_gamepad_m0_playlist_defaultsquad'] ?? 0),
				top3: (validStats['br_placetop3_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_placetop3_gamepad_m0_playlist_defaultsquad'] ?? 0),
				top6: (validStats['br_placetop6_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_placetop6_gamepad_m0_playlist_defaultsquad'] ?? 0),
				matchesPlayed: (validStats['br_matchesplayed_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_matchesplayed_gamepad_m0_playlist_defaultsquad'] ?? 0),
				kills: (validStats['br_kills_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_kills_gamepad_m0_playlist_defaultsquad'] ?? 0),
				minutesPlayed: (validStats['br_minutesplayed_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_minutesplayed_gamepad_m0_playlist_defaultsquad'] ?? 0),
				score: (validStats['br_score_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_score_gamepad_m0_playlist_defaultsquad'] ?? 0),
				playersOutlived: (validStats['br_playersoutlived_keyboardmouse_m0_playlist_defaultsquad'] ?? 0) + (validStats['br_playersoutlived_gamepad_m0_playlist_defaultsquad'] ?? 0),
				lastModified: Math.max(validStats['br_lastmodified_keyboardmouse_m0_playlist_defaultsquad'] ?? 0, validStats['br_lastmodified_gamepad_m0_playlist_defaultsquad'] ?? 0),
			},
		}

		return statsClean;		
	}
}
module.exports = Fortnite;