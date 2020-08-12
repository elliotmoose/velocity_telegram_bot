// Class to manage user states

const makeUserStateManager = () => {
    return {
        userStates: {},

        setStateForUserID(userID, stateID, module, message) {
            this.userStates[userID] = {
                stateID,
                message, //the last message user sent
                module //either FEEDBACK, TESTIMONY, MANAGE            
            };
        },

        clearStateForUserID(userID) {
            this.userStates[userID] = undefined;
        },
        
        getStateForUserID(userID) {
            return this.userStates[userID];
        }
    };
}

module.exports = makeUserStateManager
