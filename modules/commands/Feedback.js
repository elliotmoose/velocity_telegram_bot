const Messages = require('../Messages');
const UserStateIDs = require('../UserStateIDs');
const MODULE_ID = 'FEEDBACK';

const handleFeedback = (message, storage, broadcaster, userStateManager, userState=undefined) => {
    let from_id = message.from.id;
    let from_name = message.from.first_name;
    let message_content = message.text;

    if (!userState) {
        broadcaster.sendMessage(from_id, Messages.feedbackRequestMessage);
        userStateManager.setStateForUserID(from_id, UserStateIDs.FEEDBACK_AWAITING, MODULE_ID, message_content);     
        return;
    } 

    switch (userState.stateID) {            
        case UserStateIDs.FEEDBACK_AWAITING:
            
            if(message_content == 'Cancel') {
                broadcaster.sendMessage(from_id, Messages.cancellationMessage);
                userStateManager.clearStateForUserID(from_id); //finished    
                return;
            }

            //update storage
            let feedbackStorage = storage.feedbackStorage;
            feedbackStorage.addFeedback(from_id, from_name, message_content)

            broadcaster.sendMessage(from_id, Messages.feedbackReceivedMessage);
            userStateManager.clearStateForUserID(from_id); //finished
            break;
    
        default:
            console.warn("Routed message for user with state to wrong handler (bug). Please look at /commands/index.js");
            break;
    }
}

module.exports = handleFeedback;