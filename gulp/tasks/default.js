/**
 *	default.js
 * 	==========
 *	The main gulp tasks are listed below, you probably don't need
 *	to run any others.
 **/

var gulp = require('gulp');

gulp.task('default', [ 'build', 'watch' ]);
gulp.task('build', [ 'sass', 'moveImages', 'jshint', 'jade', 'browserify' ]);
