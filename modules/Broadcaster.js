module.exports = (bot) => {
    return {
        bot,
        sendMessage: async (id, message) => {
            await this.bot.sendMessage(id, message);
        }
    }
}