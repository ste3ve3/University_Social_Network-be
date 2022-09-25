import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import UserValidationSchema from "../middlewares/registerValidation.js"
import nodemailer from "nodemailer"
import crypto from "crypto"
import sessionStorage from "node-sessionstorage"


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
        
        const newUser = new User()

            newUser.firstName = request.body.firstName,
            newUser.lastName = request.body.lastName,
            newUser.email = request.body.email,
            newUser.password = hashedPassword,
            newUser.repeatPassword = hashedRepeatPassword,
            newUser.emailToken = crypto.randomBytes(64).toString("hex"),
            newUser.isVerified = false  


        sessionStorage.setItem("user_email", request.body.email)
        await newUser.save();


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

        response.status(201).json({"successMessage": `The new user "${request.body.email}" is created successfully, complete your profile and verify your email!`})
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
        const myUser = await User.findOne({emailToken: token})
        if(myUser){
            // myUser.emailToken = null
            myUser.isVerified = true
            await myUser.save()
            response.redirect(process.env.EMAIL_VERIFIED_REDIRECT_URL)
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

        response.status(200).json({"RegisteredUsers": RegisterUsers})
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

const getUserById = async (req, res) => {

    try{
        const user = await User.findOne({_id: req.params.id});
        if(user){
            res.status(200).json({ "fetchedUser": user });
        }

        else{
            res.status(400).json({
                "userFetchedError": "User not found",
            });
        }

    }

    catch (error){
        console.log(error);
        res.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }

}

const assignUserRole = async(request, response) =>{
    try{
        const user = await User.findOne({_id: request.params.id});

        user.role = request.body.role

        await user.save();

        response.status(200).json({ "successMessage": `Role updated successfully!`, "role": user.role })
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

const updateUser1 = async(request, response) =>{
    try{
        const registeredEmail = sessionStorage.getItem("user_email")
        const storedEmail = await User.findOne({email: registeredEmail})
        
        if(storedEmail){
        storedEmail.faculty = request.body.faculty || storedEmail.faculty,
        storedEmail.department = request.body.department || storedEmail.department,
        storedEmail.regNumber = request.body.regNumber || storedEmail.regNumber,
        storedEmail.yearOfStudy = request.body.yearOfStudy || storedEmail.yearOfStudy

        const updatedUser = await storedEmail.save()

        const newUser = {
            faculty: updatedUser.faculty,
            department: updatedUser.department,
            regNumber: updatedUser.regNumber,   
            yearOfStudy: updatedUser.yearOfStudy
        }

        response.status(200).json({
            "message": "Student Info added successfully!",
            "ourUpdatedUser": newUser
        })

    }
    else{
        response.status(400).json({
            "message": "User not found!"
        }) 
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

const updateUser2 = async(request, response) =>{
    try{
        const registeredEmail = sessionStorage.getItem("user_email")
        const storedEmail = await User.findOne({email: registeredEmail})
        const transciptImage = request.file.filename;
        const transcriptImages = `${request.protocol}://${request.get("host")}/transcriptImages/${transciptImage}`;
        
        if(storedEmail){
        storedEmail.transcript = transcriptImages || storedEmail.transcript

        const updatedUser = await storedEmail.save()

        const newUser = {
            transcript: updatedUser.transcript,
        }

        response.status(200).json({
            "message": "Student transcript added successfully!",
            "UpdatedUser": newUser
        })

    }
    else{
        response.status(400).json({
            "message": "User not found!"
        }) 
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

const updateUser3 = async(request, response) =>{
    try{
        const registeredEmail = sessionStorage.getItem("user_email")
        const storedEmail = await User.findOne({email: registeredEmail})
        
        if(storedEmail){
        storedEmail.dateOfBirth = request.body.dateOfBirth || storedEmail.dateOfBirth,
        storedEmail.phoneNumber = request.body.phoneNumber || storedEmail.phoneNumber

        const updatedUser = await storedEmail.save()

        const newUser = {
            dateOfBirth: updatedUser.dateOfBirth,
            phoneNumber: updatedUser.phoneNumber
        }

        response.status(200).json({
            "message": "User Info added successfully!",
            "UpdatedUser": newUser
        })

    }
    else{
        response.status(400).json({
            "message": "User not found!"
        }) 
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

export default {createNewUser, getAllUsers, verifyEmail, updateUser1, updateUser2, updateUser3, assignUserRole, getUserById}