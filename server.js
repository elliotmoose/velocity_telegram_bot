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
const stuffPsMavisSays = ["Amen amen", "That's right", "Come on", "So good", "Wassup people"];
const feedbackRequestMessage = "Send me some feedback in your next message for me to improve! Else, type 'Cancel'.";
const livestreamMessage = "The livestream link for this Sunday is ";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
let admin_ids = [536191264/*elliot*/, 123309697/*joel*/, 192664082/*adriel*/];
const ELLIOT_ID = 536191264;
const JOEL_ID = 123309697;
const ADRIEL_ID = 192664082;

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

// livestream
const fetchLivestream = async (id) => {
    await firestore.collection("announcements").doc("livestream").get().then((doc) => {
        let link = doc.data().link;
        bot.sendMessage(id, livestreamMessage + link);
    });
}

const setLivestream = async (newlink, id) => {
    if (newlink.length == 1) {
        bot.sendMessage(id, "To use this, enter:\n/updatels [optional arg] [link]\n\nwhere [optional arg] has 3 options:\n'-d' to set to default of 'not ready yet 😔'\n'-u' to update link to [link]\n'-b' to broadcast current link to everyone");
    }
    else {
        if (newlink[1] == "-d") {
            newlink = "not ready yet 😔"
            await firestore.collection("announcements").doc("livestream").set({
                link: newlink
            });
            bot.sendMessage(id, "Updated: " + livestreamMessage + newlink);
        }
        else if (newlink[1] == "-u") {
            if (newlink.length != 2) {
                newlink = newlink[2]
                await firestore.collection("announcements").doc("livestream").set({
                    link: newlink
                });
                bot.sendMessage(id, "Updated: " + livestreamMessage + newlink);
            } else {
                bot.sendMessage(id, "Link is not specified");
            }
        }
        else if (newlink[1] == "-b") {
            await firestore.collection("announcements").doc("livestream").get().then((doc) => {
                newlink = doc.data().link;
            });
            // let users = await getUsers();
            // for(let user of users) {
            //     bot.sendMessage(user.chat_id, livestreamMessage + newlink);
            // }
            for (let id of admin_ids) {
                bot.sendMessage(id, livestreamMessage + newlink);
            }
        }
        else {
            bot.sendMessage(id, "Unknown flag");
        }
    }
}

const getAnnouncements = async () => {
    let latestRef = firestore.collection("announcements").doc("latest");
    await latestRef.get()
    .then((doc) => {
        let next = doc.data().latest + 1;
        let nextRef = firestore.collection("announcements").doc(`${next}`)
        nextRef.get()
        .then(async (doc) => {
            if (doc.exists) {
                let announcement = doc.data()
                if (!announcement.sent) {
                    let users = await getUsers();

                    // Send to all users
                    for(let user of users) {
                        bot.sendMessage(user.chat_id, announcement.message);
                    }
                    
                    nextRef.set({
                        message: announcement.message,
                        sent: true
                    })
                    .then(() => {
                        latestRef.set({
                            latest: next
                        })
                    })
                }
            }
        })
    })
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
    if (msg.text == '/start') {
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
        // Send feedback request message
        bot.sendMessage(msg.from.id, feedbackRequestMessage);
        //TODO: force reply, save reply to firebase as feedback
    }
    else if (msg.text == "/livestream") {
        fetchLivestream(msg.from.id);
    }
    else if (msg.text.split(" ")[0] == "/updatels") {
        if(admin_ids.includes(msg.from.id)) {
            setLivestream(msg.text.split(" "), msg.from.id);
        }
        else {            
            bot.sendMessage(msg.from.id, "You do not have enough faith to run that command");
        }
    }
    else {
        bot.sendMessage(msg.from.id, stuffPsMavisSays[Math.floor(Math.random() * stuffPsMavisSays.length)]);
    }
});

startScheduler();
