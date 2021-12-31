const { readFile } = require('fs').promises;
const base64 = require("@hexagon/base64");

(async () => {

    let auth = { deviceAuth: JSON.parse(await readFile('../deviceAuth.json')) };

    let b64 =  base64.fromString(JSON.stringify(auth));

    console.log(b64);
})();