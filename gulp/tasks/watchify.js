/**
 *	watchify.js
 *	===========
 *	Utilizing watchify instead of watch for browserify bundling
 **/

var gulp 			= require('gulp'),
	browserifyTask	= require('./browserify');

gulp.task('watchify', function () {
	/* Start browserify task with devMode === true */
	return browserifyTask(true);
});
