const start = require('./Start');
const latest = require('./Latest');
const help = require('./Help');
const livestream = require('./Livestream');
const subscription = require('./Subscription');
const handleFeedback = require('./Feedback');
const handleTestimony = require('./Testimony');
const { handleManageMessage, handleManageKeyboard } = require('./Manage');
const flavour = require('./Flavour');
const InlineKeys = require('../InlineKeys');
const magic = require('./Magic');

const makeCommands = (storage, broadcaster, userStateManager, verseManager) => {    
    return {
        storage,
        broadcaster,
        userStateManager,
        verseManager,
        routeMessage(message) {
            switch (message.text) { 
                
                //////////////////////////////////////////////////////////////////////////////
                //                            STATELESS COMMANDS                            //
                //////////////////////////////////////////////////////////////////////////////
                case '/start':
                    start(message, this.storage, this.broadcaster);
                    break;
                case '/latest':
                    latest(message, this.storage, this.broadcaster, this.verseManager);
                    break;
                case '/help':
                    help(message, this.storage, this.broadcaster);
                    break;
                case '/livestream':
                    livestream(message, this.storage, this.broadcaster);
                    break;
                case '/subscribe':
                    subscription(message, this.storage, this.broadcaster, true);
                    break;
                case '/unsubscribe':
                    subscription(message, this.storage, this.broadcaster, false);
                    break;
                case '/magic':
                    magic(message, this.storage, this.broadcaster);
                    break;
                //////////////////////////////////////////////////////////////////////////////
                //                            STATEFUL COMMANDS                             //
                //////////////////////////////////////////////////////////////////////////////
                case '/feedback':
                    handleFeedback(message, this.storage, this.broadcaster, this.userStateManager);
                    break;
                case '/shouthisname':
                    handleTestimony(message, this.storage, this.broadcaster, this.userStateManager);
                    break;
                case '/manage':
                    handleManageMessage(message, this.storage, this.broadcaster, this.userStateManager);
                    break;
                default:
                    let userState = userStateManager.getStateForUserID(message.from.id); //returns {stateId, message, module}, module either FEEDBACK/TESTIMONY/MANAGE (these are the only stateful commands)
                    if(userState !== undefined) {
                        //find out what command this user state has relation to,
                        //then it needs to route the new message to the respective module                         
                        switch (userState.module) {
                            case 'FEEDBACK':
                                handleFeedback(message, this.storage, this.broadcaster, this.userStateManager, userState);
                                break;
                                
                            case 'TESTIMONY':
                                handleTestimony(message, this.storage, this.broadcaster, this.userStateManager, userState);                                
                                break;

                            case 'MANAGE':
                                handleManageMessage(message, this.storage, this.broadcaster, this.userStateManager, userState);                                
                                break;
                        
                            default:
                                //TODO: edge case -> user state has attached module (bug)
                                console.log("PANIC THERES A BUG")
                                break;
                        }
                    }
                    else {
                        flavour(message, this.broadcaster);
                    }
                    break;
            }
        },
        routeInlineResponse(query) {
            //***MIGHT BE UNDEFINED: left to Manage to handle
            let userState = userStateManager.getStateForUserID(query.from.id);
            switch (InlineKeys.getRouteFromKey(query.data)) {
                case 'MANAGE':
                    handleManageKeyboard(query, this.storage, this.broadcaster, this.userStateManager, userState);
                    break;
                default:
                    console.log("PANIC THERES A BUG");
                    break;
            }
        }
        }
}

module.exports = makeCommands;