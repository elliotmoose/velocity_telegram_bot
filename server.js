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

const fetchAndSendVerse = async (verseString, users) => {
    let headerString = 'Token ' + esvToken;
    let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseString + '&include-footnotes=false', {
        method: 'GET',
        headers: { 'Authorization': headerString },
    })
    let json = await response.json();
    for(let user of users) {
        let passage = json.passages[0];
        let name = user.name;
        let message = `Good morning ${name}! Here's the passage for today:\n\n` + passage;
        bot.sendMessage(user.chat_id, message);
    }    
}

const fetchAndSendVerseLate = async (verseString, id) => {
    let headerString = 'Token ' + esvToken;
    let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseString + '&include-footnotes=false', {
        method: 'GET',
        headers: { 'Authorization': headerString },
    })
    let json = await response.json();
    let passage = json.passages[0];
    let message = `Here's the passage for today:\n\n` + passage;
    bot.sendMessage(id, message);    
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

    for (let verseObj of verses) {
        let verse = verseObj.data();
        let timeToSend = verse.date.toDate();
        let is_past = Date.now() > timeToSend;
        if(!verse.sent && is_past) {
            let users = await getUsers();
            
            //send verse
            await fetchAndSendVerse(verse.verse, users);

            //update verse sent
            let verseDocRef = firestore.collection("verses").doc(verseObj.id);
            await verseDocRef.set({
                date: verse.date,
                sent: true,
                verse: verse.verse
            })

            //update latest verse sent
            firestore.collection("sent").doc("latest").set({
                id: verseObj.id
            })                            
        }
    }
}

const generateWelcomeMessage = (name) => {
    return `What's up ${name}!!\n\nFor this month, we're going to be reading the first five chapters of Matthew!\n\nI'll be sending you the verses we will be reading daily!`;
}

const generateAlreadyRegisteredMessage = (name) => {
    return `Hello there ${name}, you are already registered. Type /today to get the verse of the day!`
}

// New User
bot.on('message', async (msg) => {
    if (msg.text == '/start') {
        let name = msg.from.first_name;
        let id = msg.from.id;
        let subscription = firestore.collection('subscriptions').doc(`${id}`);
        let subscriptionSnapshot = await subscription.get();
                
        //check if already register
        if (!subscriptionSnapshot.exists) {
            await subscription.set({
                chat_id: id,
                name: name
            })

            //welcome message
            await bot.sendMessage(msg.from.id, generateWelcomeMessage(name));            

            //get latest verse (verse for todat)
            let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
            const latest_verse_id = latest_sent_doc.data().id;
            let verse = await firestore.collection('verses').doc(`${latest_verse_id}`).get();
            let date = verse.data().date;
            let verseString = verse.data().verse;
            //check if same day
            if (date.toDate().setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
                //send verse
                await fetchAndSendVerseLate(verseString, msg.from.id);
            }            
        }
        else {            
            bot.sendMessage(msg.from.id, generateAlreadyRegisteredMessage(subscriptionSnapshot.data().name));
        }
    
    }
    else if (msg.text == '/today') {
        //send today's verse
        let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
        const latest_verse_id = latest_sent_doc.data().id;
        let verse = await firestore.collection('verses').doc(`${latest_verse_id}`).get();
        let date = verse.data().date;
        let verseString = verse.data().verse;
        if (date.toDate().setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
            await fetchAndSendVerseLate(verseString, msg.from.id);
        }            
    }
    else {
        bot.sendMessage(msg.from.id, "Amen amen");
    }
});

startScheduler();