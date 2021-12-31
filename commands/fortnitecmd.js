const { SlashCommandBuilder } = require("@discordjs/builders");
const base64 = require("@hexagon/base64");
const Fortnite = require("../lib/fortnite");

module.exports = {

	data: new SlashCommandBuilder()
		.setName("fortnite")
		.setDescription("This contains a series of fortnite sub commands.")

		.addSubcommand(subcommand => subcommand.setName("test")
			.setDescription("Test command")
			.addStringOption(option => option.setName("test").setDescription("test desc").setRequired(true)))

		.addSubcommand(subcommand => subcommand.setName("stats")
			.setDescription("Look up player statistics.")
			.addUserOption(option => option.setName("player").setDescription("user to look up").setRequired(true))),

	async execute(interaction, extras) {
		if (interaction.options.getSubcommand() === "test") {
			const player = interaction.options.getString("test");
			await interaction.reply(`Ok, ${player}`);


		} else if (interaction.options.getSubcommand() === "stats") {
			//const user = interaction.options.getUser("player");
			//await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			/*
			const friends = await extras.client.friends.forEach(async friend => {
				let stats = await friend.getBRStats();
				
				await interaction.reply(`Found a friend: ${friend._displayName}`);	
			
			});*/
			const friends = await extras.client.friends;
			console.log(friends);
			await interaction.reply(`Found ${friends.size} friends`);


		} else {
			await interaction.reply("No sub command was used");
		}
	},

	async runOnLoad() {
		const fortnite = new Fortnite();
		let auth = JSON.parse(base64.toString(process.env.DEVICEAUTH));
		await fortnite.initialize(auth);
		await fortnite.login();

		return fortnite;
	},

};