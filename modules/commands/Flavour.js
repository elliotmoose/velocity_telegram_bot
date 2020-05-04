const Messages = require('../Messages');

module.exports = async (message, broadcaster) => {
    const id = message.from.id;
    const name = message.from.first_name;

    await broadcaster.sendMessage(id, Messages.getRandomQuote());
}