const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster, subscribeStatus) => {    
    
    const id = message.from.id;
    const name = message.from.first_name;

    if (subscribeStatus) {
        if (storage.userStorage.isUserSubscribed(id)) {
            broadcaster.sendMessage(id, Messages.getAlreadyRegisteredMessage(name));
        } else {
            await storage.userStorage.updateCacheAndRemoteForUser(id, { "isSubscribed": true })
            broadcaster.sendMessage(id, Messages.resubscribeMessage);
        }
        console.log(id + " requested /subscribe, resolved\n");
    } else {
        if (storage.userStorage.isUserSubscribed(id)) {
            await storage.userStorage.updateCacheAndRemoteForUser(id, { "isSubscribed": false })
            broadcaster.sendMessage(id, Messages.unsubscribeMessage);
        } else {
            broadcaster.sendMessage(id, Messages.unsubscribeMessage);
        }
        console.log(id + " requested /unsubscribe, resolved\n");
    }
}