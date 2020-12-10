/**
 * Gruntfile
 *
 * This Node script is executed when you run `grunt`-- and also when
 * you run `sails lift` (provided the grunt hook is installed and
 * hasn't been disabled).
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Check out the `tasks/` directory instead.
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/Gruntfile.js
 */
module.exports = function (grunt) {

  try {
    var loadGruntTasks = require('include-all');
    loadGruntTasks(__dirname, grunt);
  } catch (e1) {
    console.error('Could not find `include-all` module.');
    console.error('Skipping grunt tasks...');
    console.error('To fix this, please run:');
    console.error('npm install include-all --save`');
    console.error();

    grunt.registerTask('default', []);
    return;
  }

  // Load Grunt task configurations (from `tasks/config/`) and Grunt
  // task registrations (from `tasks/register/`).

};
