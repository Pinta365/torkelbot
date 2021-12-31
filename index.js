require('dotenv').config()
const { Client, Intents } = require("discord.js");
const commandHandler = require("./lib/commands.js");


(async () => {

	const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });

	//Deply commands.
	//await commandHandler.deploy();

	//Load commands
	await commandHandler.load(client);

	client.once("ready", () => {
		console.log("Torkel is ready!");
	});

	client.on("interactionCreate", async interaction => {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction, command.extras);

		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	});

	client.login(process.env.TOKEN);
})();
