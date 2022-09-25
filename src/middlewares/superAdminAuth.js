import jwt from 'jsonwebtoken';

const authSuperAdmin = (request, response, next) => {
    try {
        const token = request.header("auth_token")
      
        if(!token)
          return response.status(401).json({
              "message": "Please login!"
          })
  
          const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
            console.log(decodedToken)

            if(decodedToken.userEmail.role != 'super admin')
            return response.status(401).json({
                "unauthorisedError": 'Access Denied, you are not allowed to peform this action!'
            });
                


        next();

    } catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }

}


export default {authSuperAdmin}
