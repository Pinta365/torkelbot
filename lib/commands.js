const fs = require("fs");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = {

	async deploy() {
		const commands = [];
		const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

		for await (const file of commandFiles) {
			console.log(file);
			const command = require(`../commands/${file}`);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

		rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), { body: commands })
			.then(() => console.log("Successfully registered application commands."))
			.catch(console.error);
	},

	async load(client) {
		client.commands = new Collection();
		const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

		for await (const file of commandFiles) {
			try {
				const command = require(`../commands/${file}`);
				client.commands.set(command.data.name, command);

				const commandCheck =  await client.commands.get(command.data.name);

				//Check if theres "extras" to load
				if (commandCheck.runOnLoad) {	
					const commandExtras = await commandCheck.runOnLoad();
					commandCheck.extras = commandExtras;
				}
				
				console.log(`Command loaded: ${command.data.name} ✔️`);
			} catch (error) {
				console.log(`Command not loaded: ${file} ❌ (error: ${error})`);
			}

		}
	}

};