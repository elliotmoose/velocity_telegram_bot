// Class to manage verses. Checks if verses have been sent and uses broadcaster to send them.
// Also converts verse references to verses using the ESV API.

const fetch = require('node-fetch');
const Messages = require("./Messages");

const esvToken = process.env.ESV_TOKEN;

const makeVerseManager = (storage, broadcaster) => {
    let verseManager = {
        async checkSendVerse() {
            console.log("VerseManager: Checking verses to send now...");
            let verseStorage = storage.verseStorage;
            // Gets verses to send
            let verseRefsToSend = await storage.verseStorage.getUnsentDailyVerses();
            // Check if theres verses to send
            if (verseRefsToSend.length != 0) {
                console.log("VerseManager: Found verses to send!");
                // Convert verse ref to verse content
                let verses = [];
                for (let verseRef of verseRefsToSend) {
                    let verse = await verseManager.getVerseFromVerseRef(verseRef);
                    verses.push(verse);
                }

                // Get all user ids
                let allUsers = storage.userStorage.getAllUsers();

                // Send message
                verses.forEach((verseContent, index)=> {
                    // Go through each user
                    Object.keys(allUsers).forEach(async (userId)=> {
                        let user = allUsers[userId];

                        // If first message, send header message
                        let header = (index == 0) ? Messages.getDailyVerseHeader(user.name) : "";
                        
                        // Send
                        if (user.isSubscribed) {
                            await broadcaster.sendMessage(userId, header + verseContent);
                        }
                    })
                });
                // Update latest
                await verseStorage.updateSentFlagAndLatestVerses(verseRefsToSend);                        
            }
            else {
                console.log("VerseManager: No verses to send!");
            }
        },

        async getVerseFromVerseRef(verseRef) {            
            let headerString = 'Token ' + esvToken;
            let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verseRef + '&include-footnotes=false', {
                    method: 'GET',
                    headers: { 'Authorization': headerString },
                })
            let json = await response.json();
            return json.passages[0];
        }
    }

    return verseManager;
}


module.exports = makeVerseManager;