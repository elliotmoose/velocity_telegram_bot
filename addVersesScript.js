const config = require('dotenv').config();
const fetch = require('node-fetch');
const firebase = require('firebase-admin');
const serviceAccount = require('./velocitytelegrambot-firebase-adminsdk-6x8f4-03b6ed7bce.json');
const fs = require('fs');
const esvToken = process.env.ESV_TOKEN;

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://velocitytelegrambot.firebaseio.com"
});

const firestore = firebase.firestore();

fs.readFile('versesToAdd.txt', async (err, data) => {
    if (err) throw err;

    const text = data.toString();
    const split = text.split("\r\n");
    // console.log(split);

    let currMonth = "";
    
    for (let i = 0; i < split.length; i++) {
        line = split[i];
        if (line === "") {
            continue;
        }
        if (!+line[0]) {
            console.log("Month: " + line);
            currMonth = line;
            continue;
        } else {
            date = "";
            index = 0;
            for (let j = 0; j < line.length; j++) {
                if (+line[j] || line[j] == "0") {
                    date += line[j];
                    index++;
                } else {
                    break;
                }
            }
            console.log(date + " " + currMonth);
            for (let j = index; j < line.length; j++) {
                index++;
                if (line[j] == "-" || line[j] == "–") {
                    if (line[j + 1] == " ") {
                        index++;
                    }
                    break;
                }
            }
            verse = "";
            for (let j = index; j < line.length; j++) {
                if (line[j] == "–") {
                    verse += "-"
                } else {
                    verse += line[j];
                }
            }
            console.log(verse);
            // JUST TO TEST THAT STRING IS IN VALID FORMAT
            // let headerString = 'Token ' + esvToken;
            // let response = await fetch('https://api.esv.org/v3/passage/text/?q=' + verse + '&include-footnotes=false', {
            //     method: 'GET',
            //     headers: { 'Authorization': headerString },
            // })
            // let json = await response.json();
            // console.log(json.passages[0]);

            console.log(firebase.firestore.Timestamp.fromDate(new Date(date + " " + currMonth + " 2020 07:00:00 GMT+8")))
            // UNCOMMENT TO ADD
            // firestore.collection("verses").doc().set({
            //     date: firestore.Timestamp.fromDate(new Date(date)),
            //     sent: false,
            //     verse: verse
            // })   
        }
    }
})