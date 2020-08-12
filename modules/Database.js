// Class that provides an interface to the firestore to abstract away database operations

const makeDatabase = (firestore) => {
    return {
        getCollection : async (collectionString, options=[]) => {
            let query = firestore.collection(collectionString);

            for(let option of options) {
                query = query.where(...option);
            }

            return query.get();
        },

        getDocument : async (collectionString, docString) => {
            let collectionRef = firestore.collection(collectionString);
            let doc = await collectionRef.doc(docString).get();
            if(!doc.exists) {
                return null;
            }
            return doc.data();
        },

        updateDocument : async (collectionString, docString, field) => {
            let docRef = firestore.collection(collectionString).doc(docString);
            await docRef.update(field);
        },

        setDocument : async (collectionString, docString, obj) => {
            await firestore.collection(collectionString).doc(docString).set(obj);
        }
    }
};

module.exports = makeDatabase;
