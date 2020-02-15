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
const token = process.env.STAGING_TELEGRAM_TOKEN;
const esvToken = process.env.ESV_TOKEN;
let expectingFeedback = {}
let expectingTestimony = {}
const stuffPsMavisSays = ["Amen amen", "That's right", "Come on", "So good", "Wassup people"];
const feedbackRequestMessage = "What other things would you like me to able to do in future? Send me some feedback in your next message! Your feedback will remain anonymous. To cancel this operation, send 'Cancel'.";
const feedbackReceivedMessage = "Thank you for your suggestion!"
const testimonyRequestMessage = "Let's lift up the name of Jesus!! What would you like to thank him for? Your testimony will be reviewed by an admin before it will be broadcast to all subscribers! To cancel this operation, type 'Cancel'.";
const testimonyReceivedMessage = "Amen amen!! Thank you for sharing that with us!"
const cancellationMessage = "SHORE!"

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const ELLIOT_ID = 536191264;
const JOEL_ID = 123309697;

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

const fetchAndSendLatest = async (verseString, id) => {
    let headerString = 'Token ' + esvToken;
    let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseString + '&include-footnotes=false', {
        method: 'GET',
        headers: { 'Authorization': headerString },
    })
    let json = await response.json();
    let passage = json.passages[0];
    let message = `Here's the latest passage:\n\n` + passage;
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

const getAnnouncements = async () => {
    let latestRef = firestore.collection("announcements").doc("latest");
    await latestRef.get()
    .then((doc) => {
        let next = doc.data().latest + 1;
        let nextRef = firestore.collection("announcements").doc(`${next}`)
        nextRef.get()
        .then((doc) => {
            if (doc.exists) {
                let announcement = doc.data()
                if (!announcement.sent) {
                    // Send to all users
                    bot.sendMessage(JOEL_ID, announcement.message)
                    .then(() => {
                        nextRef.set({
                            message: announcement.message,
                            sent: true
                        })
                        .then(() => {
                            latestRef.set({
                                latest: next
                            })
                        })
                    })
                }
            }
        })
    })
}

const getShoutHisName = async () => {
// TODO: check sent
//     let latestRef = firestore.collection("shouthisname").doc("latest");
//     await latestRef.get()
//     .then((doc) => {
//         let next = doc.data().latest + 1;
//         let nextRef = firestore.collection("shouthisname").doc(`${next}`)
//         nextRef.get()
//         .then((doc) => {
//             if (doc.exists) {
//                 let shouthisname = doc.data()
//                 if (!shouthisname.sent && shouthisname.approved) {
//                     // Send to all users
//                     bot.sendMessage(JOEL_ID, shouthisname.message)
//                     .then(() => {
//                         nextRef.set({
//                             approved: true,
//                             message: shouthisname.message,
//                             sent: true
//                         })
//                         .then(() => {
//                             latestRef.set({
//                                 latest: next
//                             })
//                         })
//                     })
//                 }
//             }
//         })
//     })
}

const startScheduler = async () => {
    await checkShouldSendVerse();
    setInterval(async () => {
        await checkShouldSendVerse();
    }, 30*60*1000); //check every half hour
}

const checkShouldSendVerse = async () => {    
    try {
        let verses = await getVerses();
    
        for (let verseObj of verses) {
            let verse = verseObj.data();
            let timeToSend = verse.date.toDate();                    
            let is_past = new Date() > timeToSend;
            if(!verse.sent && is_past) {
                let users = await getUsers();
                
                // Send verse
                await fetchAndSendVerse(verse.verse, users);
    
                // Update verse sent
                let verseDocRef = firestore.collection("verses").doc(verseObj.id);
                await verseDocRef.set({
                    date: verse.date,
                    sent: true,
                    verse: verse.verse
                })
    
                // Update latest verse sent
                firestore.collection("sent").doc("latest").set({
                    id: verseObj.id
                })                            
            }
        }

        getAnnouncements()
        getShoutHisName()
        
    } catch (error) {
        console.log(error);
    }   
}

const generateWelcomeMessage = (name) => {
    return `What's up ${name}!!\n\nFor this month, we're going to be reading the first five chapters of Matthew!\n\nI'll be sending you the verses we will be reading daily!`;
}

const generateAlreadyRegisteredMessage = (name) => {
    return `Hello there ${name}, you are already registered. Type /latest to get the verse of the day!`
}

// New User
bot.on('message', async (msg) => {
    if (expectingFeedback[`${msg.from.id}`] == 1) {
        if (msg.text == 'Cancel') {
            expectingFeedback[`${msg.from.id}`] = 0;
            bot.sendMessage(msg.from.id, cancellationMessage);
        } else {
            firestore.collection('feedback').doc().set({
                message: msg.text
            });
            expectingFeedback[`${msg.from.id}`] = 0;
            bot.sendMessage(msg.from.id, feedbackReceivedMessage);
        }
    }
    else if (expectingTestimony[`${msg.from.id}`] == 1) {
        if (msg.text == 'Cancel') {
            expectingTestimony[`${msg.from.id}`] = 0;
            bot.sendMessage(msg.from.id, cancellationMessage);
        } else {
            let latestRef = firestore.collection("shouthisname").doc("latest");
            await latestRef.get()
            .then((doc) => {
                let next = doc.data().entry + 1;
                firestore.collection("shouthisname").doc(`${next}`).set({
                    approved: false,
                    message: msg.text,
                    sent: false
                });
                latestRef.set({
                    entry: next,
                    sent: doc.data().sent
                })
            })
            expectingTestimony[`${msg.from.id}`] = 0;
            bot.sendMessage(msg.from.id, testimonyReceivedMessage);
        }
    }
    else if (msg.text == '/start') {
        let name = msg.from.first_name;
        let id = msg.from.id;
        let subscription = firestore.collection('subscriptions').doc(`${id}`);
        let subscriptionSnapshot = await subscription.get();

        // Check if already registered
        if (!subscriptionSnapshot.exists) {
            await subscription.set({
                chat_id: id,
                name: name
            })

            // Welcome message
            await bot.sendMessage(msg.from.id, generateWelcomeMessage(name));            

            // Get latest verse
            let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
            const latest_verse_id = latest_sent_doc.data().id;
            let verse = await firestore.collection('verses').doc(`${latest_verse_id}`).get();
            let verseString = verse.data().verse;
            await fetchAndSendLatest(verseString, msg.from.id);
        }
        else {            
            bot.sendMessage(msg.from.id, generateAlreadyRegisteredMessage(subscriptionSnapshot.data().name));
        }
    
    }
    else if (msg.text == '/latest') {
        // Send the latest passage
        let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
        const latest_verse_id = latest_sent_doc.data().id;
        let verse = await firestore.collection('verses').doc(`${latest_verse_id}`).get();
        let verseString = verse.data().verse;
        await fetchAndSendLatest(verseString, msg.from.id);
    }
    else if (msg.text == '/feedback') {
        // Send feedback request message, flag user as 
        bot.sendMessage(msg.from.id, feedbackRequestMessage);
        expectingFeedback[`${msg.from.id}`] = 1;
    }
    else if (msg.text == '/shouthisname') {
        // Send testimony request message
        bot.sendMessage(msg.from.id, testimonyRequestMessage);
        expectingTestimony[`${msg.from.id}`] = 1;
    }
    else {
        bot.sendMessage(msg.from.id, stuffPsMavisSays[Math.floor(Math.random() * stuffPsMavisSays.length)]);
    }
});

startScheduler();