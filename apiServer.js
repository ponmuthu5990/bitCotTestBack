/**
 * The entry point of the API services module.
 * @This will listen for client connection and process the request using various API module.
 */

"use strict";
var serverPort = 3000;

var cCPUs = require("os").cpus().length;
var app = new require("express")();

var router = require("express").Router();

var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var debug = require("debug")("expressdebug:*");


var VerifyToken = require("./auth/verifyToken");


var https = require("https"),
  http = require("http");

  router.use(bodyParser.json());
router.use(bodyParser.urlencoded());


var cluster = require("cluster");

var originsWhitelist = [
  "http://localhost:3000","http://localhost:4200"
];
var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
};
//here is the magic
app.use(cors(corsOptions));

router.use(function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

 router.use(VerifyToken,function(req, res, next) {
   next();
 }); 


router.use(function (err, req, res, next) {
  res.status(500).send("Something broke!");
});





function apiServer() {
  this.start = function () {
    if (cluster.isMaster) {
     
      for (var i = 0; i < cCPUs; i = i + 1) {
        cluster.fork();
      }
      cluster.on("online", function (worker) { });
      cluster.on("exit", function (worker, code, signal) { });
    } else {
      
      // ==================================================
     
      require('./api/v1/authApi').authApi(router);
      require('./api/v1/userApi').userDetailsApi(router);
      require("./api/v1/roleApi").roleApi(router);

      app.use("/bitCotWs/v1", router);
      //============================================================
      
     
    

      var port = parseInt(serverPort, 10),
        httpsPort = parseInt(serverPort, 10);

      var httpServer = http.createServer(app).listen(port, function () {
        var host = httpServer.address().address;
        var port = httpServer.address().port;
      });

     
      process.on("SIGINT", function () {
        setTimeout(function () {
          httpServer.close(function () {
            process.exit();
          });
        }, 3000);
      });

    }
  };
}

// export the class
module.exports = {
  apiServer
};
