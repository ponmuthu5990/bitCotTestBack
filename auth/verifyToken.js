var jwt = require('jsonwebtoken');
var fs = require('fs');

var file = require('../auth/key.json');
var constants = require("../utilities/constants");
var authService=require("../services/v1/authService");
authServiceManager=new authService.AuthService();
function verifyToken(req, res, next) {
  console.log("Request:"+req.url);
  
   if(constants.JWT_BYPASS_URLS.indexOf(req.path) == -1 ){
   
    var token = req.headers['x-access-token'];

    if ((!token)){
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    }else{    
    jwt.verify(token, file.access_key, function(err, decoded) {
      if (err){
        if(err.name=="TokenExpiredError"){
            verifyRefreshToken(req,res,function (err, user){
              if(err) {
                return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
              }
              if(user.length){
                console.log("user:   "+user[0]);
                var access_token = jwt.sign({ id: user[0].id }, file.access_key, {
                  expiresIn: constants.JWT_ACCESS_TOKEN_EXPIRY_TIME // expires in 1 hours
                });
                res.set("Access-Control-Expose-Headers","x-access-token");
                res.setHeader("x-access-token",access_token);
                req.userId = user[0].id;
                next();
              }else{
               res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });                
              }
              
            });
        }else{
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }          
        
      }else{
        req.userId = decoded.id;       
        next();
      }
    });
  }
     
   }else
      next();
}

function verifyRefreshToken(req,res,callback) {
  var token = req.headers['x-refresh-token'];
  if (!token){
   return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
    
  
  jwt.verify(token, file.refresh_key, function(err, decoded) {
    if (err){
     return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.id = decoded.id;
    req.token = token;
    next();
  });  
}




module.exports = verifyToken ;