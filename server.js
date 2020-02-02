const config = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');


// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;
// console.log(token);

// // Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// // Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });

let joel_id = 123309697;
let elliot_id = 536191264;

// bot.on('message', (msg) => {
//     var Hi = "hi";
//     if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
//         bot.sendMessage(msg.chat.id, "Hello dear user");
//         console.log(msg.chat.id);
//     }  
// });

let all_ids = [joel_id, elliot_id];


const sendVerse = (verse, ids) => {
    for(let id of ids) {
        let message = "some verse";
        bot.sendMessage(id, message);
    }
}

sendVerse("hello",all_ids);


