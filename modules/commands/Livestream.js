const Messages = require('../Messages');

module.exports = async (message, storage, broadcaster) => {    
    
    const id = message.from.id;

    // let latest_sent_doc = await firestore.collection('sent').doc('latest').get();
    let link = await storage.livestreamStorage.getLivestreamLink();
    broadcaster.sendMessage(id, Messages.livestreamMessage + link);

    console.log(id + " requested /livestream, resolved\n");
}