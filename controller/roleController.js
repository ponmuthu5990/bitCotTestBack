(function() {
  "use strict";
  const databaseHandler = require("../databaseLayer/databaseHandler"),
    roleHandler = new databaseHandler.DatabaseHandler();
  const tableName = "tbl_role";
  function roleController() {
    this.create = function(role, trnsctn) {
      return roleHandler.insertData(role, tableName, trnsctn);
    };
    this.update = function(role, trnsctn) {
      return roleHandler.updateData(
        role,
        tableName,
        { id: role.id },
        trnsctn
      );
    };

    this.deactivate = function(id) {
     return roleHandler.deactivate(tableName, { id: id });
    };

    this.getFilteredData = function(queryConditions) {
      return roleHandler.getFilteredData(tableName, queryConditions);
    };


  }

  module.exports = { roleController };
})();
