var roleService = require("../../services/v1/roleService");
var roleServiceManager = new roleService.roleService();
var apiResponse = require("../../customModels/apiResponse");
var objResponse = new apiResponse.ApiResponse();

function roleApi(router) {
  var api = "/role";


  router.get(api, function (req, res, next) {
    var query = {};
    if (req.query != null && req.params) {
      if (req.query.id) {
        query.id = req.query.id;
      }
      if (req.params.id != null) {
        query.id = req.params.id;
      }
      if (req.query.name) {
        query.id = req.query.name;
      }
      if (req.query.active != null) {
        query.active = req.query.active;
      } else {
        query.active = 1;
      }
      roleServiceManager.findAllWithPagination(
        query,
        objResponse,
        function (error, response) {
          if (error) {
            next(new Error(error));
            objResponse.data = {};
            res.status(500).send(response);
          } else {
            res.status(200).send(response);
          }
        }
      );
    } else {
      res
        .status(405)
        .send(objResponse.getErrorResponse(null, "Invalid Request"));
    }
  });


  router.get(api + "/:id", function (req, res, next) {
    var query = {};
    if (req.params.id != null) {
      query.id = req.params.id;
    }
    if (req.query.active != null) {
      query.active = req.query.active;
    } else {
      query.active = 1;
    }
    roleServiceManager.findAllWithPagination(
      query,
      objResponse,
      function (error, response) {
        if (error) {
          next(new Error(error));
          objResponse.data = {};
          res.status(500).send(response);
        } else {
          res.status(200).send(response);
        }
      }
    );
  });

  router.post(api, function (req, res, next) {
    if (req.body.name != null && req.body.createdBy != null) {
      roleServiceManager.createRole(req.body, objResponse, function (
        error,
        response
      ) {
        if (error) {
          next(new Error(error));
          res.status(500).send(response);
        } else {
          res.status(200).send(response);
        }
      });
    } else {
      res
        .status(405)
        .send(objResponse.getErrorResponse(null, "Invalid Request"));
    }
  });

  router.put(api, function(req, res, next) {
    if (req.body.id != null) {
      roleServiceManager.updateRole(req.body, objResponse, function(
        error,
        response
      ) {
        if (error) {
          next(new Error(error));
          res.status(500).send(response);
        } else {
          res.status(200).send(response);
        }
      });
    } else {
      res
        .status(405)
        .send(objResponse.getErrorResponse(null, "Invalid Request"));
    }
  });

  router.delete(api + "/:id", function(req, res, next) {
    if (Object.keys(req.params) != 0 && req.params.id != null) {
      roleServiceManager.deleteRole(req.params.id, objResponse, function(
        error,
        response
      ) {
        if (error) {
          next(new Error(error));
          res.status(500).send(response);
        } else {
          res.status(200).send(response);
        }
      });
    } else {
      res
        .status(405)
        .send(objResponse.getErrorResponse(null, "Invalid Request"));
    }
  });


}

// export the class
module.exports = {
  roleApi
};
