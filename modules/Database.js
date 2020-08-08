const makeDatabase = (firestore) => {
    return {
        getCollection : async (collectionString) => {
            let ref = firestore.collection(collectionString).get();
            return ref;
        },

        getDocument : async (collectionString, docString) => {
            let collectionRef = firestore.collection(collectionString);
            let doc = await collectionRef.doc(docString).get();
            if(!doc.exists)
            {
                return null;
            }
            return doc.data();
        },

        setDocument : async (collectionString, docString, obj) => {
            await firestore.collection(collectionString).doc(docString).set(obj);
        },

        deleteDocument : async () => {
            // TODO
        }
    }
};

module.exports = makeDatabase;
