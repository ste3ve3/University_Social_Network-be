import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"


const loginUser = async(request, response) =>{
    try{
        const userEmail = await User.findOne({email: request.body.email})

        if (!userEmail) 
            return response.status(400).json({
                "invalidEmail": "Invalid email or password, Please try again"
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

                if (ourLoggedInUser){
                    ourLoggedInUser.firstName = request.body.firstName || ourLoggedInUser.firstName,
                    ourLoggedInUser.lastName = request.body.lastName || ourLoggedInUser.lastName,
                    ourLoggedInUser.email = request.body.email || ourLoggedInUser.email,
                    ourLoggedInUser.bio = request.body.bio || ourLoggedInUser.bio,
                    ourLoggedInUser.imageLink = request.body.imageLink || ourLoggedInUser.imageLink,
                    ourLoggedInUser.profileFacebook = request.body.profileFacebook || ourLoggedInUser.profileFacebook,
                    ourLoggedInUser.profileTwitter = request.body.profileTwitter || ourLoggedInUser.profileTwitter,
                    ourLoggedInUser.profileLinkedin = request.body.profileLinkedin || ourLoggedInUser.profileLinkedin,
                    ourLoggedInUser.profileInstagram = request.body.profileInstagram || ourLoggedInUser.profileInstagram

                    const updatedUser = await ourLoggedInUser.save()

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


export default {loginUser, loggedInUser, updateUser}