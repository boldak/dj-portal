/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var express = require('express');

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  port: process.env.PORT || 8080,
  http: {
    middleware: {
      www: express.static('public', {
        maxAge: 20 * 60 * 1000 // 20 min and only in production
      })
    }
  },
  
  

  hookTimeout: 40000,

  // models: {
  //   connection: 'someMongodbServer'
  // }

  session:{
    url: "mongodb://127.0.0.1:27017/dj-sessions"
  },

  level: process.env.SAILS_LOG_LEVEL || "info"
};
