// Storage imports
const UserStorage = require('./modules/storage/UserStorage');
const VerseStorage = require('./modules/storage/VerseStorage');
const TestimonyStorage = require('./modules/storage/TestimonyStorage');
const LivestreamStorage = require('./modules/storage/LivestreamStorage');
const FeedbackStorage = require('./modules/storage/FeedbackStorage');

module.exports = (database) => {
    return {
        userStorage: UserStorage(database),
        verseStorage: VerseStorage(database),
        testimonyStorage: TestimonyStorage(database),
        livestreamStorage: LivestreamStorage(database),
        feedbackStorage: FeedbackStorage(database)
    }
}