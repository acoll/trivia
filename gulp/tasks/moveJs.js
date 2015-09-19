/**
 *	moveJs.js
 *	=========
 *	Simply moves JS files to the dest
 *
 *	Note - this will be replaced when I add browserify
 **/

var gulp 			= require('gulp');
var debug 			= require('gulp-debug');
var config 			= require('../config').moveJs;
var browserSync  	= require('browser-sync');
var changed 		= require('gulp-changed');

gulp.task('moveJs', function () {
	return gulp.src(config.src)
		.pipe(changed(config.dest))
		.pipe(debug({ title: 'moveJs:' }))
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.reload({ stream: true }));
});
