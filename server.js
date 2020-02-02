const config = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const firebase = require('firebase-admin');

const serviceAccount = require('./velocitytelegrambot-firebase-adminsdk-6x8f4-03b6ed7bce.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://velocitytelegrambot.firebaseio.com"
});

const firestore = firebase.firestore();



// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;
// console.log(token);

// // Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

let joel_id = 123309697;
let elliot_id = 536191264;



let all_ids = [joel_id, elliot_id];


const sendVerse = (verse, ids) => {
    for(let id of ids) {
        let message = "some verse";
        bot.sendMessage(id, message);
    }
}

sendVerse("hello",all_ids);

const getUsers = async () => {    
        let snapshot = await firestore.collection("subscriptions").get();        
        // var snapshot = await this.collection().get();
        let users = [];
        snapshot.forEach((user)=> {
            users.push(user.data());
        })    

        return users;
}       