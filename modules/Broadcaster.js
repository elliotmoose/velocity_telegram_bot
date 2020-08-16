// Class to broadcast telegram messages to users

const makeBroadcaster = (bot) => {
    // Delay added to each method to adhere with API usage restrictions
    async function delay(ms) {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        sendMessage: async (id, message) => {
            await bot.sendMessage(id, message);
            await delay(50);
        },

        sendPhoto: async (id, file_id, caption) => {
            let options = caption ? {caption} : undefined;
            await bot.sendPhoto(id, file_id, options);
            await delay(50);
        },

        sendVideo: async (id, file_id, caption) => {
            let options = caption ? {caption} : undefined;
            await bot.sendVideo(id, file_id, options);
            await delay(50);
        },

        sendMessageToUsers: async (userIds, message) => {
            for (let userId of userIds) {
                await bot.sendMessage(userId, message);
                await delay(50);
            }
        },

        sendKeyboard: async (userId, message, keyboard) => {
            await bot.sendMessage(userId, message, keyboard.build());
            await delay(50);
        },

        answerCallback: async (callback_id) => {
            await bot.answerCallbackQuery(callback_id)
            await delay(50);
        },

        replaceInlineKeyboard: async (query, newMessage, newKeyboard) => {
            await bot.deleteMessage(query.from.id, query.message.message_id);
            await delay(50);
            if (newKeyboard) {
                if (newMessage) {
                    await bot.sendMessage(query.from.id, newMessage, newKeyboard.build());
                    await delay(50);
                }
            } else {
                if (newMessage) {
                    await bot.sendMessage(query.from.id, newMessage);
                    await delay(50);
                }
            }
        },

        editInlineKeyboard: async (query, newMessage, newKeyboard) => {
            await bot.editMessageText(newMessage, {
                chat_id: query.from.id,
                message_id: query.message.message_id,
                reply_markup: newKeyboard
            });
            await delay(50);
        },

        deleteMessage: async (query) => {
            await bot.deleteMessage(query.from.id, query.message.message_id);
            await delay(50);
        }
    }
};

module.exports = makeBroadcaster;
