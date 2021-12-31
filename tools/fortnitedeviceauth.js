const { readFile, writeFile } = require('fs').promises;
const { Client } = require('fnbr');

(async () => {
  let auth;
  auth = { authorizationCode: async () => Client.consoleQuestion('Please enter an authorization code: ') };

  const client = new Client({ auth });

  client.on('deviceauth:created', (da) => writeFile('./deviceAuth.json', JSON.stringify(da, null, 2)));

  await client.login();
  console.log(`Logged in as ${client.user.displayName}`);
})();
