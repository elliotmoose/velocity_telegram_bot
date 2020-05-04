// userCache is an object with key = user id and element = user name
let userCache = {};

module.exports = (database) => {
    return {
        getAllUsers() {
            return userCache;
        },

        doesUserExist(id) {
            return userCache[id] != null;
        },

        async addUser(id, name) {
            userCache[id] = name;
            await database.setDocument("users", `${id}`, {id: id, name: name});
        },

        getUserName (id) {
            return userCache[id];
        },

        async updateUserName (id, name) {
            await this.addUser(id, name);
        },

        async pullUsersToCache () {    
            let snapshot = await database.getCollection("users");
            userCache = {};
            snapshot.forEach((user)=> {
                let userData = user.data();
                userCache[userData.id] = userData.name;
            });
        }
    }
}