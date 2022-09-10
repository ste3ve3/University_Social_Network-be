import mongoose from "mongoose";

const Schema = mongoose.Schema

const userGithubSchema = new Schema({
    email: {
        type: String, 
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

    picture: {
        type: String
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    githubId: {
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


export default mongoose.model("UserGithub", userGithubSchema)