// ////////////////////////////////////////////////////////////////////////////
// //                                                                        //
// //                             Inline Keyboards                           //
// //                                                                        //
// ////////////////////////////////////////////////////////////////////////////
// const Keyboard = require('node-telegram-keyboard-wrapper');

// let manageKeyboard = new Keyboard.InlineKeyboard();
// manageKeyboard.addRow({text: 'Make an Announcement', callback_data: ANNOUNCEMENTS_KEY})
// 			.addRow({text: 'Shout His Name', callback_data: SHOUT_HIS_NAME_KEY});

// const editInlineKeyboard = (query, newMessage, newKeyboard) => {
//     bot.editMessageText(newMessage, {
//         chat_id: query.from.id,
//         message_id: query.message.message_id,
//         reply_markup: newKeyboard
//     });
// }

// if(admin_ids.indexOf(msg.from.id) != -1) {
//     bot.sendMessage(msg.from.id, manageHomeMessage, manageKeyboard.build());
// }


const Messages = require('../Messages');
const UserStateIDs = require('../UserStateIDs');
const Keyboard = require('node-telegram-keyboard-wrapper');
const MODULE_ID = 'MANAGE';

const handleManage = (message, storage, broadcaster, userStateManager, userState=undefined) => {
    let id = message.from.id;
    let name = message.from.first_name;
    let message_content = message.text;

    let userStorage = storage.userStorage;
    let keyboard = new Keyboard.InlineKeyboard();

    if (!userState) {
        //check permissions
        if (userStorage.isUserAdmin(id)) {
            keyboard.addRow({text: 'Make an Announcement'})
            			.addRow({text: 'Shout His Name'});

        }


        broadcaster.sendMessage(id, Messages.manageHomeMessage);
        //SEND INLINE KEYBOARD
        // userStateManager.setStateForUserID(from_id, UserStateIDs.MANA, MODULE_ID, message_content);     
        return;
    } 

    switch (userState.stateID) {            
        case UserStateIDs.ANNOUNCEMENT_AWAITING:
            break;
        case UserStateIDs.ANNOUNCEMENT_CONFIRMING:

            let confirm = false; //read from inline keyboard message
            let cancel = false; //read from inline keyboard message
            if(cancel) {
                broadcaster.sendMessage(from_id, Messages.cancellationMessage);
                userStateManager.clearStateForUserID(from_id); //finished    
                return;
            }

            if(confirm) {
                let allUserIds = userStorage.getAllUsers().map(user=>user.id)
                let announcementMessage = userState.message;
                broadcaster.sendMessageToUsers(allUserIds, announcementMessage)
            }
            break;
    
        default:
            console.warn("Routed message for user with state to wrong handler (bug). Please look at /commands/index.js");
            break;
    }
}

module.exports = handleManage;