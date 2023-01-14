
import mongoose from 'mongoose';

const resultsSchema = mongoose.Schema({
    
    name : {
        type: 'string',
        required: true,
    },

    email : {
        type: 'string',
        required: true,
    },

    postTitle : {
        type: 'string',

    },

    testResult : {
        type: 'string',
        required: true,
    },

    faculty : {
        type: 'string',
        required: true,
    },

    Status : {
        type: 'string'
    },
    
    date : {
        type: 'date',
        default: Date.now
    }

});

export default mongoose.model('TestResults', resultsSchema);