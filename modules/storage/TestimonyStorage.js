// Abstraction to get/set/add testimonies from/in/to storage

const makeTestimonyStorage = (database) => {
    return {
        async addTestimony(userId, name, testimonyMessage) {            
            let docId = name + new Date().toISOString() + userId;
            let testimony = {
                id: docId, 
                userId, 
                name, 
                message: testimonyMessage,
                status: 'PENDING' // Default status. Can also be set to 'APPROVED' or 'REJECTED'.
            }
            await database.setDocument("testimonies", docId, testimony);
        },

        async getPendingTestimonies() {
            let collectionSnapshot = await database.getCollection('testimonies', [['status', '==', 'PENDING']]);

            let testimonies = [];
            collectionSnapshot.forEach((docRef)=> {
                let doc = docRef.data();
                testimonies.push(doc);
            });

            return testimonies;
        },

        async getTestimony(docId) {
            return await database.getDocument('testimonies', docId);
        },

        async setTestimonyStatus(docId, status) {
            await database.updateDocument("testimonies", docId, {status});
        }
    }
}

module.exports = makeTestimonyStorage;