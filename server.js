const config = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const firebase = require('firebase-admin');

const serviceAccount = require('./velocitytelegrambot-firebase-adminsdk-6x8f4-03b6ed7bce.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://velocitytelegrambot.firebaseio.com"
});

const firestore = firebase.firestore();



// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;
const esvToken = process.env.ESV_TOKEN;
// console.log(token);

// // Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

let joel_id = 123309697;
let elliot_id = 536191264;



let all_ids = [joel_id, elliot_id];

const fetchVerse = async (verseString, ids) => {
    headerString = 'Token ' + esvToken;
    let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseString + '&include-footnotes=false', {
        method: 'GET',
        headers: { 'Authorization': headerString },
    })
    .then(res => res.json())
    .then(json => {
        console.log(json.passages[0]);
        for(let id of ids) {
            bot.sendMessage(id, json.passages[0]);
        }
    });
}

const sendVerse = (verse, ids) => {
    for(let id of ids) {
        let message = "some verse";
        bot.sendMessage(id, message);
    }
}

fetchVerse("Matthew+2:1", all_ids);

const getUsers = async () => {    
        let snapshot = await firestore.collection("subscriptions").get();        
        // var snapshot = await this.collection().get();
        let users = [];
        snapshot.forEach((user)=> {
            users.push(user.data());
        })    

        return users;
}       