// Abstraction to handle '/magic' command
// Resets user cache

const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster) => {
    const id = message.from.id;
    if (storage.userStorage.isUserAdmin(id)) {
        await storage.userStorage.pullUsersToCache();
        await broadcaster.sendMessage(id, Messages.magicMessage);
    } else {
        await broadcaster.sendMessage(id, Messages.nonMagicianMessage);
    }
}