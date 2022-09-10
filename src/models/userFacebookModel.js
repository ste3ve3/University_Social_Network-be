import mongoose from "mongoose";

const Schema = mongoose.Schema

const userFacebookSchema = new Schema({
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

    picture: {
        type: String
    },

    facebookId: {
        type: String
    },

    password: {
        type: String
    },

    provider: {
        type: String,
        required: true
    }
})


export default mongoose.model("UserFacebook", userFacebookSchema)