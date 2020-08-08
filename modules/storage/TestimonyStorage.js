const makeTestimonyStorage = (database) => {
    return {
        /**
         * @param {id} number
         * @param {String} name
         * @param {String} testimonyMessage
         */
        async addTestimony(userId, name, testimonyMessage) {            
            let docId = name + new Date().toISOString() + userId;
            let testimony = {
                id: docId, 
                userId, 
                name, 
                message: testimonyMessage,
                status: 'PENDING'//or APPROVED or REJECTED
            }
            await database.setDocument("testimonies", docId, testimony);
        },
        async getPendingTestimonies() {
            let collectionSnapshot = await database.getCollection('testimonies', [['status','==','PENDING']]);

            let testimonies = [];
            collectionSnapshot.forEach((docRef)=> {
                let doc = docRef.data();
                testimonies.push(doc);
                // testimonyCache[doc.docId] = doc;
            });

            return testimonies;
        },

        async getTestimony(docId) {
            // return testimonyCache[docId];
            return await database.getDocument('testimonies', docId);
        },

        async setTestimonyStatus(docId, status) {
            await database.updateDocument("testimonies", docId, {status});
            // testimonyCache[docId].status = status;
        }
    }
}

module.exports = makeTestimonyStorage;