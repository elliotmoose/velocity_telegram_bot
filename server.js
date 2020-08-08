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
const makeBroadcaster = require('./modules/Broadcaster');
const makeCommands = require('./modules/commands/index');
const makeDatabase = require('./modules/Database');
const makeStorage = require('./modules/storage/index');
const makeUserStateManager = require('./modules/UserStateManager');
const makeScheduler = require('./modules/Scheduler');
const makeVerseManager = require('./modules/VerseManager');

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
const database = makeDatabase(firestore);
const storage = makeStorage(database); //model
const broadcaster = makeBroadcaster(bot);
const userStateManager = makeUserStateManager();
const verseManager = makeVerseManager(storage, broadcaster);
const commands = makeCommands(storage, broadcaster, userStateManager, verseManager);
const scheduler = makeScheduler();

bot.on('message', async (message) => {        
    commands.routeMessage(message);
});

console.log('\n');
console.log('\t==============================================');
console.log('\t====   P.A.V.I.S  I N I T I A L I Z E D   ====');
console.log('\t==============================================');
console.log('\n');

console.log(`\t====   Started Scheduler with Time: ${scheduler.interval/1000}s   ====`);
console.log('\n');
console.log('\n');
scheduler.startClock(verseManager.checkSendVerse);
verseManager.checkSendVerse();
