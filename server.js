////////////////////////////////////////////////////////////////////////////
//                                                                        //
//                              Config & Setup                            //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

// Tokens
const esvToken = process.env.ESV_TOKEN;

// Library imports
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const firebase = require('firebase-admin');
const Keyboard = require('node-telegram-keyboard-wrapper');
const fetch = require('node-fetch');

// Module imports
const Broadcaster = require('./modules/Broadcaster');
const Commands = require('./modules/commands/Commands');
const Database = require('./modules/Database');
const Storage = require('./modules/storage/Storage');
const UserStateManager = require('./modules/UserStateManager');

// Testing
const ELLIOT_ID = process.env.ELLIOT_ID;
const JOEL_ID = process.env.JOEL_ID;
const ADRIEL_ID = process.env.ADRIEL_ID;
const admin_ids = [ELLIOT_ID, JOEL_ID, ADRIEL_ID];

// Initialise apps
const bot = new TelegramBot(process.env.STAGING_TELEGRAM_TOKEN, {polling: true});
firebase.initializeApp({ credential: firebase.credential.cert(JSON.parse(process.env.FIREBASE_KEY)), databaseURL: process.env.FIREBASE_URL });
const firestore = firebase.firestore();

// Initialise Modules
const broadcaster = Broadcaster(bot);
const storage = Storage(Database(firestore));
const userStateManager = UserStateManager();
const commands = Commands(storage, broadcaster, userStateManager);

bot.on('message', async (message) => {        
    commands.routeMessage(message);
});

// // initialize expecting objects
// // expecting feedback/testimony/announcement are used like boolean dictionaries, with the chat_id being the key, and a boolean being the element
// let expectingFeedback = {}
// let expectingTestimony = {}
// let expectingAnnouncement = {}

// // expecting scheduled maps the id to a string with the following very exact requirements:
// // 0: Stage (1 - waiting for date, 2 - waiting for time, 3 - waiting for announcement)
// // 1: Space
// // 2-7: DDMMYY of scheduled announcement eg 251220 is Christmas 2020
// // 8: Space
// // 9-12: HHMM of scheduled announcement (24 hrs) eg 2359
// let expectingScheduled = {}

// default messages moved to Messages.js

// // inline keyboard keys
// // IMPT NOTE: keys can only be one char long. the rest of the callback data string is used for other data
// // access the key with query.data[0];    -- takes the 1st char
// // access the data with query.slice(1);  -- slices the rest of the string
// const [MANAGE_HOME_KEY, ANNOUNCEMENTS_KEY, SHOUT_HIS_NAME_KEY, VIEW_TESTIMONY_KEY, APPROVE_TESTIMONY_KEY, REJECT_TESTIMONY_KEY, NOW_ANNOUNCMENTS_KEY, SCHEDULED_ANNOUNCEMENTS_KEY] = ['0', '1','2', '3', '4', '5', '6', '7'];



// ////////////////////////////////////////////////////////////////////////////
// //                                                                        //
// //                             Helper Functions                           //
// //                                                                        //
// ////////////////////////////////////////////////////////////////////////////

// // general telegram side functions
// const getUsers = async () => {    
//     let snapshot = await firestore.collection("subscriptions").get();        
//     let users = [];
//     snapshot.forEach((user)=> {
//         users.push(user.data());
//     })    

//     return users;
// }

// const generateScheduleMessage = (date, time) => {
// 	return `Finally, send the announcement you want to schedule.\nDate: ${date}\nTime:${time}\n(Only text works)\n(/back to change time)`
// }

// const getDate = (data) => {
// 	// 0: Stage (1 - waiting for date, 2 - waiting for time, 3 - waiting for announcement)
// 	// 1: Space
// 	// 2-7: DDMMYY of scheduled announcement eg 251220 is Christmas 2020
// 	// 8: Space
// 	// 9-12: HHMM of scheduled announcement (24 hrs) eg 2359

// 	let dateString = '20' + data.slice(6, 8) + '-' + data.slice(4,6) + '-' + data.slice(2,4) + 'T' + data.slice(9,11) + ':' + data.slice(11) + ':00';
// 	return new Date(dateString);
// }

