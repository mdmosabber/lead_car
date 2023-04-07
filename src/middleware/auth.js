const errorMiddleware = require('../middleware/errorMiddleware');
const jwt = require('jsonwebtoken');


const authVerify = async(req, res, next)=>{
    try{
        const key = req.cookies.token;
        if(!key){
            res.status(401);
            throw new Error("Not authorized, please login");
        }

        const verified = jwt.verify(key, process.env.JWT_SECRET);

        req.auth = verified;
        next();

    }catch(error){        
        errorMiddleware(error, req, res)
    }
}

module.exports = authVerify;