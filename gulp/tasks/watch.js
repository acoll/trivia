/**
 *	watch.js
 *	========
 *	Watches for changes and reruns tasks
 **/

var gulp 	= require('gulp'),
	watch 	= require('gulp-watch'),
	config 	= require('../config');

gulp.task('watch', [ 'watchify', 'browserSync' ], function () {
	watch(config.sass.src, function () {
		gulp.start('sass');
	});

	watch(config.jshint.src, function () {
		gulp.start('jshint');
	});

	watch(config.moveImages.src, function () {
		gulp.start('moveImages');
	});

	watch(config.jade.src, function () {
		gulp.start('jade');
	});
});
