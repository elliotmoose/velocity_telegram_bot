// Holds constants for inline keyboard keys

const getRouteFromKey = (key) => {
    return key.split('_')[0];
}

const keys = { 
    MANAGE_MAKE_ANNOUNCEMENT: 'MANAGE_MAKE_ANNOUNCEMENT', 
    MANAGE_SEND_ANNOUNCEMENT: 'MANAGE_SEND_ANNOUNCEMENT', 
    MANAGE_CANCEL_ANNOUNCEMENT: 'MANAGE_CANCEL_ANNOUNCEMENT', 
    MANAGE_VIEW_TESTIMONIES: 'MANAGE_VIEW_TESTIMONIES',
    MANAGE_APPROVE_TESTIMONIES: 'MANAGE_APPROVE_TESTIMONIES',
    MANAGE_REJECT_TESTIMONIES: 'MANAGE_REJECT_TESTIMONIES',
    MANAGE_CANCEL_TESTIMONIES: 'MANAGE_CANCEL_TESTIMONIES',
    MANAGE_UPDATE_LIVESTREAM: 'MANAGE_UPDATE_LIVESTREAM',
    MANAGE_CONFIRM_LIVESTREAM: 'MANAGE_CONFIRM_LIVESTREAM',
    MANAGE_CANCEL_LIVESTREAM: 'MANAGE_CANCEL_LIVESTREAM',
    MANAGE_CANCEL_MAIN: 'MANAGE_CANCEL_MAIN'
};

module.exports = { ...keys, getRouteFromKey };