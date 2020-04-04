const quotes = [
    "Amen amen", 
    "That's right", 
    "Come on", 
    "So good", 
    "Wassup people", 
    "Take a look at the stage", 
    "Yall trying to poison me with chilli isit"
];

module.exports = {
    generateRandomQuote: function() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}