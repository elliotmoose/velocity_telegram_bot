const Messages = require('../Messages');
const UserStateIDs = require('../UserStateIDs');
const InlineKeys = require('../InlineKeys');
const Keyboard = require('node-telegram-keyboard-wrapper');
const { MANAGE_APPROVE_TESTIMONIES, MANAGE_REJECT_TESTIMONIES, MANAGE_VIEW_TESTIMONIES } = require('../InlineKeys');
const MODULE_ID = 'MANAGE';

const handleManageMessage = (message, storage, broadcaster, userStateManager, userState=undefined) => {
    let id = message.from.id;
    let name = message.from.first_name;
    let message_content = message.text;

    let userStorage = storage.userStorage;

    //check permissions
    if (!userStorage.isUserAdmin(id)) {
        broadcaster.sendMessage(id, Messages.adminRejectMessage);
        return;
    }

    if (!userState) {
        let homeKeyboard = new Keyboard.InlineKeyboard();
        homeKeyboard.addRow({text: 'Make an Announcement', callback_data: InlineKeys.MANAGE_MAKE_ANNOUNCEMENT});
        homeKeyboard.addRow({text: 'Shout His Name', callback_data: InlineKeys.MANAGE_VIEW_TESTIMONIES});
        homeKeyboard.addRow({text: 'Update Livestream Link', callback_data: InlineKeys.MANAGE_UPDATE_LIVESTREAM});
        broadcaster.sendKeyboard(id, Messages.manageHomeMessage, homeKeyboard);
        return;
    }

    switch (userState.stateID) {            
        case UserStateIDs.MANAGE_AWAITING_ANNOUNCEMENT: //this is where the user sends in the announcement
            userStateManager.setStateForUserID(id, UserStateIDs.MANAGE_CONFIRMING_ANNOUNCEMENT, MODULE_ID, message); //we store the message itself for photos/videos
            let confirmAnnouncementKeyboard = new Keyboard.InlineKeyboard();
            confirmAnnouncementKeyboard.addRow({text: 'Send Now', callback_data: InlineKeys.MANAGE_SEND_ANNOUNCEMENT});
            confirmAnnouncementKeyboard.addRow({text: 'Cancel', callback_data: InlineKeys.MANAGE_CANCEL_ANNOUNCEMENT});
            broadcaster.sendKeyboard(id, Messages.announcementConfirmMessage, confirmAnnouncementKeyboard);
            break;
        case UserStateIDs.MANAGE_AWAITING_LIVESTREAM:
            userStateManager.setStateForUserID(id, UserStateIDs.MANAGE_CONFIRMING_LIVESTREAM, MODULE_ID, message_content);
            let cfmLinkKeyboard = new Keyboard.InlineKeyboard();
            cfmLinkKeyboard.addRow({text: 'Confirm', callback_data: InlineKeys.MANAGE_CONFIRM_LIVESTREAM});
            cfmLinkKeyboard.addRow({text: 'Cancel', callback_data: InlineKeys.MANAGE_CANCEL_LIVESTREAM});
            broadcaster.sendKeyboard(id, Messages.getCheckLivestream(message_content), cfmLinkKeyboard);
            break;
        default:
            broadcaster.sendMessage(id, "whoop de doop");
            console.warn("Routed message for user with state to wrong handler (bug). Please look at /commands/index.js");
            break;
    }
}


