const QUOTES = [
    "Amen amen",
    "That's right",
    "Come on",
    "So good",
    "Wassup people",
    "Take a look at the stage",
    "Yall trying to poison me with chilli isit"
]

module.exports = {

    getWelcomeMessage: (name) => {
        return `What's up ${name}!!` + 
        "\n\nMy name is M.A.V.I.S., short for Machine-Assisted Velocity Information Service! I'm here to provide a few services:\n\n" + 
        "1) First off, I'll be sending you the daily verses that we're reading together as a ministry.\n" + 
        "2) To get the latest verse of the day, use the '/latest' command.\n" + 
        "3) You can submit a testimony to shout the name of Jesus by using the '/shouthisname' command!\n" + 
        "4) I'll also be sending you any announcements made by admins, and any approved testimonies from other users!\n" + 
        "5) Lastly, you can also send me feedback with the '/feedback' command.\n\n" + 
        "If you ever need a recap, you can always ask me for '/help'!";
    },

    getAlreadyRegisteredMessage: (name) => {
        return `Hello there ${name}, you are already registered. Type /latest to get the verse of the day!`;
    },

    getRandomQuote: () => {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    },

    getDailyVerseHeader: (name) => {
        return `Good morning ${name}! Here's the passage for today:\n\n`;
    },

    feedbackRequestMessage: "What other things would you like me to able to do in future? Send me some feedback in your next message! Your feedback will remain anonymous. To cancel this operation, send 'Cancel'.",
    feedbackReceivedMessage: "Thank you for your suggestion!",
    testimonyRequestMessage: "Let's lift up the name of Jesus!! What would you like to thank him for? Your testimony will be reviewed by an admin before it will be broadcast to all subscribers! To cancel this operation, type 'Cancel'.",
    testimonyReceivedMessage: "Amen amen!! Thank you for sharing that with us!",
    cancellationMessage: "SHORE!",
    manageHomeMessage: "What would you like to manage?",
    typeOfAnnouncementMessage: "What kind of announcement would you like to create?",
    announcementRequestMessage: "Send me the announcement you want to broadcast\n\n(text, photo, and video accepted but captions don't work)",
    shoutHisNameViewTestimonyMessage: "Select a testimony to view.",
    scheduledDateMessage: "Send scheduled date to send announcement\n\n(enter in DDMMYY format eg 020620)",
    scheduledTimeMessage: "Send scheduled time to send announcement\n\n(enter in 24 hr HHMM format eg 2359)\n(/back to change date)",
    livestreamMessage: "The livestream link for this Sunday is ",
    latestHeader : "Here's the latest passage:\n\n",
    helpMessage: "\n\nWhat's up people! Here's what I can do:\n\n" +
        "/latest : Get the latest verse of the day.\n" + 
        "/shouthisname : You can submit a testimony to shout the name of Jesus!\n" + 
        "/feedback : Send me feedback.\n" +
        "/livestream : Get livestream link\n" + 
        "/manage : For admins.\n" +
        "/help : See this message."
}