// // verse and /latest
// const fetchAndSendVerse = async (verseString, users) => {
//     let headerString = 'Token ' + esvToken;
//     let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseString + '&include-footnotes=false', {
//         method: 'GET',
//         headers: { 'Authorization': headerString },
//     })
//     let json = await response.json();
//     for(let user of users) {
//         let passage = json.passages[0];
//         let name = user.name;
//         let message = `Good morning ${name}! Here's the passage for today:\n\n` + passage;
//         bot.sendMessage(user.chat_id, message);
//     }    
// }

// const fetchAndSendLatest = async (verseString, id) => {
//     let headerString = 'Token ' + esvToken;
//     let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseString + '&include-footnotes=false', {
//         method: 'GET',
//         headers: { 'Authorization': headerString },
//     })
//     let json = await response.json();
//     let passage = json.passages[0];
//     let message = `Here's the latest passage:\n\n` + passage;
//     bot.sendMessage(id, message);    
// }  

// const getVerseReferences = async () => {
//     let snapshot = await firestore.collection("verses").get();        
//     let verses = [];
//     snapshot.forEach((verse)=> {
//         verses.push(verse);
//     })    

//     return verses;
// }

// // /shouthisname
// const getTestimony = async (id) => {
//     let docRef = await firestore.collection("shouthisname").doc(id).get();        
//     return docRef.data();
// }

// const getTestimonyReferences = async () => {
//     let snapshot = await firestore.collection("shouthisname").get();        
//     let testimonies = [];
//     snapshot.forEach((testimony)=> {
//         testimonies.push(testimony);
//     })    

//     return testimonies;
// }

// const getShoutHisName = async () => {
// // TODO: check sent
// //     let latestRef = firestore.collection("shouthisname").doc("latest");
// //     await latestRef.get()
// //     .then((doc) => {
// //         let next = doc.data().latest + 1;
// //         let nextRef = firestore.collection("shouthisname").doc(`${next}`)
// //         nextRef.get()
// //         .then((doc) => {
// //             if (doc.exists) {
// //                 let shouthisname = doc.data()
// //                 if (!shouthisname.sent && shouthisname.approved) {
// //                     // Send to all users
// //                     bot.sendMessage(JOEL_ID, shouthisname.message)
// //                     .then(() => {
// //                         nextRef.set({
// //                             approved: true,
// //                             message: shouthisname.message,
// //                             sent: true
// //                         })
// //                         .then(() => {
// //                             latestRef.set({
// //                                 latest: next
// //                             })
// //                         })
// //                     })
// //                 }
// //             }
// //         })
// //     })
// }

// // /announcements
// const sendOutAnnouncement = async (msg) => {
//  	// TODO: switch from admin to all

//  	for(let id of admin_ids) {
//         if(msg.text != null) {
//         	bot.sendMessage(id, msg.text);
//         }
//         else if (msg.photo != null) {
//         	bot.sendPhoto(id, msg.photo[0].file_id);
//         }
//         else if (msg.video != null) {
//         	bot.sendVideo(id, msg.video.file_id, caption=msg.caption);
//         }
//     }
// }

// const saveAnnouncementToFirebase = async (text, dateInfo) => {
// 	if(text == null) {
// 		console.log("TODOO: backup image and video announcements too")
// 	}

// 	let biggestRef = firestore.collection("announcements").doc("biggestnumber");
//     await biggestRef.get()
//     .then((doc) => {
//         let next = doc.data().biggestnumber + 1;
//         biggestRef.set({
//         	biggestnumber: next
//         })

//         firestore.collection("announcements").doc(`${next}`).set({
//         	message: text,
//         	date: dateInfo,
//         	sent: true
//         })
//         return next;
//     })
// }

// const getAnnouncements = async () => {
//     let latestRef = firestore.collection("announcements").doc("latest");
//     await latestRef.get()
//     .then((doc) => {
//         let next = doc.data().latest + 1;
//         let nextRef = firestore.collection("announcements").doc(`${next}`)
//         nextRef.get()
//         .then(async (doc) => {
//             if (doc.exists) {
//                 let announcement = doc.data()
//                 if (!announcement.sent) {
//                     let users = await getUsers();

//                     // Send to all users
//                     for(let user of users) {
//                         bot.sendMessage(user.chat_id, announcement.message);
//                     }
                    
