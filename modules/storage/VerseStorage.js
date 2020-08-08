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

        /**
         * Gets the verses to send for the day, and returns null if there is no pending message
         */
        async getUnsentDailyVerses() {
            let date = DateHelper.DateString(new Date());
            let verseDataBucket = await database.getDocument("verses", date);            
            if (verseDataBucket) {
                // check if sent already
                if (!verseDataBucket.sent) {
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
            let verses = await database.getDocument("verses", "latest").verses;
            if(!verses)
            {
                console.log('VerseStorage: No latest verses to load for cache');
            }
            latestVerses = verses;
        }
    }
}

let templateVerse = "For God so loved the world.."
let templateVerseDoc = {
    verses: [ templateVerse, templateVerse, templateVerse ],
    sent: false
}
let templateLatestDoc = {
    verses: [ templateVerse, templateVerse, templateVerse ]
}
