import mongoose from "mongoose";

const Schema = mongoose.Schema

const userGoogleSchema = new Schema({
    email: {
        type: String, 
        required: true,
    }, 

    dateCreated: {
        type: Date,
        default: Date.now,
    },

    role: {
        type: String,
        default: "user"
    },


    // for third application
    userName: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    googleId: {
        type: String
    },

    password: {
        type: String
    },

    provider: {
        type: String,
        required: true
    },

    picture: {
        type: String,
    }
})


export default mongoose.model("UserGoogle", userGoogleSchema)