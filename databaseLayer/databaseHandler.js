"use strict";
var MODELS = require("../models/index");

function DatabaseHandler() {

  this.getFilteredData = function (collectionName, condition) {
    var collection = MODELS[collectionName];
    return collection.findAll({ where: [condition] });
  };

  this.insertData = function (collectionObject, collectionName, trnsctn) {
    var collection = MODELS[collectionName];
    return collection.create(collectionObject, { transaction: trnsctn });
  };
  
  //Update without transaction
  this.updateData = function (collectionObject, collectionName, condition) {
    var collection = MODELS[collectionName];
    return collection.update(
      collectionObject,
      { where: condition, plain: true }
    );
  };

  this.uniqueFieldCheck = function (collectionName, condition) {
    var collection = MODELS[collectionName];
    return collection.count({
      where: [condition],
      limit: 1
    });
  };
 
  this.deactivateWithoutTrans = function (collectionName, condition) {
    var collection = MODELS[collectionName];
    return collection.update(
      { active: 0 },
      {
        where: condition,
        returning: true
      }
    );
  };


  this.deactivate = function (collectionName, condition) {
    var collection = MODELS[collectionName];
    return collection.update(
      { active: 0, updatedDate: new Date() },
      {
        where: condition,
        returning: true,
        plain: true,
      }
    );
  };


}

module.exports = {
  DatabaseHandler
};
