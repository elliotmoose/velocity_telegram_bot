// Holds all the messages and strings

const QUOTES = [
    "Amen amen",
    "Amen amen amen",
    "Amen amen amen amen",
    "Amen amen amen amen amen",
    "That's right",
    "Come on",
    "So good",
    "Wassup people",
    "Take a look at the stage",
    "Yall trying to poison me with chilli isit"
]

module.exports = {
    // start
    getWelcomeMessage: (name) => {
        return `What's up ${name}!!` + 
        "\n\nMy name is M.A.V.I.S., short for Machine-Assisted Velocity Information Service! I'm here to provide a few services:\n\n" + 
        "1) First off, I'll be sending you the daily passages that we're reading together as a ministry.\n" +
        "2) If you don't want to receive the daily passages, use the '/unsubscribe' command. If you change your mind after, you can always '/subscribe' again!\n" + 
        "3) To get the latest passage(s) for the day, use the '/latest' command.\n" + 
        "4) You can submit a testimony to shout the name of Jesus by using the '/shouthisname' command!\n" + 
        "5) I'll also be sending you any announcements made by admins, and any approved testimonies from other users!\n" + 
        "6) Want to hop on to our service livestreams? Use '/livestream' to get the link!\n" +
        "7) Lastly, you can also send me feedback with the '/feedback' command.\n\n" + 
        "If you ever need a recap, you can always ask me for '/help'!";
    },
    
    getDailyVerseHeader: (name) => {
        return `Good morning ${name}! Here's the passage for today:\n\n`;
    },

    // subscribing
    getAlreadyRegisteredMessage: (name) => {
        return `Hello there ${name}, you are already registered. Type /latest to get the passage(s) for the day!`;
    },
    unsubscribeMessage : "We're sad to see you go 😢. Feel free to subscribe again with '/subscribe'.",
    resubscribeMessage : "Welcome back! I'll be sending you the verses starting tomorrow.",

    // livestream
    getCheckLivestream: (link) => {
        return `Double check that you entered the right link:\n\n${link}`
    },
    livestreamMessage: "The livestream link for this Sunday is ",
    livestreamRequestMessage: "Enter the new livestream link: ",

    // shouthisname
    getTestimonyMessage: (t) => {
        return `${t.message}\n\n - ${t.name}`
    },
    testimonyRequestMessage: "Let's lift up the name of Jesus!! What would you like to thank Him for? Your testimony will be reviewed by an admin before it is broadcasted to all subscribers! To cancel this operation, type 'Cancel'.",
    testimonyReceivedMessage: "Amen amen!! Thank you for sharing that with us!",

    // feedback
    feedbackRequestMessage: "What other things would you like me to able to do in future? Send me some feedback in your next message! To cancel this operation, send 'Cancel'.\n\n(For example, send us more stuff that Ps Mavis says)",
    feedbackReceivedMessage: "Thank you for your suggestion!",
    cancellationMessage: "SHORE! Action cancelled.",

    // latest
    latestHeader : "Here's the latest passage:\n\n",

    // help
    helpMessage: "\n\nWhat's up people! Here's what I can do:\n\n" +
    "/subscribe : Subscribe to verse of the day.\n" +
    "/unsubscribe : Unsubscribe from verse of the day.\n" +
    "/latest : Get the latest verse of the day.\n" + 
    "/shouthisname : You can submit a testimony to shout the name of Jesus!\n" + 
    "/livestream : Get livestream link.\n" + 
    "/feedback : Send me feedback.\n" +
    "/help : See this message.",

    // manage
    manageHomeMessage: "What would you like to manage?",
    adminRejectMessage: "You do not have enough faith to run that command!",

    testimonyAcceptedMessage: "Testimony approved and sent out",
    testimonyRejectedMessage: "RIP testimony rejected.",
    viewShnMessage: "Select a testimony to view",
    noPendingTestimoniesMessage: "No pending testimonies.",
    shnHeader: "PTL! We have a new testimony!\n\n(You can send in your own testimonies with '/shouthisname')\n\n",

    typeOfAnnouncementMessage: "What kind of announcement would you like to create?",
    scheduledDateMessage: "Send scheduled date to send announcement\n\n(enter in DDMMYY format eg 020620)",
    scheduledTimeMessage: "Send scheduled time to send announcement\n\n(enter in 24 hr HHMM format eg 2359)\n(/back to change date)",
    announcementRequestMessage: "Send me an announcement (text/photo/video) you want to broadcast!!",
    announcementConfirmMessage: "Would you like to confirm this announcement?",
    announcementSentMessage: "Announcement sent!",
    announcementNotFound: "I could not find the announcement you are looking for. Please try again :(",
    
    livestreamSuccessMessage: "The livestream link has been successfully updated! Use /livestream to get the link.",
    livestreamCancelMessage: "Link not updated. Use /livestream to get the current link.",

    // magic
    magicMessage: "🎉 Magic has been performed 🎉",
    nonMagicianMessage: "You fool! You dare to perform magic?",

    // flavour
    getRandomQuote: () => {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    },
}