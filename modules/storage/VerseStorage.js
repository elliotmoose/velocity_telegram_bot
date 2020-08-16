// Abstraction that provides verse-related operations to the database

const DateHelper = require('../DateHelper.js');

let latestVerses = null;

module.exports = (database) => {
    return {
        async getLatestVerses() {
            if (latestVerses) {
                return latestVerses;
            } else {
                await this.pullLatestVersesToCache();       
                return latestVerses;
            }
        },

        // Gets the verses to send for the day, and returns null if there is no pending message
        async getUnsentDailyVerses() {
            let date = DateHelper.DateString(new Date());
            let verseDataBucket = await database.getDocument("verses", date);
            if (verseDataBucket) {
                // Check if sent already
                if (!verseDataBucket.sent && new Date().getHours() >= 7) {
                    return verseDataBucket.verses;
                }
            }
            return [];
        },

        async updateSentFlagAndLatestVerses(verses) {
            let date = DateHelper.DateString(new Date());
            latestVerses = verses;
            await database.setDocument("verses", "latest", { verses: verses })
            await database.setDocument("verses", date, { verses: verses, sent: true })
        },

        async pullLatestVersesToCache() {
            let latestDoc = await database.getDocument("verses", "latest");
            let verses = latestDoc.verses;
            if(!verses) {
                console.log('VerseStorage: No latest verses to load for cache');
                return;
            }

            latestVerses = Array.from(verses);
        }
    }
}