//                     nextRef.set({
//                         message: announcement.message,
//                         sent: true
//                     })
//                     .then(() => {
//                         latestRef.set({
//                             latest: next
//                         })
//                     })
//                 }
//             }
//         })
//     })
// }

// // livestream
// const fetchLivestream = async (id) => {
//     await firestore.collection("announcements").doc("livestream").get().then((doc) => {
//         let link = doc.data().link;
//         bot.sendMessage(id, livestreamMessage + link);
//     });
// }

// const setLivestream = async (newlink, id) => {
//     let toBroadcast = false;
//     let toUpdate = true;

//     if (newlink.slice(0,2) == "-d") {
//         newlink = "not ready yet 😔"
//     }
//     else if (newlink.slice(0,2) == "-u") {
//         newlink = newlink.slice(3)
//         toBroadcast = true;
//     }
//     else if (newlink.slice(0,2) == "-c") {
//         toUpdate = false;
//         toBroadcast = true;

//         await firestore.collection("announcements").doc("livestream").get().then((doc) => {
//             newlink = doc.data().link;
//         });
//     }

//     if (toUpdate) {
//         await firestore.collection("announcements").doc("livestream").set({
//             link: newlink
//         });
//     }

//     if (toBroadcast) {
//         /*let users = await getUsers();
//         for(let user of users) {
//             bot.sendMessage(user.chat_id, livestreamMessage + newlink);
//         }*/
//         for (let id of admin_ids) {
//             bot.sendMessage(id, livestreamMessage + newlink);
//         }
//     }
//     else {
//         bot.sendMessage(id, "Updated: " + livestreamMessage + newlink);
//     }      
// }



// ////////////////////////////////////////////////////////////////////////////
// //                                                                        //
// //                             Inline Keyboards                           //
// //                                                                        //
// ////////////////////////////////////////////////////////////////////////////

// let manageKeyboard = new Keyboard.InlineKeyboard();
// manageKeyboard.addRow({text: 'Make an Announcement', callback_data: ANNOUNCEMENTS_KEY})
// 			.addRow({text: 'Shout His Name', callback_data: SHOUT_HIS_NAME_KEY});

// const editInlineKeyboard = (query, newMessage, newKeyboard) => {
//     bot.editMessageText(newMessage, {
//         chat_id: query.from.id,
//         message_id: query.message.message_id,
//         reply_markup: newKeyboard
//     });
// }



// ////////////////////////////////////////////////////////////////////////////
// //                                                                        //
// //                                Schedulers                              //
// //                                                                        //
// ////////////////////////////////////////////////////////////////////////////

// const startScheduler = async () => {
//     await checkShouldSendVerse();
//     setInterval(async () => {
//         await checkShouldSendVerse();
//     }, 30*60*1000); //check every half hour
// }

// const checkShouldSendVerse = async () => {    
//     try {
//         let verses = await getVerseReferences();
    
//         for (let verseObj of verses) {
//             let verse = verseObj.data();
//             let timeToSend = verse.date.toDate();                    
//             let is_past = new Date() > timeToSend;
//             if(!verse.sent && is_past) {
//                 let users = await getUsers();
                
//                 // Send verse
//                 await fetchAndSendVerse(verse.verse, users);
    
//                 // Update verse sent
//                 let verseDocRef = firestore.collection("verses").doc(verseObj.id);
//                 await verseDocRef.set({
//                     date: verse.date,
//                     sent: true,
//                     verse: verse.verse
//                 })
    
//                 // Update latest verse sent
//                 firestore.collection("sent").doc("latest").set({
//                     id: verseObj.id
//                 })                            
//             }
//         }

//         getAnnouncements()
//         getShoutHisName()
        
//     } catch (error) {
//         console.log(error);
//     }   
// }

// const scheduleAnnouncement = async(id, msgtext, timeToSend, fromId) => {
// 	let now = new Date();

// 	if (now > timeToSend) {
// 		// Someone tried to schedule something in the past
// 		bot.sendMessage(fromId, "Nice try. Please schedule something in the future. Or use immediate announcements to post them right now.");
// 		return;
// 	}
// 	else {
// 		bot.sendMessage(fromId, "Your announcement has been successfully scheduled.")
// 	}

// 	setTimeout(async() => {
//     	return sendScheduledAnnouncement(id, msgtext);}, timeToSend - now);
// }

