// Abstraction to handle '/help' command

const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster) => {
    const id = message.from.id;
    await broadcaster.sendMessage(id, Messages.helpMessage);
}