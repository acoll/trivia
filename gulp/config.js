var dest = './public';
var src = './frontend';

module.exports = {
	browserSync: {
		// server: {
		// 	baseDir: dest
		// },
		// port: 8080,
		proxy: {
			target: 'localhost:9090',
			ws: true
		},
		open: false
	},
	sass: {
		src: [
			src + '/scss/*.{sass,scss}',
			src + '/scss/**/*.{sass,scss}',
			src + '/scss/**/**/*.{sass,scss}'
		],
		dest: dest + '/css',
		settings: {}
	},
	jshint: {
		src: [
			src + '/js/*.js',
			src + '/js/**/*.js'
		]
	},
	moveImages: {
		src: [
			src + '/images/*.*'
		],
		dest: dest + '/images'
	},
	jade: {
		src: [
			src + '/jade/views/*.jade'
		],
		dest: dest
	},
	browserify: {
		bundleConfigs: [{
			entries: [ src + '/js/host.js' ],
			dest: dest + '/js',
			outputName: 'host.js'
		}, {
			entries: [ src + '/js/scoreboard.js' ],
			dest: dest + '/js',
			outputName: 'scoreboard.js'
		}, {
			entries: [ src + '/js/team.js' ],
			dest: dest + '/js',
			outputName: 'team.js'
		}]
	}
};
