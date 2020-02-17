const config = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Keyboard = require('node-telegram-keyboard-wrapper');
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
let expectingAnnouncement = {}
const stuffPsMavisSays = ["Amen amen", "That's right", "Come on", "So good", "Wassup people"];
const feedbackRequestMessage = "What other things would you like me to able to do in future? Send me some feedback in your next message! Your feedback will remain anonymous. To cancel this operation, send 'Cancel'.";
const feedbackReceivedMessage = "Thank you for your suggestion!"
const testimonyRequestMessage = "Let's lift up the name of Jesus!! What would you like to thank him for? Your testimony will be reviewed by an admin before it will be broadcast to all subscribers! To cancel this operation, type 'Cancel'.";
const testimonyReceivedMessage = "Amen amen!! Thank you for sharing that with us!"
const cancellationMessage = "SHORE!"

const manageHomeMessage = "What would you like to manage?";
const annuoncementRequestMessage = "Send me the announcement you want to broadcast.";
const shoutHisNameViewTestimonyMessage = "Select a testimony to view.";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
let admin_ids = [536191264/*elliot*/, 123309697/*joel*/];
const ELLIOT_ID = 536191264;
const JOEL_ID = 123309697;

const [MANAGE_HOME_KEY, ANNOUNCEMENTS_KEY, SHOUT_HIS_NAME_KEY, VIEW_TESTIMONY_KEY, APPROVE_TESTIMONY_KEY, REJECT_TESTIMONY_KEY] = ['MANAGE_HOME_KEY', 'ANNOUNCEMENTS_KEY','SHOUT_HIS_NAME_KEY',  'VIEW_TESTIMONY_KEY', 'APPROVE_TESTIMONY_KEY', 'REJECT_TESTIMONY_KEY'];

let manageKeyboard = new Keyboard.InlineKeyboard();
manageKeyboard.addRow({text: 'Make an Announcement', callback_data: ANNOUNCEMENTS_KEY}).addRow({text: 'Shout His Name', callback_data: SHOUT_HIS_NAME_KEY});


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

const getVerseReferences = async () => {
    let snapshot = await firestore.collection("verses").get();        
    let verses = [];
    snapshot.forEach((verse)=> {
        verses.push(verse);
    })    

    return verses;
}

