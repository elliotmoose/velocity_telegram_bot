const makeBroadcaster = (bot) => {
    return {
        sendMessage: async (id, message) => {
            await bot.sendMessage(id, message);
        },
        sendMessageToUsers: async (userIds, message) => {
            for (let userId of userIds) {
                await bot.sendMessage(userId, message);
            }
        }
    }
};

module.exports = makeBroadcaster;
