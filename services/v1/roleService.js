const controller = require("../../controller/roleController"),
  controllerObj = new controller.roleController();
const userService = require("../../services/v1/userService"),
  userServiceManager = new userService.UserService();
const index = require("../../models/index");
var constants = require("../../utilities/constants");

function roleService() {
 
  
  this.findAllWithPagination = function(query, apiResponse, callback ) {
    return index.sequelize
      .transaction(function(trnsctn) {
        query.id = {
            [index.sequelize.Op.ne]: constants.SUPERADMIN_USER_ROLE
          };
        return controllerObj.getFilteredData(query); // get active role details
      })
      .then(function(response) {
        if (response.length == 0) {
          apiResponse.status = false;
          apiResponse.message = "Roles not found.";
        } else {
          apiResponse.status = true;
          apiResponse.message = "Role Details";
        }
        apiResponse.data = response;
        callback(null, apiResponse);
      })
      .catch(function(err) {
        callback(err, null);
      });
  };
 
  this.createRole = function (roleModel, apiResponse, callback) {
    return index.sequelize
      .transaction(function (trnsctn) {
        roleModel.updatedBy = roleModel.createdBy;
        return controllerObj.create(roleModel, trnsctn);      // save role
      })
      .then(function (response) {
        apiResponse.status = true;
        apiResponse.message = "Successfully saved";
        apiResponse.data = response;
        callback(null, apiResponse);
      })
      .catch(function (err) {
        console.log(err);
        if (err.name == "SequelizeUniqueConstraintError") {
          var msg = err.errors[0].message;
          if (msg.startsWith("name")) {
            return controllerObj
              .getFilteredDataPagination({ name: roleModel.name}, 0, 1) // check if role name already exists.
              .then(function (response) {
                if (response.length != 0) {
                  if(response[0].active == 1){
                    apiResponse.status = false;
                    apiResponse.message = "Role name is already exist";
                    apiResponse.data = {};
                    callback(null, apiResponse);
                  }else{
                    roleModel.id = response[0].id;
                    roleModel.active = 1;                 
                    return index.sequelize
                    .transaction(function (trnsctn) {
                    return controllerObj.update(roleModel, trnsctn) // update role
                    .then(function (result) {
                      apiResponse.status = true;
                      apiResponse.message = "Successfully saved";
                      apiResponse.data = response;
                      callback(null, apiResponse);
                    });
                  });

                  }
                } else {
                  apiResponse.status = false;
                  apiResponse.message = "Updation failed.";
                  apiResponse.data = {};
                  callback(null, apiResponse);
                }
              });

          } else {
            callback(err, null);
          }
        } else if (err.message)  {
          callback(null, err)
        }
        else{
          callback(err, null);
        }
      });
  };


  this.updateRole = function(roleModel, apiResponse, callback) {
    return index.sequelize
    .transaction(function(trnsctn) {
      return controllerObj.getFilteredData({name:roleModel.name}, trnsctn)
      .then(function(response){
        if(response.length==0){
      //saving user basic data
      return controllerObj.update(roleModel, trnsctn)
        .then(function(result){
          apiResponse.status = true;
          apiResponse.message = "Successfully saved";
          apiResponse.data = roleModel;
          return Promise.resolve(apiResponse);  
        }).catch(function (err) {
          callback(err, null);
        });
        } else {
          if(response[0].active == 1){
          apiResponse.status = false;
          apiResponse.message = "Role name is already exist";
          apiResponse.data = roleModel;
          return Promise.resolve(apiResponse);  
          } else {
            apiResponse.status = false;
            apiResponse.errorCode = constants.CONFIRMATION_CODE;
            apiResponse.message = "Role name "+response[0].name+" is already exist and is in active.";
            apiResponse.data = response[0];
            return Promise.resolve(apiResponse);  
          }
        }
      })
    })
    .then(function(response) {      
      callback(null, response);
    })
      .catch(function(err) {
        // for handling Unique field error
        if (err.name == "SequelizeUniqueConstraintError") {
          var msg = err.errors[0].message;
          if (msg.startsWith("name")) {
            apiResponse.status = false;
            apiResponse.message = "Role name is already exist";
            apiResponse.data = {};
            callback(null, apiResponse);
          } else {
            callback(error, null);
          }
        } else {
          callback(err, null);
        }
      });
  };

  this.deleteRole = function(id, apiResponse, callback) {
    return index.sequelize.transaction(function(trnsctn) {
      return userServiceManager
        .hasActiveUsersInRole(id)
        .then(function(count) {
          if (count== 0) {
            return controllerObj
              .deactivate(id)
              .then(function(response) {
                if (response[1] > 0) {
                  apiResponse.status = true;
                  apiResponse.message = "Deleted Successfully";
                  apiResponse.data = { id: id };
                  callback(null, apiResponse);
                } else {
                  apiResponse.status = false;
                  apiResponse.message = "Deletion failed. Role not found.";
                }                
                callback(null, apiResponse);
              })
              .catch(function(err) {
                callback(err, null);
              });
          } else {
            apiResponse.status = false;
            apiResponse.message = "Deletion failed. Role has active users.";
            apiResponse.data = { id: id };
            callback(null, apiResponse);
          }
        });
    });
  };

}
module.exports = { roleService };
