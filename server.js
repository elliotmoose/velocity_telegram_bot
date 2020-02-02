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

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

let joel_id = 123309697;
let elliot_id = 536191264;

let all_ids = [joel_id, elliot_id];

const fetchVerse = async (verseString) => {
    let headerString = 'Token ' + esvToken;
    let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseString + '&include-footnotes=false', {
        method: 'GET',
        headers: { 'Authorization': headerString },
    });

    let json = await response.json();
    return json.passages[0] || "";
}

const sendMessageToChats = (message, ids) => {
    for(let id of ids) {
        bot.sendMessage(id, message);
    }
}

const getUsers = async () => {    
    let snapshot = await firestore.collection("subscriptions").get();        
    let users = [];
    snapshot.forEach((user)=> {
        users.push(user.data());
    })    

    return users;
}       

const getVerses = async () => {
    let snapshot = await firestore.collection("verses").get();        
    let verses = [];
    snapshot.forEach((verse)=> {
        verses.push(verse);
    })    

    return verses;
}

const startScheduler = async () => {
    await checkShouldSendVerse();
    setInterval(async () => {
        await checkShouldSendVerse();
    }, 5000);
}

const checkShouldSendVerse = async () => {
    let verses = await getVerses();

    for(let verseObj of verses) {
        let verse = verseObj.data();
        let timeToSend = verse.date.toDate();
        let is_past = Date.now() > timeToSend;
        if(!verse.sent && is_past) {
            let users = await getUsers();
            let chat_ids = users.map((user)=>user.chat_id);
            let verseText = fetchVerse(verse.verse);
            sendMessageToChats(verseText, chat_ids);
            let docRef = firestore.collection("verses").doc(verseObj.id);
            docRef.set({
                date: verse.date,
                sent: true,
                verse: verse.verse
            })
        }
    }
}

startScheduler();