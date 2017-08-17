/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 1337,
  // port: 878,
  // realHost: "http://sfa2.wohlig.co.in",
  // realHost: "http://mumbaischool.sfanow.in",
  // realHost: "http://mumbaicollege.sfanow.in",
  // realHost: "http://hyderabadschool.sfanow.in",
  // realHost: "http://hyderabadcollege.sfanow.in",
  // realHost: "http://ahmedabadschool.sfanow.in",
  // realHost: "http://ahmedabadcollege.sfanow.in",
  realHost: "http://testmumbaischool.sfanow.in",
  // realHost: "http://testmumbaicollege.sfanow.in",
  // realHost: "http://testhyderabadschool.sfanow.in",
  // realHost: "http://testhyderabadcollege.sfanow.in",
  // realHost: "http://testahmedabadschool.sfanow.in",
  // realHost: "http://testahmedabadcollege.sfanow.in",

  // realHost: "https://sfa.wohlig.co.in",
  emails: ["chintan@wohlig.com", "jagruti@wohlig.com", "tushar@wohlig.com", "chirag@wohlig.com", "harsh@wohlig.com"]

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};