
var jwt = require('jsonwebtoken');
var fs = require('fs');


var apiResponse = require('../../customModels/apiResponse');
var authService = require("../../services/v1/authService"),
authServiceManager = new authService.AuthService();

var userService = require("../../services/v1/userService"),
userServiceManager = new userService.UserService();

var constants = require("../../utilities/constants");



function authApi(router) { 
   

  router.post("/login", function (req, res, next) {
    var objResponse = new apiResponse.ApiResponse();
    var query = '';
    if (req.body.username && req.body.password) {

      authServiceManager.validateUser(req, function (error, user) {
        if (error) {
          objResponse.data = {};
          next(new Error(error));
          res.status(500).send(objResponse.getErrorResponse(null, "Server error"));
        }
        //else if (user) {
        if (user.length) {
          var passwordIsValid;
          if (user[0].active == 0) {
            passwordIsValid = req.body.password == user[0].password;
            if (!passwordIsValid) {
              return res.status(401).send(objResponse.getErrorResponse("401", "Username or password is incorrect"));
            } else {
              objResponse.data = {
                userId: user[0].id,
                active: user[0].active,
              };
              return res.status(200).send(objResponse.getOkResponse());
            }
          }
          else {
             //var file = JSON.parse(fs.readFileSync('./auth/key.json', 'utf8'));
            var file = require('../../auth/key.json');
            var refresh_token = jwt.sign({ id: user[0].id }, file.refresh_key, {
              expiresIn: constants.JWT_REFRESH_TOKEN_EXPIRY_TIME // expires in 24 hours
            });

            var access_token = jwt.sign({ id: user[0].id }, file.access_key, {
              expiresIn: constants.JWT_ACCESS_TOKEN_EXPIRY_TIME // expires in 1 hours
            });
            

            objResponse.data = {};
            userServiceManager.getUserProfileNSettings({ id: user[0].id, roleId:user[0].roleId}, objResponse, function (error, response) {
              if (error) {
                return res.status(500).send(objResponse.getErrorResponse("500", "Server error"));
              } if (response) {                    
                response.data.refresh_token=refresh_token;
                response.data.access_token=access_token;
                res.status(200).send(response.getOkResponse());
              }
            });
          }
        }
        else {
          return res.status(401).send(objResponse.getErrorResponse("401", "Username or password is incorrect"));
        }
      });
    }
    else {
      next(new Error(error));
      res.status(500).send(objResponse.getErrorResponse("500", "Invalid Request"));
    }
  });

  router.post("/signup", function (req, res, next) {
    if (req.body.emailId || req.body.mobileNumber) {
      userServiceManager.createUser(req.body, apiResponse, function (error, response) {
        if (error) {
          next(new Error(error));
          res.status(500)
            .send(apiResponse.getErrorResponse(null, "Server error"));
        } else {
          res.status(200).send(apiResponse);
        }
      });
    } else {
      res
        .status(500)
        .send(apiResponse.getErrorResponse(null, "Invalid Request"));
    }
  });



  router.get('/validateToken', function (req, res, next) {
    var objResponse = new apiResponse.ApiResponse();
    var query = '';
    if (req.userId) {

      userServiceManager.findByfield({ id: req.userId }, objResponse, function (error, response) {
        if (error) {
          return res.status(500).send(objResponse.getErrorResponse("500", "Server error"));
        } if (response) {
            if (response.data.token == req.headers['x-refresh-token']) {
              objResponse = new apiResponse.ApiResponse();
              userServiceManager.getUserProfileNSettings({ id: response.data.id, roleId:response.data.roleId, }, objResponse, function (error, response) {
                if (error) {
                  return res.status(500).send(objResponse.getErrorResponse("500", "Server error"));
                } if (response) {                    
                  res.status(200).send(response.getOkResponse());
                }
              });
            } else {
              return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
            }
        }else {
          return res.status(401).send(objResponse.getErrorResponse("401", "Invalid User"));
        }
      });
    }
    else {
      //next(new Error(error));
      res.status(500).send(objResponse.getErrorResponse("500", "Invalid Request"));
    }
  });



  router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
  });


  router.post('/sendResetLink', function (req, res) {
    var objResponse = new apiResponse.ApiResponse();
    var query={};
    if (req.body.emailId && req.body.loginType) {
      query.emailId = req.body.emailId;
      query.loginType = req.body.loginType;
      userServiceManager.sendResetPasswordLink(query, objResponse, function (error, data) {
        if (error) {
          return res.status(500).send(objResponse.getErrorResponse("500", "Server error"));
        }
        if (data ) {             
          res.status(200).send(data.getOkResponse());
        }
      });
    }
    else {
      next(new Error(error));
      res.status(500).send(objResponse.getErrorResponse("500", "Invalid Request"));
    }
  });



    
  router.post('/resetpassword', function (req, res, next) {
    var objResponse = new apiResponse.ApiResponse();
    var query={};
    if (req.body.userId && req.body.otp && req.body.password) {
      query.userId=req.body.userId;
      query.password=req.body.password;
      query.otp=req.body.otp;
      userServiceManager.resetPassword(query, objResponse, function (error, data) {
        if (error) {
          return res.status(500).send(objResponse.getErrorResponse("500", "Server error"));
        }
        if (data ) {             
          res.status(200).send(data.getOkResponse());
        }
      });
    }
    else {
      res.status(500).send(objResponse.getErrorResponse("500", "Invalid Request"));
    }
  });


}


// export the class
module.exports =
  {
    authApi
  };


