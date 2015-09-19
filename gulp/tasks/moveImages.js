/**
 *	moveImages.js
 *	=============
 *	Moving images to the dest dir
 **/

var gulp 		= require('gulp'),
	debug 		= require('gulp-debug'),
	config 		= require('../config').moveImages,
	browserSync = require('browser-sync'),
	changed 	= require('gulp-changed');

gulp.task('moveImages', function () {
	return gulp.src(config.src)
		.pipe(changed(config.dest))
		.pipe(debug({ title: 'moveImages:' }))
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.reload({ stream: true }));
});
