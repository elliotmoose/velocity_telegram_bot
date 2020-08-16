// Class to broadcast telegram messages to users

const makeBroadcaster = (bot) => {
    // Delay added to each method to adhere with API usage restrictions
    delay = async (ms) => {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }

    splitMessage = (str, l) => {
        var strs = [];
        while (str.length > l) {
            var pos = str.substring(0, l).lastIndexOf(' ');
            pos = (pos <= 0) ? l : pos;
            strs.push(str.substring(0, pos));
            var i = str.indexOf(' ', pos)+1;
            if (i < pos || i > pos+l) {
                i = pos;
            }
            str = str.substring(i);
        }
        strs.push(str);
        return strs;
    }

    return {
        sendMessage: async (id, message) => {
            let messages = splitMessage(message, 4096);
            for (let chunk in messages) {
                await bot.sendMessage(id, messages[chunk]);
                await delay(50);
            }
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
            let messages = splitMessage(message, 4096);
            for (let userId of userIds) {
                for (let chunk in messages) {
                    await bot.sendMessage(userId, messages[chunk]);
                    await delay(50);
                }
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
