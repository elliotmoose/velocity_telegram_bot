const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster) => {

    const userStorage = storage.userStorage;
    const id = message.from.id;
    const name = message.from.first_name;
    
    console.log("/latest called by ID " + id);

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
    //         let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
    //         const latest_verse_id = latest_sent_doc.data().id;
    //         let verse = await firestore.collection('verses').doc(`${latest_verse_id}`).get();
    //         let verseString = verse.data().verse;
    //         await fetchAndSendLatest(verseString, msg.from.id);

    console.log("/latest resolved\n");
}