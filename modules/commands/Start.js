const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster) => {

    console.log("/start called by ID " + id);

    const userStorage = storage.userStorage;

    const id = message.from.id;
    const name = message.from.first_name;

    // If new user
    if (!userStorage.doesUserExist(id)) {
        await userStorage.addUser(id, name)
        .then(() => {
            // Welcome message
            await broadcaster.sendMessage(id, Messages.getWelcomeMessage(name));
        })
        .then(() => {
            console.log("New user registered");
        })
    }
    else {
        console.log("User already registered")
        // If name changed
        if (name != userStorage.getUserName(id)) {
            // Write to store
            userStorage.updateUserName(id, name)
            .then(() => {
                console.log("Name change detected, updated on store")
            })
        }
        await broadcaster.sendMessage(id, Messages.generateAlreadyRegisteredMessage(name));
    }

    console.log("/start resolved\n");
}