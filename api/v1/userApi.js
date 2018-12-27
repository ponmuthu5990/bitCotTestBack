"use strict";

var responseModule = require("../../customModels/apiResponse");
var apiResponse = new responseModule.ApiResponse();

var userServiceObject = require("../../services/v1/userService");
var userService = new userServiceObject.UserService();

function userDetailsApi(router) {
  let userApi = "/user";

 
  router.get(userApi, function (req, res, next) {
    var query = {};
    if (req.query != null) {
      if (req.query.id) {
        query.id = req.query.id;
      }
      if (req.query.roleId) {
        query.roleId = req.query.roleId;
      }
      if (req.query.active != null) {
        query.active = req.query.active;
      } else {
        query.active = 1;
      }
      userService.findAllWithPagination(
        query,
        req.query.offset,
        req.query.size,
        apiResponse,
        function (error, items) {
          if (error) {
            apiResponse.data = {};
            next(new Error(error));
            res.status(500)
              .send(apiResponse.getErrorResponse(null, "user list not found"));
          } else if (apiResponse) {
            res.status(200).send(apiResponse.getOkResponse());
          }
        }
      );
    } else {
      res
        .status(500)
        .send(apiResponse.getErrorResponse(null, "Invalid Request"));
    }
  });

  router.post(userApi, function (req, res, next) {
    if (req.body.emailId || req.body.mobileNumber) {
      userService.createUser(req.body, apiResponse, function (error, response) {
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


  router.put(userApi, function (req, res, next) {       
          var userId = parseInt(req.body.id);
          userService.update(req.body, userId, apiResponse, function (error, response) {
            if (error) {
              next(new Error(error));
              res.status(500)
                .send(apiResponse.getErrorResponse(null, "Server error"));
            } else {
              res.data = response;
              res.status(200).send(apiResponse.getOkResponse());
            }
          });
       
  });

  router.delete(userApi + "/:id", function (req, res, next) {
    if (req.params.id) {
      userService.deleteUser({ id: req.params.id }, apiResponse, function (
        error,
        response
      ) {
        if (error) {
          next(new Error(error));
          res
            .status(500)
            .send(apiResponse.getErrorResponse(null, "Server error"));
        } else {
          res.data = response;
          res.status(200).send(apiResponse.getOkResponse());
        }
      });
    } else {
      res
        .status(405)
        .send(apiResponse.getIncorrectDataResponse());
    }
  });

}

// export the class
module.exports = {
  userDetailsApi
};
