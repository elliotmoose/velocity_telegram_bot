module.exports = (firestore) => {
    return {
        getCollection = async (collectionString) => {
            let ref = firestore.collection(collectionString).get();
            return ref;
        },

        getDocument = async (collectionString, docString) => {
            let docRef = await firestore.collection(collectionString).doc(docString).get();        
            return docRef.data();
        },

        setDocument = async (collectionString, docString, obj) => {
            await firestore.collection(collectionString).doc(docString).set(obj);
        },

        deleteDocument = async () => {
            // TODO
        }
    }
}