// const sendScheduledAnnouncement = async(id, msgtext) => {
// 	// TODO: switch from admin to all
// 	// TODO: add support for images and videos	

//  	for(let user_id of admin_ids) {
//         bot.sendMessage(user_id, msgtext);
//     }
// }



////////////////////////////////////////////////////////////////////////////
//                                                                        //
//                         Telegram Message Parsing                       //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

// bot.on('message', async (message) => {        
//     commands.routeMessage(message);    

    // if (commands.isStartCommand(text)) {
    //     routeCommand()
    //     routeCommand()
    //     commandStart.run(bot, firestore, name, id);
    // }

//     if (expectingFeedback[`${msg.from.id}`]) {
//         if (msg.text == 'Cancel') {
//             expectingFeedback[`${msg.from.id}`] = false;
//             bot.sendMessage(msg.from.id, cancellationMessage);
//         } else {
//             let name = msg.from.first_name;
//             let user_id = msg.from.id;
//                 firestore.collection('feedback').doc().set({
//                 name,
//                 user_id,
//                 message: msg.text
//             });
//             expectingFeedback[`${msg.from.id}`] = false;
//             bot.sendMessage(msg.from.id, feedbackReceivedMessage);
//         }
//     }
//     else if (expectingTestimony[`${msg.from.id}`]) {
//         if (msg.text == 'Cancel') {
//             expectingTestimony[`${msg.from.id}`] = false;
//             bot.sendMessage(msg.from.id, cancellationMessage);
//         } else {
//             //keep track of last latest
//             let latestRef = firestore.collection("shouthisname").doc("latest");
//             await latestRef.get()
//             .then((doc) => {
//                 let next = doc.data().entry + 1;
//                 let name = msg.from.first_name;
//                 let user_id = msg.from.id;                
//                 firestore.collection("shouthisname").doc(`${next}`).set({
//                     approved: false,
//                     name,
//                     user_id,
//                     message: msg.text,
//                     sent: false
//                 });
//                 latestRef.set({
//                     entry: next,
//                     sent: doc.data().sent
//                 })
//             })
//             expectingTestimony[`${msg.from.id}`] = false;
//             bot.sendMessage(msg.from.id, testimonyReceivedMessage);
//         }
//     }
//     else if (expectingAnnouncement[`${msg.from.id}`]) {
//         if (msg.text == 'Cancel') {
//             expectingAnnouncement[`${msg.from.id}`] = false;
//             bot.sendMessage(msg.from.id, cancellationMessage);
//         }
//         else {
//             //announcement
//             expectingAnnouncement[`${msg.from.id}`] = false;
//             sendOutAnnouncement(msg);
//             bot.sendMessage(msg.from.id, "Your announcement has been sent!");

//             if (msg.text) {
//             	saveAnnouncementToFirebase(msg.text, null);
//             	bot.sendMessage(msg.from.id, "Your announcement has been saved to firebase.")
//         	}
//         }
//     }
//     else if (expectingScheduled[`${msg.from.id}`]) {
//     	// 0: Stage (1 - waiting for date, 2 - waiting for time, 3 - waiting for announcement)
// 		// 1: Space
// 		// 2-7: DDMMYY of scheduled announcement eg 251220 is Christmas 2020
// 		// 8: Space
// 		// 9-12: HHMM of scheduled announcement (24 hrs) eg 2359
// 		let stage = expectingScheduled[`${msg.from.id}`][0];
// 		switch (stage) {
// 			case "1":{
// 				// Data validation
// 				if (!msg.text) {
// 					bot.sendMessage(msg.from.id, "Please send text.");
// 					break;
// 				}
// 				let date = msg.text.trim();
// 				if (date.length != 6 || date.slice(0, 2) > 31 || date.slice(2, 4) > 12) {
// 					bot.sendMessage(msg.from.id, "Incorrect format! Please send DDMMYY.");
// 					break;
// 				}

// 				expectingScheduled[`${msg.from.id}`] = "2 " + date;
// 				bot.sendMessage(msg.from.id, scheduledTimeMessage);
// 				break;
// 			}
// 			case "2":{
// 				// Data validation
// 				if (!msg.text) {
// 					bot.sendMessage(msg.from.id, "Please send text.");
// 					break;
// 				}
// 				let time = msg.text.trim();

