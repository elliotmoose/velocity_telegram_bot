const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster, verseManager) => {    
    
    const id = message.from.id;

    // let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
    let latestVerseRefs = await storage.verseStorage.getLatestVerses();
    
    for(let verseRef of latestVerseRefs) {
        let verseString = await verseManager.getVerseFromVerseRef(verseRef);
        broadcaster.sendMessage(id, Messages.latestHeader + verseString);
    }

    console.log(id + " requested /latest, resolved\n");
}