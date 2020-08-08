const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster, verseManager) => {    
    
    const id = message.from.id;

    let latestVerseRefs = await storage.verseStorage.getLatestVerses();

    if(latestVerseRefs)
    {
        for(let verseRef of latestVerseRefs) {
            let verseString = await verseManager.getVerseFromVerseRef(verseRef);
            broadcaster.sendMessage(id, Messages.latestHeader + verseString);
        }
    }
    else 
    {
        console.log('Latest: No latest verse');
    }

    console.log(id + " requested /latest, resolved\n");
}