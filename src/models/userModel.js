import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String, 
        required: true,
    },

    bio: {
        type: String
    },

    profileFacebook: {
        type: String
    },

    profileTwitter: {
        type: String
    },

    profileLinkedin: {
        type: String
    },

    profileInstagram:{
        type: String
    },

    imageLink: {
        type: String
    },

    password: {
        type: String, 
        required: true,
    }, 

    repeatPassword: {
        type: String,
        required: true,
    },

    faculty: {
        type: String,
    },

    department: {
        type: String,
    },

    regNumber: {
        type: String,
    },

    yearOfStudy: {
        type: String,
    },

    transcript: {
        type: String,
    },

    dateOfBirth: {
        type: String,
    },

    phoneNumber: {
        type: Number,
    },

    dateCreated: {
        type: Date,
        default: Date.now,
    },

    role: {
        type: String,
        default: "user"
    },

    emailToken: {
        type: String
    },


    // for third application
    userName: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    googleId: {
        type: String
    },

    provider: {
        type: String,
    }
})


export default mongoose.model("User", userSchema)