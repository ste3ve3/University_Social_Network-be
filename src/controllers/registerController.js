import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import UserValidationSchema from "../middlewares/registerValidation.js"


const createNewUser = async(request, response) =>{

    const {error} = UserValidationSchema.validate(request.body)

    if (error)
        return response.status(400).json({"validationError": error.details[0].message})


    const duplicatedEmail = await User.findOne({email: request.body.email})

    if (duplicatedEmail)
        return response.status(409).json({"message": `The user with email "${request.body.email}" already exist`})

    try{
        const salt = await bcrypt.genSalt()

        const hashedPassword = await bcrypt.hash(request.body.password, salt)

        const hashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, salt)
        

        await User.create({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hashedPassword,
            repeatPassword: hashedRepeatPassword
        })

        response.status(201).json({"successMessage": `The new user "${request.body.email}" is created successfully!`})
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
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

export default {createNewUser, getAllUsers}