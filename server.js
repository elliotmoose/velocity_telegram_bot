////////////////////////////////////////////////////////////////////////////
//                                                                        //
//                              Config & Setup                            //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

// Flag to determine staging or release bot
// !!!CAUTION!!!: DO NOT SET TO TRUE EXCEPT FOR DEPLOYMENT
const isRelease = false

// Library imports
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const firebase = require('firebase-admin');

// Module imports
const makeBroadcaster = require('./modules/Broadcaster');
const makeCommands = require('./modules/commands/index');
const makeDatabase = require('./modules/Database');
const makeStorage = require('./modules/storage/index');
const makeUserStateManager = require('./modules/UserStateManager');
const makeScheduler = require('./modules/Scheduler');
const makeVerseManager = require('./modules/VerseManager');

// Initialise apps
const bot = isRelease ? new TelegramBot(process.env.RELEASE_TELEGRAM_TOKEN, {polling: true}) : new TelegramBot(process.env.STAGING_TELEGRAM_TOKEN, {polling: true});
firebase.initializeApp({ credential: firebase.credential.cert(JSON.parse(process.env.FIREBASE_KEY)), databaseURL: process.env.FIREBASE_URL });
const firestore = firebase.firestore();

// Initialise Modules
const database = makeDatabase(firestore);
const storage = makeStorage(database);
const broadcaster = makeBroadcaster(bot);
const userStateManager = makeUserStateManager();
const verseManager = makeVerseManager(storage, broadcaster);
const commands = makeCommands(storage, broadcaster, userStateManager, verseManager);
const scheduler = makeScheduler();

bot.on('message', async (message) => {    
    commands.routeMessage(message);
});

bot.on("callback_query", async (query) => {
    commands.routeInlineResponse(query);
});

bot_name = isRelease ? 'M.A.V.I.S.' : 'P.A.V.I.S.'

console.log('\n');
console.log('\t==============================================');
console.log(`\t====  ${bot_name}   I N I T I A L I Z E D  ====`);
console.log('\t==============================================');
console.log('\n');

console.log(`\t====   Started Scheduler with Time: ${scheduler.interval/1000}s   ====`);
console.log('\n');
console.log('\n');
scheduler.startClock(verseManager.checkSendVerse);
verseManager.checkSendVerse();