const handleManageKeyboard = async (query, storage, broadcaster, userStateManager, userState=undefined) => {
    let from_id = query.from.id;
    let message_content = query.message.text;
    broadcaster.answerCallback(query.id);

    switch (query.data) {
        case InlineKeys.MANAGE_MAKE_ANNOUNCEMENT:
            // let userStorage = storage.userStorage;
            userStateManager.setStateForUserID(from_id, UserStateIDs.MANAGE_AWAITING_ANNOUNCEMENT, MODULE_ID, message_content);     
            broadcaster.replaceInlineKeyboard(query, Messages.announcementRequestMessage, undefined);
            break;
        case InlineKeys.MANAGE_SEND_ANNOUNCEMENT:
            // let userStorage = storage.userStorage;
            if(!userState) {
                broadcaster.sendMessage(from_id, Messages.announcementNotFound);
                userStateManager.clearStateForUserID(from_id);
                return;
            }

            let allUsers = storage.userStorage.getAllUsers();
            
            for(let user of Object.values(allUsers)) {
                if(userState.message.photo != null && userState.message.photo.length != 0) {
                    broadcaster.sendPhoto(user.id, userState.message.photo[0].file_id, userState.message.caption);                
                } else if(userState.message.video != null) {
                    broadcaster.sendVideo(user.id, userState.message.video.file_id, userState.message.caption);                
                } else if(userState.message.text != null) {
                    broadcaster.sendMessage(user.id, userState.message.text);
                }
            }
            
            broadcaster.replaceInlineKeyboard(query, Messages.announcementSentMessage, undefined);
            userStateManager.clearStateForUserID(from_id);            
            break;
        case InlineKeys.MANAGE_CANCEL_ANNOUNCEMENT:
            // broadcaster.sendMessage(from_id, Messages.cancellationMessage);
            broadcaster.replaceInlineKeyboard(query, Messages.cancellationMessage, undefined);
            userStateManager.clearStateForUserID(from_id);            
            break;
        case InlineKeys.MANAGE_UPDATE_LIVESTREAM:
            userStateManager.setStateForUserID(from_id, UserStateIDs.MANAGE_AWAITING_LIVESTREAM, MODULE_ID, message_content);
            broadcaster.replaceInlineKeyboard(query, Messages.livestreamRequestMessage, undefined);
            break;
        case InlineKeys.MANAGE_CONFIRM_LIVESTREAM:
            if (userState) {
                storage.livestreamStorage.setLivestreamLink(userState.message);
                userStateManager.clearStateForUserID(from_id);
                broadcaster.replaceInlineKeyboard(query, Messages.livestreamSuccessMessage, undefined);
            } else {
                console.log("PANIC");
            }
            break;
        case InlineKeys.MANAGE_CANCEL_LIVESTREAM:
            userStateManager.clearStateForUserID(from_id);
            broadcaster.replaceInlineKeyboard(query, Messages.livestreamCancelMessage, undefined);
            break;
        case InlineKeys.MANAGE_VIEW_TESTIMONIES:
            userStateManager.clearStateForUserID(from_id);
            let testimonies = await storage.testimonyStorage.getPendingTestimonies();
            let shnKeyboard = new Keyboard.InlineKeyboard();
            
            // if (testimonies.length == 0) {
            //     userStateManager.clearStateForUserID(from_id);
            //     broadcaster.replaceInlineKeyboard(query, Messages.noPendingTestimoniesMessage);
            //     return;
            // }

            for (let t of testimonies) {
                shnKeyboard.addRow({text: t.id, callback_data: "MANAGE_" + t.id});
            }
            shnKeyboard.addRow({text: "Cancel", callback_data: InlineKeys.MANAGE_CANCEL_TESTIMONIES});
            userStateManager.setStateForUserID(from_id, UserStateIDs.MANAGE_CHOOSING_TESTIMONIES, MODULE_ID, message_content);  
            broadcaster.replaceInlineKeyboard(query, testimonies.length == 0 ? Messages.noPendingTestimoniesMessage : Messages.viewShnMessage, shnKeyboard);
            break;
        case InlineKeys.MANAGE_CANCEL_TESTIMONIES:
            let homeKeyboard = new Keyboard.InlineKeyboard();
            homeKeyboard.addRow({text: 'Make an Announcement', callback_data: InlineKeys.MANAGE_MAKE_ANNOUNCEMENT});
            homeKeyboard.addRow({text: 'Shout His Name', callback_data: InlineKeys.MANAGE_VIEW_TESTIMONIES});
            homeKeyboard.addRow({text: 'Update Livestream Link', callback_data: InlineKeys.MANAGE_UPDATE_LIVESTREAM});
            broadcaster.replaceInlineKeyboard(query, Messages.manageHomeMessage, homeKeyboard);
            break;
        case InlineKeys.MANAGE_APPROVE_TESTIMONIES:
            if (userState && userState.stateID == UserStateIDs.MANAGE_APPROVING_TESTIMONIES) {
                let testimonyIdToApprove = userState.message;
                let testimony = await storage.testimonyStorage.getTestimony(testimonyIdToApprove);
                
                //change testimony status to approved
                await storage.testimonyStorage.setTestimonyStatus(testimonyIdToApprove, 'APPROVED');
                
                //send out testimonies
                let allUserIds = storage.userStorage.getAllUserIds();
                broadcaster.sendMessageToUsers(allUserIds, Messages.shnHeader + Messages.getTestimonyMessage(testimony));

                //clear user state
                userStateManager.clearStateForUserID(from_id);            

                //clear inline keyboard
                broadcaster.replaceInlineKeyboard(query, Messages.testimonyAcceptedMessage, undefined);
            } else {
                console.log('Manage SHN Accept: Invalid user state');
            }     
            break;
        case InlineKeys.MANAGE_REJECT_TESTIMONIES:
            if (userState && userState.stateID == UserStateIDs.MANAGE_APPROVING_TESTIMONIES) {
                let rejectID = userState.message;

                // change testimony status to rejected
                storage.testimonyStorage.setTestimonyStatus(rejectID, 'REJECTED');
                
                // clear user state
                userStateManager.clearStateForUserID(from_id);
                // clear keyboard
                broadcaster.replaceInlineKeyboard(query, Messages.testimonyRejectedMessage, undefined);
            } else {
                console.log('Manage SHN Reject: Invalid user state');
            }
            break;
        default:
            if (userState) {
                switch (userState.stateID) {
                    case UserStateIDs.MANAGE_CHOOSING_TESTIMONIES:
                        let testimonyID = query.data.split('_')[1];
                        
                        if(!testimonyID) {
                            broadcaster.deleteMessage(query);
                            console.log('Manage: Invalid keyboard callback_data');
                            return;
                        }
                        
                        userStateManager.setStateForUserID(from_id, UserStateIDs.MANAGE_APPROVING_TESTIMONIES, MODULE_ID, testimonyID);
                        let t = await storage.testimonyStorage.getTestimony(testimonyID);

                        let approveTestimonyKeyboard = new Keyboard.InlineKeyboard();
                        approveTestimonyKeyboard.addRow({text: 'Approve', callback_data: MANAGE_APPROVE_TESTIMONIES});
                        approveTestimonyKeyboard.addRow({text: 'Reject', callback_data: MANAGE_REJECT_TESTIMONIES});
                        approveTestimonyKeyboard.addRow({text: '< Back', callback_data: MANAGE_VIEW_TESTIMONIES});
                        broadcaster.replaceInlineKeyboard(query, Messages.getTestimonyMessage(t), approveTestimonyKeyboard);
                        break;
                    default:
                        console.log('PANIC: ' + userState.stateID);
                        break;
                }
            } else {
                console.log("PANIC");
            }
            break;
    }

}

;module.exports = {handleManageMessage, handleManageKeyboard};