const { HttpError } = require("../models/http-error")
const jwt = require('jsonwebtoken');

const checkAuth = (req,res,next) => {
    if(req.method == "OPTIONS") {
        return next()
    }
    // req.headers["authorization"] = Authorization : "Bearer Token"
    /*
       if you try to split something that is not defined, it crashes the application
       So try catching split
    */ 
    try {
        const token = req.headers["authorization"].split(" ")[1]
        if(!token) {
            /* Will initiate catch Block */
            throw new Error()
        }
        const decodedToken = jwt.verify(token,`${process.env.TOKEN_SECRET}`)
        req.userData = {userId : decodedToken.userId}
        next()
    } catch(err) {
        return next(new HttpError("Invalid Token", 403))
    }
}

module.exports = checkAuth;