const makeBroadcaster = (bot) => {
    return {
        sendMessage: async (id, message) => {
            await bot.sendMessage(id, message);
        },
        sendPhoto: async (id, file_id, caption) => {
            let options = caption ? {caption} : undefined;
            await bot.sendPhoto(id, file_id, options);
        },
        sendVideo: async (id, file_id, caption) => {
            let options = caption ? {caption} : undefined;
            await bot.sendVideo(id, file_id, options);
        },
        sendMessageToUsers: async (userIds, message) => {
            for (let userId of userIds) {
                await bot.sendMessage(userId, message);
            }
        },
        sendKeyboard: async (userId, message, keyboard) => {
            await bot.sendMessage(userId, message, keyboard.build());
        },
        answerCallback: async (callback_id) => {
            await bot.answerCallbackQuery(callback_id)
        },
        replaceInlineKeyboard: async (query, newMessage, newKeyboard) => {
            bot.deleteMessage(query.from.id, query.message.message_id);
            if (newKeyboard) {
                bot.sendMessage(query.from.id, newMessage, newKeyboard.build());
            }
            else {
                bot.sendMessage(query.from.id, newMessage);
            }
        },
        editInlineKeyboard: async (query, newMessage, newKeyboard) => {
            bot.editMessageText(newMessage, {
                chat_id: query.from.id,
                message_id: query.message.message_id,
                reply_markup: newKeyboard
            });
        },
        deleteMessage: async (query) => {
            bot.deleteMessage(query.from.id, query.message.message_id);
        }
    }
};

module.exports = makeBroadcaster;
