import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import crypto from "crypto"


const loginUser = async(request, response) =>{
    try{
        const userEmail = await User.findOne({email: request.body.email})

        if (!userEmail) 
            return response.status(400).json({
                "invalidEmail": "Invalid email or password, Please try again"
            })

        if(!userEmail.isVerified)
             return  response.status(400).json({
                "invalidEmail": "Please verify your email to continue"
            })

        
        const userPassword = await bcrypt.compare(request.body.password, userEmail.password)

        if (!userPassword)
            return response.status(400).json({
                "invalidPassword": "Invalid email or password, Please try again"
            })

        
        const token = Jwt.sign({userEmail} , process.env.ACCESS_TOKEN_SECRET)
        response.header("auth_token", token)

        const userRole = userEmail.role;
        response.set("token", token).json({
            "successMessage": "You are successfully logged in", "Access_Token": token, "role": userRole
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "Fail",
            "errorMessage": error.message
        })
    }
}


const loggedInUser = async(request, response) =>{
    try{
      const token = request.header("auth_token")
      
      if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                console.log(decodedToken)

                const myLoggedInUser = await User.findById(decodedToken.userEmail._id)
                response.status(200).json(myLoggedInUser)
            }
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// update user profile

const updateUser = async(request, response) =>{
    try{
      const token = request.header("auth_token")
      
      if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                const ourLoggedInUser = await User.findById(decodedToken.userEmail._id) 

                if(!ourLoggedInUser.isVerified){ 

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

                    // Send verification email to user
                    const mailOptions = {
                    from: ' "Verify your email" <ndicunguyesteve4@gmail.com>',
                    to: ourLoggedInUser.email,

                    subject: "Elano Portfolio - verify your email",
                    html: `
                    <h2>${ourLoggedInUser.firstName} ${ourLoggedInUser.lastName} thanks for registering on our site!</h2>
                    <h4>Please verify your email to continue...</h4>
                    <a href="http://${request.headers.host}/login/verifyUserEmail?userToken=${ourLoggedInUser.emailToken}" style="
                    text-decoration: none;
                    border: 1px solid black;
                    padding: 10px;
                    color: black;
                    ">Verify Email</a>
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


                }

                if (ourLoggedInUser){
                        if (!request.file) {
                            ourLoggedInUser.firstName = request.body.firstName || ourLoggedInUser.firstName,
                            ourLoggedInUser.lastName = request.body.lastName || ourLoggedInUser.lastName,
                            ourLoggedInUser.email = request.body.email || ourLoggedInUser.email,
                            ourLoggedInUser.bio = request.body.bio || ourLoggedInUser.bio,
                            ourLoggedInUser.profileFacebook = request.body.profileFacebook || ourLoggedInUser.profileFacebook,
                            ourLoggedInUser.profileTwitter = request.body.profileTwitter || ourLoggedInUser.profileTwitter,
                            ourLoggedInUser.profileLinkedin = request.body.profileLinkedin || ourLoggedInUser.profileLinkedin,
                            ourLoggedInUser.profileInstagram = request.body.profileInstagram || ourLoggedInUser.profileInstagram
                        }

                        else {  
                            ourLoggedInUser.imageLink = request.file.filename || ourLoggedInUser.imageLink
                        }
                        
                    
                        
                        const updatedUser = await ourLoggedInUser.save()

                //     const fileName = req.file.filename;
                //   const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

                    const newUser = {
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        email: updatedUser.email,
                        bio: updatedUser.bio,
                        imageLink: updatedUser.imageLink,
                        profileFacebook: updatedUser.profileFacebook,
                        profileTwitter: updatedUser.profileTwitter,
                        profileLinkedin: updatedUser.profileLinkedin,   
                        profileInstagram: updatedUser.profileInstagram
                    }

                    if(request.body.profileFacebook == ""){
                            ourLoggedInUser.profileFacebook = undefined;
                            delete ourLoggedInUser.profileFacebook;
                            await ourLoggedInUser.save()
                    }

                    if(request.body.profileTwitter == ""){
                        ourLoggedInUser.profileTwitter = undefined;
                        delete ourLoggedInUser.profileTwitter
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileLinkedin == ""){
                        ourLoggedInUser.profileLinkedin = undefined;
                        delete ourLoggedInUser.profileLinkedin
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileInstagram == ""){
                        ourLoggedInUser.profileInstagram = undefined;
                        delete ourLoggedInUser.profileInstagram
                        await ourLoggedInUser.save()
                    }

                    if(request.body.bio == ""){
                        ourLoggedInUser.bio = undefined;
                        delete ourLoggedInUser.bio
                        await ourLoggedInUser.save()
                    }

                    response.status(200).json({
                        "message": "User updated successfully!",
                        "ourUpdatedUser": newUser
                    })
                }

                else{
                    response.status(404).json({"message": "User not found!"})
                }
            }
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}

const forgotPassword = async(request, response) =>{
    try{
        const userEmail = await User.findOne({email: request.body.email})

        if (!userEmail) 
            return response.status(400).json({
                "invalidEmail": `User with email ${request.body.email} doesn't exist`
            })

        if(!userEmail.isVerified)
            return  response.status(400).json({
               "invalidEmail": "Please verify your email to continue"
           })
    
        // const secret = process.env.JWT_SECRET + userEmail.password;
        const userResetToken = Jwt.sign({userEmail} , process.env.JWT_SECRET)
        response.header("auth_token", userResetToken)
        console.log("databaseToken", userResetToken)
        const link = `http://localhost:5000/login/resetPassword/${userResetToken}`

        await userEmail.updateOne({
           resetToken: userResetToken
        })

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

         // Send verification email to user
         const mailOptions = {
            from: ' "Reset Password" <ndicunguyesteve4@gmail.com>',
            to: userEmail.email,
            
            subject: "University Social Network - Reset Password",
            html: `
            <div style="padding: 10px;">
                <h3> <span style="color: #414A4C;">${userEmail.firstName} ${userEmail.lastName}</span> Thank you for registering on our website! </h3> 
                <h4> Please verify your email to continue... </h4>
                <a style="border-radius: 5px; margin-bottom: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; background: #414A4C;" 
                href="http://localhost:5000/login/resetPassword?resetToken=${userResetToken}"> 
                Reset Password </a>
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
            }
        })

        response.status(200).json({
            "emailSuccess": "Email Sent successfully"
        })
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}


const resetPassword = async(request, response) =>{
    try{
        const token = request.query.resetToken;
        console.log("querryToken", token)
        const myUser = await User.findOne({resetToken: token})
        if(myUser){
            myUser.resetToken = null
            await myUser.save()
            response.redirect(process.env.RESET_PASSWORD_REDIRECT_URL)
        }

        else{
            console.log("Email not sent")
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

const newPassword = async(request, response) =>{
    try{

        const token = request.header("auth_token")
      
      if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{

            console.log(decodedToken)

            const resetLoggedInUser = await User.findById(decodedToken.userEmail._id)

        const salt = await bcrypt.genSalt()

        const hashedPassword = await bcrypt.hash(request.body.password, salt)

        const hashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, salt)

        await resetLoggedInUser.updateOne({
            password: hashedPassword,
            repeatPassword: hashedRepeatPassword
         })
  
         response.status(200).json({
            "emailSuccess": "Password reset successfully"
        })

            }

    })

    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

export default {loginUser, loggedInUser, updateUser, forgotPassword, resetPassword, newPassword}