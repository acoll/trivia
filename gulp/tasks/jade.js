/**
 *	jade.js
 *	=======
 *	Compiling jade files
 **/

var gulp 		= require('gulp'),
	jade 		= require('gulp-jade'),
	rename 		= require('gulp-rename'),
	config  	= require('../config').jade,
	browserSync = require('browser-sync');

gulp.task('jade', function () {
	var specialCases = [ 'host', 'scoreboard', 'team' ];

	return gulp.src(config.src)
		.pipe(jade())
		.pipe(rename(function ( path ) {
			if (specialCases.indexOf(path.basename) !== -1) {
				path.dirname = path.basename;
				path.basename = 'index';
			}
		}))
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.reload({ stream: true }));
});
