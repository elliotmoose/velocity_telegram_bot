const Messages = require('../Messages');
const UserStateIDs = require('../UserStateIDs');
const MODULE_ID = 'FEEDBACK';

module.exports = (message, storage, broadcaster, userStateManager, userState=undefined) => {
    switch (userState) {
        case undefined:             
            broadcaster.sendMessage(message.from.id, Messages.feedbackRequestMessage);
            userStateManager.setStateForUserID(message.from.id, UserStateIDs.FEEDBACK_AWAITING, MODULE_ID, message);
            break;
            
        case UserStateIDs.FEEDBACK_AWAITING:
            broadcaster.sendMessage(message.from.id, Messages.feedbackReceivedMessage);
            userStateManager.clearStateForUserID(message.from.id); //finished
            break;
    
        default:
            console.warn("Routed message for user with state to wrong handler (bug). Please look at Commands.js");
            break;
    }
}