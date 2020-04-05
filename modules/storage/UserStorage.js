// userCache is an object with key = user id and element = user name
let userCache = {};

module.exports = (database) => {
    return {
        async getAllUsers() {
            return userCache;
        },

        doesUserExist(id) {
            return userCache[id] == null;
        },

        async addUser(id, username) {
            userCache[id] = username;
            database.setDocument("users", id, {chat_id: id, name: username});
        },

        getUserName (id) {
            return userCache[id];
        },

        updateUserName: async(id, name) => {
            addUser(id, name);
        },

        pullUsersToCache () {    
            let snapshot = await database.getCollection("users");    
            userCache = {};
            snapshot.forEach((user)=> {
                let userData = user.data();
                userCache[userData.chat_id] = userData.name;
            });
        }
    }
}