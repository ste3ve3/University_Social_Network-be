import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import newPasswordValidationSchema from "../middlewares/newPasswordValidation.js"


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
            "successMessage": "Logged in successfully!", "Access_Token": token, "role": userRole
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


const guestUser = async(request, response) =>{
    try{
        const userEmail = new User()

        userEmail.firstName = request.body.firstName
        userEmail.lastName = request.body.lastName
        userEmail.email = request.body.email
        userEmail.password = request.body.password
        userEmail.repeatPassword = request.body.repeatPassword

        await userEmail.save()        

        const token = Jwt.sign({userEmail} , process.env.ACCESS_TOKEN_SECRET)
        response.header("auth_token", token)

        response.set("token", token).json({
            "successMessage": "Logged in successfully!", "Access_Token": token
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

                if (ourLoggedInUser){
                    
                        if (!request.file) {
                            ourLoggedInUser.firstName = request.body.firstName || ourLoggedInUser.firstName,
                            ourLoggedInUser.lastName = request.body.lastName || ourLoggedInUser.lastName,
                            ourLoggedInUser.email = request.body.email || ourLoggedInUser.email,
                            ourLoggedInUser.bio = request.body.bio || ourLoggedInUser.bio,
                            ourLoggedInUser.faculty = request.body.faculty || ourLoggedInUser.faculty,
                            ourLoggedInUser.department = request.body.department || ourLoggedInUser.department,
                            ourLoggedInUser.regNumber = request.body.regNumber || ourLoggedInUser.regNumber,
                            ourLoggedInUser.yearOfStudy = request.body.yearOfStudy || ourLoggedInUser.yearOfStudy,
                            ourLoggedInUser.dateOfBirth = request.body.dateOfBirth || ourLoggedInUser.dateOfBirth,
                            ourLoggedInUser.phoneNumber = request.body.phoneNumber || ourLoggedInUser.phoneNumber
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
                        faculty: updatedUser.faculty,
                        department: updatedUser.department,
                        regNumber: updatedUser.regNumber,   
                        dateOfBirth: updatedUser.dateOfBirth,   
                        phoneNumber: updatedUser.phoneNumber,   
                        transcript: updatedUser.transcript,   
                        yearOfStudy: updatedUser.yearOfStudy
                    }

                    if(request.body.department == ""){
                            ourLoggedInUser.department = undefined;
                            delete ourLoggedInUser.department;
                            await ourLoggedInUser.save()
                    }

                    if(request.body.regNumber == ""){
                        ourLoggedInUser.regNumber = undefined;
                        delete ourLoggedInUser.regNumber
                        await ourLoggedInUser.save()
                    }

                    if(request.body.dateOfBirth == ""){
                        ourLoggedInUser.dateOfBirth = undefined;
                        delete ourLoggedInUser.dateOfBirth
                        await ourLoggedInUser.save()
                    }

                    if(request.body.phoneNumber == ""){
                        ourLoggedInUser.phoneNumber = undefined;
                        delete ourLoggedInUser.phoneNumber
                        await ourLoggedInUser.save()
                    }

                    if(request.body.yearOfStudy == ""){
                        ourLoggedInUser.yearOfStudy = undefined;
                        delete ourLoggedInUser.yearOfStudy
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
    
        const userResetToken = Jwt.sign({userEmail} , process.env.JWT_SECRET)
        response.header("auth_token", userResetToken)
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
                <h3> <span style="color: #414A4C;">${userEmail.firstName} ${userEmail.lastName}</span> I see you have forgot your password! </h3> 
                <h4> Please click on reset password to continue... </h4>
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
                response.status(200).json({
                    "emailSuccess": "Email sent, check your account to reset your password",
                    "resetToken": userResetToken
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


const resetPassword = async(request, response) =>{
    try{
        const token = request.query.resetToken;
        const myUser = await User.findOne({resetToken: token})
        if(myUser){
            myUser.resetToken = null
            await myUser.save()
            response.redirect(process.env.RESET_PASSWORD_REDIRECT_URL)
        }

        else{
            console.log("Password not reset")
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
    const {error} = newPasswordValidationSchema.validate(request.body)

    if (error)
        return response.status(400).json({"validationError": error.details[0].message})
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
        const resetLoggedInUser = await User.findById(decodedToken.userEmail._id)

        const salt = await bcrypt.genSalt()

        const newHashedPassword = await bcrypt.hash(request.body.password, salt)

        const newHashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, salt)

        await resetLoggedInUser.updateOne({
            password: newHashedPassword,
            repeatPassword: newHashedRepeatPassword
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

export default {loginUser, loggedInUser, updateUser, forgotPassword, resetPassword, newPassword, guestUser}