/**
 * The entry point of the API services module.
 * @This will listen for client connection and process the request using various API module.
 */

'use strict';
require('events').EventEmitter.defaultMaxListeners = Infinity; 
var apiServerModule = require('./apiServer.js');
var apiServerInstance = new apiServerModule.apiServer();
apiServerInstance.start();
