var fs = require('fs');
var pkg = require('./package.json');

module.exports = function (grunt) {

	grunt.initConfig({
		'http-server': {
			dev: {
				root: './dist',
				port: 8080,
				host: '0.0.0.0',
				cache: '-1',
				showDir: true,
				autoIndex: true,
				runInBackground: true
			}
		},
		jade: {
			views: {
				files: {
					'dist/team/index.html': ['frontend/jade/views/team.jade'],
					'dist/scoreboard/index.html': ['frontend/jade/views/scoreboard.jade'],
					'dist/host/index.html': ['frontend/jade/views/host.jade']
				},
				options: { client: false, pretty: true }
			}
		},
		watch: {
			jade: {
				files: ['frontend/jade/**/*.jade'],
				tasks: ['jade']
			},
			sass: {
				files: ['frontend/scss/**'],
				tasks: ['sass']
			},
			copy: {
				files: ['frontend/js/**/*'],
				tasks: ['copy']
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'dist/css/team.css': ['frontend/scss/team.scss'],
					'dist/css/scoreboard.css': ['frontend/scss/scoreboard.scss'],
					'dist/css/host.css': ['frontend/scss/host.scss']
				}
			}
		},
		copy: {
			images: {
				expand: true,
				flatten: true,
				src: ['frontend/images/*'],
				dest: 'dist/images'
			},
			js: {
				expand: true,
				flatten: true,
				src: ['frontend/js/*.js'],
				dest: 'dist/js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['jade', 'sass', 'copy']);
};
