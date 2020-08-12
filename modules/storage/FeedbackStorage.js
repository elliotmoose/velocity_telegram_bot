// Abstraction for submitting feedback to firestore

const makeFeedbackStorage = (database) => {
    return {
        async addFeedback(id, name, feedbackMessage) {            
            let docId = name + new Date().toISOString() + id;
            let feedback = {
                id, 
                name, 
                message: feedbackMessage
            }
            await database.setDocument("feedback", docId, feedback);
        }
    }
}

module.exports = makeFeedbackStorage;

// Doc ID: Mastor Pavis'2012-11-04T14:51:06.157Z'1234567
let templateFeedbackDoc = {
    id: 1234567,
    name: 'Mastor Pavis',
    message: 'Can I have more bass pls'
}