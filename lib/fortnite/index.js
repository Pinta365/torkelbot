
const { Client } = require('fnbr');


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

    async statistics(player) {
        /*
        const myFriends = await client.friends.forEach(async friend => {
			
			if (friend._displayName === 'Pintapoff') {
				console.log("FN", friend._displayName);
			}
	
		});
        */
    }

}

module.exports = Fortnite;