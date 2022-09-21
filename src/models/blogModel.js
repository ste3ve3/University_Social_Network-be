
import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({

    title : {
        type: 'string',
        required: true,
    },

    body : {
        type:'string',
        required: true,
    },

    imgLink : {
        type: 'string',
        required: true,
    },

    authorName : {
        type: 'string',
        required: true,
    },

    category : {
        type: 'string',
        required: true,
    },

    authorImage : {
        type: 'string',
        required: true,
    },
    
    date : {
        type: 'date',
        default: Date.now
    }

});

export default mongoose.model('BlogPost', blogSchema);