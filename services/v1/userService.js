(function () {
  var index = require("../../models/index");
  var userController = require("../../controller/userController"),
    userControllerObj = new userController.UserController(); 
  var constants = require("../../utilities/constants");

  function UserService() {
    this.findAllWithPagination = function (query, offset, limit, apiResponse, callback) {
      if(query.roleId === undefined){
        query.roleId = {
          [index.sequelize.Op.ne]: constants.SUPERADMIN_USER_ROLE
        };
      }    
        userControllerObj
          .getFilteredData(query) // get user basic data with query
          .then(function (response) {
            apiResponse.status = true;
            apiResponse.data = response;
            callback(null, apiResponse);
          })
          .catch(function (err) {
            callback(err, null);
          });
      
    };


    //to save user details
    this.createUser = function (user, apiResponse, callback) {
      return index.sequelize
        .transaction(function (trnsctn) {
         
          user.active = constants.STATUS_OF_ACTIVE_USER;
        
          return userControllerObj
            .create(user, trnsctn)
            .then(function (userResponse) {
              user.id = userResponse.id;
            });
        })
        .then(function (response) {
          apiResponse.status = true;
          apiResponse.message = "Successfully saved";
          callback(null, apiResponse);
        })
        .catch(function (err) {
          if (err.name == "SequelizeUniqueConstraintError") {
            var msg = err.errors[0].message;
            if (msg.startsWith("username")) {
              apiResponse.status = false;
              apiResponse.message = "User Id already exist";
              apiResponse.data = {};
              callback(null, apiResponse);
            } else if (msg.startsWith("emailId")) {
              apiResponse.status = false;
              apiResponse.message = "Email Id already exist";
              apiResponse.data = {};
              callback(null, apiResponse);
            } else if (msg.startsWith("phoneNumber")) {
              apiResponse.status = false;
              apiResponse.message = "Phone number already exist";
              apiResponse.data = {};
              callback(null, apiResponse);
            } else {
              callback(err, null);
            }
          } else {
            callback(err, null);
          }
        });
    };

    this.hasActiveUsersInRole = function (roleId) {
      return userControllerObj.getActiveUserUnderRole(
        { roleId: roleId, active: 1 }
    
      );
    };

    this.getUserProfileNSettings = function (queryParams, apiResponse, callback) {
      var user = {};
      return userControllerObj
        .getFilteredData(queryParams)
        .then(function (response) {
          if (response.length != 0) {
            user = {};
            user.userId = response[0].id;
            //username: data[0].username,
            user.emailId = response[0].emailId;
            user.roleId = response[0].roleId;
            user.mobileNumber = response[0].mobileNumber;
            user.active = response[0].active;
            apiResponse.status = true;
            apiResponse.message = "";
            apiResponse.data = user;
            callback(null, apiResponse);
            return Promise.resolve();
          } else {
            apiResponse.status = false;
            apiResponse.message = "Please contact administrator";
            apiResponse.data = {};
            callback(null, apiResponse);
            return Promise.resolve();
          }
        })
    }


    this.update = function (userObject, userId, apiResponse, callback) {
        return index.sequelize.transaction(function (trnsctn) {
       
              return userControllerObj
                .update(userObject, { id: userId }, trnsctn)           
              .then(function () {
              apiResponse.status = true;
              apiResponse.message = "Success";
              apiResponse.data = userObject;
              callback(null, apiResponse);
            })
            .catch(function (error) {
              if (error.errors) {
                var msg = error.errors[0].message;
                if (msg.startsWith("userName")) {
                  apiResponse.status = false;
                  apiResponse.message = "UserID already exist";
                  apiResponse.data = {};
                  callback(null, apiResponse);
                } else if (msg.startsWith("emailId")) {
                  apiResponse.status = false;
                  apiResponse.message = "Email address is already exist";
                  apiResponse.data = {};
                  callback(null, apiResponse);
                } else if (msg.startsWith("mobileNumber")) {
                  apiResponse.status = false;
                  apiResponse.message = "Phone number is already exist";
                  apiResponse.data = {};
                  callback(null, apiResponse);
                } else if (msg.startsWith("Query was empty")) {
                  apiResponse.status = false;
                  apiResponse.message = "there is no changes to update";
                  apiResponse.data = {};
                  callback(null, apiResponse);
                } else {
                  apiResponse.status = false;
                  apiResponse.message = "failed";
                  apiResponse.data = {};
                  callback(error, apiResponse);
                }
              } else {
                apiResponse.status = false;
                apiResponse.message = "failed";
                apiResponse.data = {};
                callback(error, apiResponse);
              }
            });
        });
      
    };

    this.deleteUser = function (condition, apiResponse, callback) {
      return index.sequelize.transaction(function (trnsctn) {
        return userControllerObj
          .delete({ active: constants.STATUS_OF_DELETED_USER }, condition, trnsctn)
          .then(function (result) {
            apiResponse.status = true;
            apiResponse.message = "Success";
            apiResponse.data = condition;
            callback(null, apiResponse);
          })
          .catch(function (error) {
            apiResponse.status = false;
            apiResponse.message = "failed";
            apiResponse.data = {};
            callback(error, apiResponse);
          });
      });
    };
  
  };

  // export the class
  module.exports = {
    UserService
  };



})();

