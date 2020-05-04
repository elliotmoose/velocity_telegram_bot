const start = require('./Start');
const latest = require('./Latest');
const help = require('./Help');
const feedback = require('./Feedback');
const testimony = require('./Testimony');
const manage = require('./Manage');

const makeCommands = (storage, broadcaster, userStateManager) => {
    return {
        storage,
        broadcaster,
        userStateManager,
        routeMessage(message) {
            switch (message.text) {
                //////////////////////////////////////////////////////////////////////////////
                //                            STATELESS COMMANDS                            //
                //////////////////////////////////////////////////////////////////////////////
                case '/start':
                    start(message, this.storage, this.broadcaster);
                    break;
                case '/latest':
                    latest(message, this.storage, this.broadcaster);
                    break;
                case '/help':
                    help(message, this.storage, this.broadcaster);
                    break;
                //////////////////////////////////////////////////////////////////////////////
                //                            STATEFUL COMMANDS                             //
                //////////////////////////////////////////////////////////////////////////////
                case '/feedback':
                    feedback(message, this.storage, this.broadcaster, this.userStateManager);
                    break;
                case '/shouthisname':
                    testimony(message, this.storage, this.broadcaster, this.userStateManager);
                    break;
                case '/manage':
                    manage(message, this.storage, this.broadcaster, this.userStateManager);
                    break;
                default:
                    let userState = userStateManager.getStateForUserID(message.from.id); //returns either FEEDBACK/TESTIMONY/MANAGE (these are the only stateful commands)
                    if(userState !== undefined) {
                        //find out what command this user state has relation to,
                        //then it needs to route the new message to the respective module                         
                        switch (userState.module) {
                            case 'FEEDBACK':
                                feedback(message, this.storage, this.broadcaster, this.userStateManager, this.userState);
                                break;
                                
                            case 'TESTIMONY':
                                testimony(message, this.storage, this.broadcaster, this.userStateManager, this.userState);                                
                                break;

                            case 'MANAGE':
                                manage(message, this.storage, this.broadcaster, this.userStateManager, this.userState);                                
                                break;
                        
                            default:
                                //TODO: edge case -> user state has attached module (bug)
                                break;
                        }
                    }
                    else {
                        // flavour(message, this.broadcaster);
                    }
                    break;
            }
        }
    }
}

module.exports = makeCommands;