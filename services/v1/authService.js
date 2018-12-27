var userController = require('../../controller/userController')
userCrud = new userController.UserController();
var index = require("../../models/index");

function AuthService() {
    this.validateUser = function (req, callback) {
        var condition = {
          active: {
            [index.sequelize.Op.in]: [1]
          },
          [index.sequelize.Op.or]: [
            { emailId: { [index.sequelize.Op.eq]: req.body.username } },
            { mobileNumber: { [index.sequelize.Op.eq]: req.body.username } }
          ]
        }     
       
        userCrud.findByfield(condition)  
        .then(function(data) {
          callback(null, data);
        })
        .catch(function(error) {
          callback(error, null);
        });
      };


      this.validateUserByIdNToken = function (req, callback) {
        var condition = {
          active: {
            [index.sequelize.Op.in]: [0, 1, 3]
          },
          id: { [index.sequelize.Op.eq]: req.id },
          token: { [index.sequelize.Op.eq]: req.token }
        }      
         
        userCrud.findByfield(condition)  
        .then(function(data) {
          callback(null, data);
        })
        .catch(function(error) {
          callback(error, null);
        });
      };

      this.updateToken = function (user, callback) {
        userCrud.update(user,{id:user.id,active:1})
        .then(function(data) {
          callback(null, data);
        })
        .catch(function(error) {
          callback(error, null);
        });
      };
}
module.exports =
  {
    AuthService
  };