const Messages = require('../Messages');

module.exports = async (message, broadcaster) => {
    const id = message.from.id;
    const name = message.from.first_name;

    let sendMessage = null;
    switch (message.text) {
        case "celibacy":
        case "singlehood":
            sendMessage = "Get behind me Satan!"
            break;
        default:
            sendMessage = Messages.getRandomQuote();
            break;
    }
    await broadcaster.sendMessage(id, sendMessage);
}