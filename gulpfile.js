/**
 *	gulpfile.js
 *	===========
 *	This is an unconventional gulpfile, it recursively registers gulp
 *	tasks in the ./gulp/tasks folder. This is to prevent an insanely long
 *	gulpfile. Task files should fit in a standard 24x80 terminal window.
 **/

var requireDir = require('require-dir');

requireDir('./gulp/tasks', { recurse: true });
