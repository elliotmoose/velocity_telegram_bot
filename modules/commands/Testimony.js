const Messages = require('../Messages');
const UserStateIDs = require('../UserStateIDs');
const MODULE_ID = 'TESTIMONY';

const handleTestimony = (message, storage, broadcaster, userStateManager, userState=undefined) => {
    let from_id = message.from.id;
    let from_name = message.from.first_name;
    let message_content = message.text;

    if (!userState) {
        broadcaster.sendMessage(from_id, Messages.testimonyRequestMessage);
        userStateManager.setStateForUserID(from_id, UserStateIDs.TESTIMONY_AWAITING, MODULE_ID, message_content);     
        return;
    } 

    switch (userState.stateID) {            
        case UserStateIDs.TESTIMONY_AWAITING:
            
            if(message_content == 'Cancel') {
                broadcaster.sendMessage(from_id, Messages.cancellationMessage);
                userStateManager.clearStateForUserID(from_id); //finished    
                return;
            }

            //update storage
            let testimonyStorage = storage.testimonyStorage;
            testimonyStorage.addTestimony(from_id, from_name, message_content);
            broadcaster.sendMessage(from_id, Messages.testimonyReceivedMessage);
            userStateManager.clearStateForUserID(from_id); //finished
            break;
    
        default:
            console.warn("Routed message for user with state to wrong handler (bug). Please look at /commands/index.js");
            break;
    }
}

module.exports = handleTestimony;