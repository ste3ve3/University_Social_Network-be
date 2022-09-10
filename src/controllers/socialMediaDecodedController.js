import Jwt from "jsonwebtoken"
import sessionStorage from "node-sessionstorage"


const socialMediaLoggedInUser = async(request, response) =>{
    try{
      const token = sessionStorage.getItem("set_token")
      
      if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                console.log(decodedToken)
                response.status(200).json(decodedToken)
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



const socialMediaLogoutUser = async(request, response) =>{
    try{
      sessionStorage.removeItem("set_token")
      response.status(200).json({
        "message": "You are successfully logged out!"
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


export default{socialMediaLoggedInUser, socialMediaLogoutUser}