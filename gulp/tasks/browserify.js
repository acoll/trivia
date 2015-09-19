/**
 *	browserify.js
 *	=============
 *	Because browserify is fucking awesome, this is going to be another long
 *	one. If you don't know what this is doing DON'T TOUCH IT.
 *
 *	This task is set up to generate multiple separate bundles, from
 *	different sources, and to use Watchify when run from the default task.
 *
 *	See browserify.bundleConfigs in gulp/config.js
 **/

var gulp 			= require('gulp'),
	browserify 		= require('browserify'),
	watchify 		= require('watchify'),
	browserSync 	= require('browser-sync'),
	mergeStream		= require('merge-stream'),
	bundleLogger 	= require('../util/bundleLogger'),
	handleErrors	= require('../util/handleErrors'),
	source 			= require('vinyl-source-stream'),
	config 			= require('../config').browserify,
	babelify 		= require('babelify'),
	_ 				= require('underscore'),
	browserifyTask;

browserifyTask = function ( devMode ) {
	var browserifyThis = function ( bundleConfig ) {
		var b,
			bundle;

		if (devMode) {
			/* Add watchify args and debug (sourcemaps) option */
			_.extend(bundleConfig, watchify.args, { debug: false });
			/**
			 *	A watchify require/external bug that prevents proper recompiling,
			 *	so (for now) we'll ignore these options during development. Running
			 *	`gulp browserify` directly will properly require and externalize.
			 **/
			bundleConfig = _.omit(bundleConfig, [ 'external', 'require' ]);
		}

		b = browserify(bundleConfig);
		b.transform(babelify);

		bundle = function () {
			/* Log when bundling starts */
			bundleLogger.start(bundleConfig.outputName);

			return b
				.bundle()
				.on('error', handleErrors)
				/* vinyl-source-steam makes the stream gulp compatible */
				.pipe(source(bundleConfig.outputName))
				.pipe(gulp.dest(bundleConfig.dest))
				.pipe(browserSync.reload({
					stream: true
				}));
		};

		if (devMode) {
			/* Wrap with watchify and rebundle on changes */
			b = watchify(b);
			/* Rebundle on update */
			b.on('update', bundle);
			bundleLogger.watch(bundleConfig.outputName);
		} else {
			/**
			 *	Sort out shared dependencies.
			 *	b.require exposes modules externally
			 **/
			if (bundleConfig.require) {
				b.require(bundleConfig.require);
			}
			/**
			 *	b.external excludes modules from the bundle, and expects
			 *	they'll be available externally.
			 **/
			if (bundleConfig.external) {
				b.external(bundleConfig.external);
			}
		}

		return bundle();
	};

	/* Start bundling with browserify for eahc bundleConfig specified */
	return mergeStream.apply(gulp, _.map(config.bundleConfigs, browserifyThis));
};

gulp.task('browserify', function () {
	return browserifyTask();
});

/* For watchify to consume */
module.exports = browserifyTask;
