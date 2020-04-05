module.exports = {
    userStates: {

    },
    /**
     * @params {userID: string, stateID, module, message}
     */
    setStateForUserID(userID, stateID, module, message) {
        this.userStates[userID] = {
            stateID,
            message, 
            module //either FEEDBACK, TESTIMONY, MANAGE            
        };
    },
    clearStateForUserID(userID) {
        this.userStates[userID] = undefined;
    },
    getStateForUserID(userID) {
        return this.userStates[userID];
    }
}