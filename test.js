
require('dotenv').config();
let firebase = require('firebase-admin');
firebase.initializeApp({ credential: firebase.credential.cert(JSON.parse(process.env.FIREBASE_KEY)), databaseURL: process.env.FIREBASE_URL });
const firestore = firebase.firestore();

(async () => {
    let snapshot = await firestore.collection('users').where('name','==','Elliot' ).get();
    snapshot.forEach((doc)=> {
        console.log(doc.data());
    });
})();

