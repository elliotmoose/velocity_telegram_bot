const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster) => {

    const userStorage = storage.userStorage;
    const id = message.from.id;
    const name = message.from.first_name;
    
    console.log("/start called by ID " + id);

    // If new user
    if (!userStorage.doesUserExist(id)) {
        await userStorage.addUser(id, name)
        await broadcaster.sendMessage(id, Messages.getWelcomeMessage(name));
        console.log("New user registered");
    }
    else {
        console.log("User already registered")
        // If name changed
        if (name != userStorage.getUserName(id)) {
            // Write to store
            await userStorage.updateUserName(id, name)
            console.log("Name change detected, updated on store")
        }
        await broadcaster.sendMessage(id, Messages.getAlreadyRegisteredMessage(name));
    }

    console.log("/start resolved\n");
}