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
                message: testimonyMessage
            }
            await database.setDocument("testimonies", docId, testimony);
        }
    }
}

module.exports = makeTestimonyStorage;

