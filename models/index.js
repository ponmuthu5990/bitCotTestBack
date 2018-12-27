  "use strict";

var fs = require("fs");
var path = require("path");
const Sequelize = require("sequelize");
var useTransaction = require("sequelize-transactions");
var basename = path.basename(module.filename);
var db = {};

var sequelize = new Sequelize( {
  database: 'test',
  username: 'root',
  password: 'root',
  dialect: 'mysql',
  host: "127.0.0.1",
  operatorsAliases: false,
  timezone: "+05:30",
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
useTransaction(sequelize);
 
sequelize.authenticate()
  .then(function (err) {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });


fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.startsWith("Trace_")
    );
  })
  .forEach(function (file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

db.sequelize = sequelize;

module.exports = db;
