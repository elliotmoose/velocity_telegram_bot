// Abstraction that provides user-related operations to the database

let userCache = {};

module.exports = (database) => {
    return {
        getAllUsers() {
            return userCache;
        },

        getAllUserIds() {
            return Object.keys(userCache);
        },

        doesUserExist(id) {
            return userCache[id] != null;
        },

        async addUser(id, name) {
            let newUser = {id, name, isAdmin: false, isSubscribed: true};
            userCache[id] = newUser;
            await database.setDocument("users", `${id}`, newUser);
        },

        isUserSubscribed(id) {
            return userCache[id].isSubscribed;
        },

        async updateCacheAndRemoteForUser(id, fields) {            
            if(!userCache[id]) {
                console.error('UserStorage: User does not exist');
                return;
            }
            let user = userCache[id]
            for (let key in fields) {
                user[key] = fields[key];
            }
            await database.setDocument("users", `${id}`, user);
        },

        getUserName (id) {
            return userCache[id].name;
        },

        async updateUserName (id, name) {
            await this.addUser(id, name);
        },

        async pullUsersToCache () {    
            let snapshot = await database.getCollection("users");
            userCache = {};
            snapshot.forEach((user)=> {
                let userData = user.data();
                userCache[userData.id] = userData;
            });
        },

        isUserAdmin(id) {
            return userCache[id].isAdmin;
        },

        getAdminIds() {
            admins = [];
            for (let user in userCache) {
                if (this.isUserAdmin(id)) {
                    admins.push(user.id);
                }
            }
            return admins;
        }
    }
}