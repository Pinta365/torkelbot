const { readFile, writeFile } = require("fs").promises;
const base64 = require("@hexagon/base64");
const { Client } = require("fnbr");
 
(async () => {
  let auth;
  auth = { authorizationCode: async () => Client.consoleQuestion("Please enter an authorization code: ") };

  const client = new Client({ auth });

  client.on("deviceauth:created", (da) => writeFile("./deviceAuth.json", JSON.stringify(da, null, 2)));


  let b64 =  base64.fromString(JSON.stringify(auth));
  console.log(`Base64 encoded string for .env-file:  ${b64}`);

  console.log("Trying to login with new device auth...");
  await client.login();
  console.log(`Logged in as ${client.user.displayName}`);
})();

/*
Använd den här länken för att ta fram en authorization code.
https://www.epicgames.com/id/logout?redirectUrl=https%3A//www.epicgames.com/id/login%3FredirectUrl%3Dhttps%253A%252F%252Fwww.epicgames.com%252Fid%252Fapi%252Fredirect%253FclientId%253D3446cd72694c4a4485d81b77adbb2141%2526responseType%253Dcode

mer info.
https://fnbr.js.org/#/docs/main/stable/general/auth
*/
