const makeTestimonyStorage = (database) => {
    return {
        /**
         * @param {id} number
         * @param {String} name
         * @param {String} testimonyMessage
         */
        async addTestimony(id, name, testimonyMessage) {            
            let docId = name + new Date().toISOString() + id;
            let testimony = {
                id, 
                name, 
                message: testimonyMessage,
                status: 'PENDING'//or APPROVED or REJECTED
            }
            await database.setDocument("testimonies", docId, testimony);
        },
        async getPendingTestimonies() {
            let collectionSnapshot = await database.getCollection('testimonies');

            let testimonies = [];
            collectionSnapshot.forEach((docRef)=> {
                let doc = docRef.data();
                testimonies.push(doc);
            });

            return testimonies;
        }
    }
}

module.exports = makeTestimonyStorage;

