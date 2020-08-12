// Object that contains all storage abstraction instances

// Storage imports
const UserStorage = require('./UserStorage');
const VerseStorage = require('./VerseStorage');
const TestimonyStorage = require('./TestimonyStorage');
const LivestreamStorage = require('./LivestreamStorage');
const FeedbackStorage = require('./FeedbackStorage');

module.exports = (database) => {
    let userStorage = UserStorage(database);
    userStorage.pullUsersToCache();
    
    let testimonyStorage = TestimonyStorage(database);

    let feedbackStorage = FeedbackStorage(database);

    let verseStorage = VerseStorage(database);
    verseStorage.pullLatestVersesToCache();

    let livestreamStorage = LivestreamStorage(database);
    livestreamStorage.pullLatestLivestreamLinkToCache();

    return {
        userStorage,
        verseStorage,
        testimonyStorage,
        livestreamStorage,
        feedbackStorage
    }
}