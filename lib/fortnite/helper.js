
const searchProfileByID = async (client, id)=> {
	const profileSearch = await client.getProfile(id);
	return profileSearch;
}

const getProfileStatsYesterday = async (profile)=> {
	const today = new Date(new Date().toLocaleDateString() + " 05:00:00");
	const yesterday = new Date(new Date(new Date().setDate(today.getDate() - 1)).toLocaleDateString() + " 05:00:00");

	const profileSearch = await profile.searchProfiles(player);
	console.log(profileSearch);
	const stats = await profile.getBRStats((yesterday / 1000));
	stats.fortnite_username = profile._displayName;

	return stats;
}


//module.exports.getWeeklyStats = getWeeklyStats;