const getTestimony = async (id) => {
    let docRef = await firestore.collection("shouthisname").doc(id).get();        
    return docRef.data();
}
const getTestimonyReferences = async () => {
    let snapshot = await firestore.collection("shouthisname").get();        
    let testimonies = [];
    snapshot.forEach((testimony)=> {
        testimonies.push(testimony);
    })    

    return testimonies;
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
        let verses = await getVerseReferences();
    
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

const extractIDFromCallbackData = (data, type) => {
    return data.replace(type, "");
}

const extractTypeFromCallbackData = (data) => {
    let messageTypes = [VIEW_TESTIMONY_KEY, APPROVE_TESTIMONY_KEY, REJECT_TESTIMONY_KEY];
    for(let type of messageTypes) {
        if(data.indexOf(type) != -1) {
            return type;
        }
    }

    return null;
}

const editInlineKeyboard = (query, newMessage, newKeyboard) => {
    bot.editMessageText(newMessage, {
        chat_id: query.from.id,
        message_id: query.message.message_id,
        reply_markup: newKeyboard
    });
}

// New User
bot.on('message', async (msg) => {
    if (expectingFeedback[`${msg.from.id}`] == 1) {
        if (msg.text == 'Cancel') {
            expectingFeedback[`${msg.from.id}`] = 0;
            bot.sendMessage(msg.from.id, cancellationMessage);
        } else {
            let name = msg.from.first_name;
            let user_id = msg.from.id;
                firestore.collection('feedback').doc().set({
                name,
                user_id,
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
            //keep track of last latest
            let latestRef = firestore.collection("shouthisname").doc("latest");
            await latestRef.get()
            .then((doc) => {
                let next = doc.data().entry + 1;
                let name = msg.from.first_name;
                let user_id = msg.from.id;                
                firestore.collection("shouthisname").doc(`${next}`).set({
                    approved: false,
                    name,
                    user_id,
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
    else if (expectingAnnouncement[`${msg.from.id}`] == 1) {
        if (msg.text == 'Cancel') {
            expectingAnnouncement[`${msg.from.id}`] = 0;
            bot.sendMessage(msg.from.id, cancellationMessage);
        }
        else {
            //announcement
            console.log(`TODO: make announcement ${msg.text}`);
            bot.sendMessage(msg.from.id, "announcement received.");
            expectingTestimony[`${msg.from.id}`] = 0;
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
    else if (msg.text == '/manage') {        
        if(admin_ids.indexOf(msg.from.id) != -1) {
            bot.sendMessage(msg.from.id, manageHomeMessage, manageKeyboard.build());
        }
        else {            
            bot.sendMessage(msg.from.id, "You do not have enough faith to run that command");
        }
    }
    else {
        bot.sendMessage(msg.from.id, stuffPsMavisSays[Math.floor(Math.random() * stuffPsMavisSays.length)]);
    }
});

bot.on("callback_query", async (query) => {
    switch (query.data) {
        case MANAGE_HOME_KEY: 
            editInlineKeyboard(query, manageHomeMessage, manageKeyboard.extract());
            break;
        case ANNOUNCEMENTS_KEY:
            expectingAnnouncement[`${query.from.id}`] = 1;
            // bot.sendMessage(query.from.id, annuoncementRequestMessage);                      
            let announcementKeyboard = new Keyboard.InlineKeyboard();
            announcementKeyboard.addRow({ text: 'Cancel', callback_data: MANAGE_HOME_KEY });
            editInlineKeyboard(query, annuoncementRequestMessage, announcementKeyboard.extract());
            break;
        case SHOUT_HIS_NAME_KEY:
            let shnKeyboard = new Keyboard.InlineKeyboard();
            
            //1. get testimonies
            let testimonyReferences = await getTestimonyReferences();

            //2. build testimony keyboard
            testimonyReferences.forEach((testimonyRef)=>{
                let testimony = testimonyRef.data();
                if(!testimony.name || !testimony.user_id) {
                    return;
                }

                let option = {
                    text: testimony.name,
                    callback_data: VIEW_TESTIMONY_KEY + testimonyRef.id
                };

                shnKeyboard.addRow(option);
            });
            
            shnKeyboard.addRow({
                text: 'Back <<<',
                callback_data: MANAGE_HOME_KEY
            });
            editInlineKeyboard(query, shoutHisNameViewTestimonyMessage, shnKeyboard.extract());
            break;    
        default:
            
            let keyType = extractTypeFromCallbackData(query.data); 
            if(keyType) {
                switch (keyType) {
                    case VIEW_TESTIMONY_KEY:
                        {
                            //get testimony and send back
                            let testimony_id = extractIDFromCallbackData(query.data, VIEW_TESTIMONY_KEY);
                            let testimony = await getTestimony(testimony_id);

                            if (testimony) {
                                let approvalKeyboard = new Keyboard.InlineKeyboard();
                                approvalKeyboard.addRow({ text: 'Approve', callback_data: APPROVE_TESTIMONY_KEY + testimony_id });
                                approvalKeyboard.addRow({ text: 'Reject', callback_data: REJECT_TESTIMONY_KEY + testimony_id });
                                approvalKeyboard.addRow({ text: 'Back <<<', callback_data: SHOUT_HIS_NAME_KEY });
                                let message = `${testimony.message}\n\n from: ${testimony.name}`;
                                editInlineKeyboard(query, message, approvalKeyboard.extract());
                            }
                            else {
                                bot.sendMessage(query.from.id, `That testimony with id ${testimony_id} no longer exists`);
                            }
                            
                            break;
                        }
                    case APPROVE_TESTIMONY_KEY:
                        {
                            let testimony_id = extractIDFromCallbackData(query.data, APPROVE_TESTIMONY_KEY);
                            let approvedKeyboard = new Keyboard.InlineKeyboard();
                            approvedKeyboard.addRow({ text: 'Back to Testimonies', callback_data: SHOUT_HIS_NAME_KEY });
                            console.log(`Approve testimony with id: ${testimony_id}`);
                            let message = "Testimony Approved!"
                            editInlineKeyboard(query, message, approvedKeyboard.extract());
                            break;
                        }
                    case REJECT_TESTIMONY_KEY:
                        {
                            let testimony_id = extractIDFromCallbackData(query.data, REJECT_TESTIMONY_KEY);
                            console.log(`Rejected testimony with id: ${testimony_id}`);
                            let rejectedKeyboard = new Keyboard.InlineKeyboard();
                            rejectedKeyboard.addRow({ text: 'Back to Testimonies', callback_data: SHOUT_HIS_NAME_KEY });
                            let message = "Testimony Rejected!"
                            editInlineKeyboard(query, message, rejectedKeyboard.extract());
                            break;
                        }
                    default:
                        break;
                }
            }
            else {
                bot.sendMessage(query.from.id, "Sorry, I don't understand that action :( ");
            }

            break;
    }
});

startScheduler();