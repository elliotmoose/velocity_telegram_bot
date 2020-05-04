// Storage imports
const UserStorage = require('./UserStorage');
const VerseStorage = require('./VerseStorage');
const TestimonyStorage = require('./TestimonyStorage');
const LivestreamStorage = require('./LivestreamStorage');
const FeedbackStorage = require('./FeedbackStorage');

module.exports = (database) => {
    return {
        userStorage: UserStorage(database),
        // verseStorage: VerseStorage(database),
        // testimonyStorage: TestimonyStorage(database),
        // livestreamStorage: LivestreamStorage(database),
        // feedbackStorage: FeedbackStorage(database)
    }
}