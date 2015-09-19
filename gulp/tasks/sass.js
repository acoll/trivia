/**
 *	sass.js
 *	=======
 *	Every good frontend project needs some SASS
 **/
var gulp = 			require('gulp'),
	sass = 			require('gulp-sass'),
	sourcemaps = 	require('gulp-sourcemaps'),
	autoprefixer = 	require('gulp-autoprefixer'),
	config = 		require('../config').sass,
	handleErrors = 	require('../util/handleErrors'),
	browserSync = 	require('browser-sync');

gulp.task('sass', function () {
	return gulp.src(config.src)
		// .pipe(sourcemaps.init())
		.pipe(sass(config.settings))
		.on('error', handleErrors)
		// .pipe(sourcemaps.write())
		.pipe(autoprefixer({ browsers: [ 'last 2 version' ] }))
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.reload({  stream: true }));
});
