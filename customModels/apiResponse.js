/**
 * Responsible for creatring the response json data.
 */

/**
 * Represents a UserResponse.
 * @constructor
 */

"use strict";
function ApiResponse() {
  this.status = true;
  this.errorCode = 0;
  this.error = {};
  this.message = "";
  this.data = null;

  /**
   * The function used to get the success json response data .
   */
  this.getOkResponse = function() {
    return this.toJsonString();
  };

  /**
   * The function used to get the error json response data .
   * @param {string} errorCode - error code value .
   * @param {string} errMsg - error message string.
   */
  this.getErrorResponse = function(errorCode, errMsg) {
    this.status = false;
    this.errorCode = errorCode;
    this.message = errMsg;
    this.data = null;
    return this.toJsonString();
  };

  this.getIncorrectDataResponse = function() {
    this.status = false;
    this.message = "Incorrect data";
    this.data = null;
    return this.toJsonString();
  };

  this.getServerError = function() {
    this.status = false;
    this.message = "Server Error";
    this.data = null;
    return this.toJsonString();
  };

  /**
   * The function used to convert  the data into json string .
   */
  this.toJsonString = function() {
    return JSON.stringify(this);
  };

  this.sendResponse = function(responseSender, responseObject, error) {
    if (error) responseSender.status(500);
    else responseSender.status(200);
    responseSender.json(responseObject);
  };
}

// export the class
module.exports = { ApiResponse };
