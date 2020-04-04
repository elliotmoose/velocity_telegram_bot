const messages = require('../messages');

const generateWelcomeMessage = (name) => {
    return `What's up ${name}!!` + messages.welcomeMessage;
}

const generateAlreadyRegisteredMessage = (name) => {
    return `Hello there ${name}, you are already registered. Type /latest to get the verse of the day!`
}

module.exports = {
    run: async function(bot, firestore, name, id) {

        console.log("/start called by ID " + id);

        // Check if user exists
        let userPointer = firestore.collection('users').doc(`${id}`);
        let user = await userPointer.get();

        // If new user
        if (!user.exists) {
            // Write to store
            await userPointer.set({
                id: id,
                name: name
            })
            .then(() => {
                // Welcome message
                bot.sendMessage(id, generateWelcomeMessage(name)); 
            })
            .then(() => {
                console.log("New user registered");
            })
        }
        else {
            console.log("User already registered")
            // If name changed
            if (user.data().name != name) {
                // Write to store
                await userPointer.set({
                    id: id,
                    name: name
                })
                .then(() => {
                    console.log("Name change detected, updated on store")
                })
            }
            bot.sendMessage(id, generateAlreadyRegisteredMessage(name));
        }

        console.log("/start resolved\n");
    }
}