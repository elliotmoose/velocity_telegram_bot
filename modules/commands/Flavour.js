// Abstraction to handle anything else that is sent to the bot

const Messages = require('../Messages');

module.exports = async (message, broadcaster) => {
    const id = message.from.id;
    const name = message.from.first_name;

    let sendMessage = null;
    switch (message.text.toLowerCase()) {
        case "celibacy":
        case "singlehood":
            sendMessage = "Get behind me Satan!";
            break;
        case "thank you":
        case "thanks":
        case "tanks":
            sendMessage = "Ur welcome :)";
            break;
        case "wow":
            sendMessage = "Come on";
        default:
            sendMessage = Messages.getRandomQuote();
            break;
    }
    await broadcaster.sendMessage(id, sendMessage);
}