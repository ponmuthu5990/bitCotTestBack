

'use strict';

const Constants = {

  // LOGDIR_UNIX: "C:logs", //ponnu
  STATUS_OF_ACTIVE_USER: 1,
  STATUS_OF_DELETED_USER: 0,

  SUPERADMIN_USER_ROLE: 1,
  ADMIN_USER_ROLE: 2,
  STUDENT_USER_ROLE: 3,

  //JWT Token Expiry in seconds
  JWT_ACCESS_TOKEN_EXPIRY_TIME: 1200,
  JWT_REFRESH_TOKEN_EXPIRY_TIME: 84100,

  JWT_BYPASS_URLS: ['/login', '/refreshToken', '/signin', '/signup'],

};

module.exports = Constants;