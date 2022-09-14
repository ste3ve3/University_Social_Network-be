import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import UserValidationSchema from "../middlewares/registerValidation.js"
import nodemailer from "nodemailer"
import crypto from "crypto"


const createNewUser = async(request, response) =>{

    const {error} = UserValidationSchema.validate(request.body)

    if (error)
        return response.status(400).json({"validationError": error.details[0].message})


    const duplicatedEmail = await User.findOne({email: request.body.email})

    if (duplicatedEmail)
        return response.status(409).json({"message": `The user with email "${request.body.email}" already exist`})

    try{
        // Email sender details
        const transporter = nodemailer.createTransport({
           service: "gmail",
           auth: {
             user: "ndicunguyesteve4@gmail.com",
             pass: "qlbtvfaoozcoyvzb"
           },
           tls:{
            rejectUnauthorized: false
           }
        })

        const salt = await bcrypt.genSalt()

        const hashedPassword = await bcrypt.hash(request.body.password, salt)

        const hashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, salt)
        

        await User.create({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hashedPassword,
            repeatPassword: hashedRepeatPassword,
            emailToken: crypto.randomBytes(64).toString("hex"),
            isVerified: false
        })

        const user = await User.findOne({email: request.body.email})
        // Send verification email to user
        const mailOptions = {
            from: ' "Verify your email" <ndicunguyesteve4@gmail.com>',
            to: user.email,
            
            subject: "University Social Network - verify your email",
            html: `
            <div style="padding: 10px;">
                <h3> <span style="color: #414A4C;">${user.firstName} ${user.lastName}</span> Thank you for registering on our website! </h3> 
                <h4> Please verify your email to continue... </h4>
                <a style="border-radius: 5px; margin-bottom: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; background: #414A4C;" 
                href="http://${request.headers.host}/register/verifyEmail?token=${user.emailToken}"> 
                Verify Email </a>
            </div>
            `
        }

        // Sending the email
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Verification Email is Sent to your gmail account!")
                response.redirect(process.env.FAILURE_REDIRECT_URL)
            }
        })

        response.status(201).json({"successMessage": `The new user "${request.body.email}" is created successfully, verification email is sent to your email account!`})
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}


const verifyEmail = async(request, response) =>{
    try{
        const token = request.query.token;
        console.log(token)
        const myUser = await User.findOne({emailToken: token})
        if(myUser){
            // myUser.emailToken = null
            myUser.isVerified = true
            await myUser.save()
            response.redirect(process.env.FAILURE_REDIRECT_URL)
        }

        else{
            console.log("Email is not verified")
        }
        
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

const getAllUsers = async(request, response) =>{
    try{
        const RegisterUsers = await User.find()

        response.status(200).json({"Registered users": RegisterUsers})
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

export default {createNewUser, getAllUsers, verifyEmail}