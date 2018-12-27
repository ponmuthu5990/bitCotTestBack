

(function () {
  "use strict";
  var index = require("../models/index");
  var dbHandler = require("../databaseLayer/databaseHandler"),
    userHandler = new dbHandler.DatabaseHandler();
  var constants = require("../utilities/constants");
  let tableName = "tbl_user";

  function UserController() {
    this.create = function (user, trnsctn) {
      return userHandler.insertData(user, tableName, trnsctn);
    };

    this.update = function (updateFeild, condition, transaction) {
      return userHandler.updateData(
        updateFeild,
        tableName,
        condition,
        transaction
      );
    };

    this.getActiveUserUnderRole = function (condition) {
      return userHandler.uniqueFieldCheck(tableName, condition);
    };   

    this.getFilteredData = function(queryConditions) {
      return userHandler.getFilteredData(tableName, queryConditions);
    };

    this.findByfield = function (condition) {
      return userHandler.getFilteredData(tableName, condition);
    };
       
    this.delete = function (data, condition, transaction) {
      return userHandler.updateData(
        data,
        tableName,
        condition,
        transaction
      );
    };


  }
  module.exports = {
    UserController
  };


})();