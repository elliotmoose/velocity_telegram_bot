const DateHelper = require('../DateHelper.js');

let latestVerses = null;

module.exports = (database) => {
    return {
        async getLatestVerses() {
            if (latestVerses != null) {
                return latestVerses;
            } else {
                return await database.getDocument("verses", "latest").verses;
            }
        },

        async getDailyVerses() {
            date = DateHelper.DateString(new Date());
            return await database.getDocument("verses", date).verses;
        },

        async updateLatestVerses(verses) {
            date = DateHelper.DateString(new Date());
            latestVerses = verses;
            await database.setDocument("verses", "latest", { verses: verses })
            await database.setDocument("verses", date, { verses: verses, sent: true })
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
