require("dotenv").config();
const jwt = require("jsonwebtoken");

function authMiddleware(secret_key){
return function(req, res, next){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            message : "No Token provided"
        });
    }


    try{
        const decoded = jwt.verify(token, secret_key);
        req.userId = decoded.id;
        next();
    }
    catch(err){
        return res.status(401).json({
            message : "Invalid Token"
        });
    }
}
}

module.exports = {
    authMiddleware: authMiddleware}