// 				// Go back to date stage
// 				if (time == "/back") {
// 					expectingScheduled[`${msg.from.id}`] = "1";
// 					bot.sendMessage(scheduledDateMessage);
// 				}
// 				// Data validation
// 				else if (time.length != 4 || time.slice(0, 2) > 23 || time.slice(2) > 59) {
// 					bot.sendMessage(msg.from.id, "Incorrect format! Please send HHMM.");
// 				}
// 				// move to text stage
// 				else {
// 					let date = expectingScheduled[`${msg.from.id}`].slice(2,8);
// 					expectingScheduled[`${msg.from.id}`] = "3 " + date + " " + time;
// 					bot.sendMessage(msg.from.id, generateScheduleMessage(date, time));
// 				}
// 				break;
// 			}
// 			case "3":{
// 				// Data validation
// 				if (!msg.text) {
// 					bot.sendMessage(msg.from.id, "Please send text.");
// 				}
// 				// Back to time stage
// 				else if (msg.text == "/back") {
// 					expectingScheduled[`${msg.from.id}`] = "2 " + expectingScheduled[`${msg.from.id}`].slice(2,8);
// 					bot.sendMessage(msg.from.id, scheduledTimeMessage);
// 				}
// 				else {
// 					// reset
// 					expectingScheduled[`${msg.from.id}`] = false;

// 					// save announcement to firebase
// 					let date = getDate(expectingScheduled[`${msg.from.id}`])
//             		let announcementId = await saveAnnouncementToFirebase(msg.text, date);
//             		bot.sendMessage(msg.from.id, "Your scheduled announcement has been saved to firebase.")

//             		scheduleAnnouncement(announcementId, msg.text, date, msg.from.id);
// 				}
// 				break;
// 			}
// 		}
//     }
//     else 

//     else if (msg.text == '/latest') {
//     else if (msg.text == '/latest') {
//     else if (msg.text == '/latest') {
//     else if (msg.text == '/latest') {
//     else if (msg.text == '/latest') {
//     else if (msg.text == '/latest') {
//     else if (msg.text == '/latest') {
//         // Send the latest passage
//         let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
//         const latest_verse_id = latest_sent_doc.data().id;
//         let verse = await firestore.collection('verses').doc(`${latest_verse_id}`).get();
//         let verseString = verse.data().verse;
//         await fetchAndSendLatest(verseString, msg.from.id);
//     }
//     else if (msg.text == '/feedback') {
//         // Send feedback request message, flag user as 
//         bot.sendMessage(msg.from.id, feedbackRequestMessage);
//         expectingFeedback[`${msg.from.id}`] = true;
//     }
//     else if (msg.text == '/shouthisname') {
//         // Send testimony request message
//         bot.sendMessage(msg.from.id, testimonyRequestMessage);
//         expectingTestimony[`${msg.from.id}`] = true;
//     }
//     else if (msg.text == '/manage') {        
//         if(admin_ids.indexOf(msg.from.id) != -1) {
//             bot.sendMessage(msg.from.id, manageHomeMessage, manageKeyboard.build());
//         }
//         else {            
//             bot.sendMessage(msg.from.id, "You do not have enough faith to run that command");
//         }
//     }
//     else if (msg.text == "/livestream") {
//         fetchLivestream(msg.from.id);
//     }
//     else if (msg.text != null && msg.text.length >= 9 && msg.text.slice(0, 9) == "/updatels") {
//         if(admin_ids.indexOf(msg.from.id) != -1) {
//             if (msg.text.length == 9) {
//                 bot.sendMessage(msg.from.id, "To use this, enter:\n/updatels [optional arg] link\n\nwhere [optional arg] has 3 options:\n'-d' to set to default of 'not ready yet 😔'\n'-u' to update link and broadcast new link to everyone\n'-c' to broadcast current link to everyone");
//             }
//             else {
//                 setLivestream(msg.text.slice(10), msg.from.id);
//             }
//         }
//         else {            
//             bot.sendMessage(msg.from.id, "You do not have enough faith to run that command");
//         }
//     }
    // else {
    //     bot.sendMessage(id, flavour.generateRandomQuote());
    // }
// });
// });
// });
// });
// });
// });
// });


