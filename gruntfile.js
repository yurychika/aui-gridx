"use strict";

module.exports = function (grunt) {

	// A temporary directory used by amdserialize to output the processed modules.
	var tmpdir = "./tmp/";

	// The final output directory.
	var outdir = "./out/";

	// The grunt.config property populated by amdserialize, containing the
	// list of files to include in the layer.
	var outprop = "amdoutput";
	
	var allI18nFiles = expandFiles( "i18n/*.js" );
	// var jquery_ui = expandFiles('jquery-ui/ui/jquery-ui.js')
	// console.log(allI18nFiles);

// console.log(grunt.file.expandMapping( "jquery-ui/ui/i18n/*.js"  ));
	function expandFiles( files ) {
		return grunt.util._.pluck( grunt.file.expandMapping( files ), "src" ).map(function( values ) {
			return values[ 0 ];
		});
	}

	// console.log(allI18nFiles);
	
	grunt.initConfig({
		concat: {
			//i18n for dialog
			release: {
				src: [
					'src/js/bootstrap.js',
					'src/js/core/directives/aui-grid.js',
					'release/.tmp/template.js'
					// 'src/outro.js'
				],
				dest: 'release/build.js',
			},
		},

		ngtemplates: {
			'aui-grid': {
				// Look for templates in src and in feature template directories
				src: ['src/templates/**/*.html'],
				dest: 'release/.tmp/template.js',
				options: {
					module: 'aui.grid',
					htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true },
					// Strip .html extension
					url: function(url) {
						// Remove the src/templates/ prefix
						url = url.replace(/^src\/templates\//, '');

						// Replace feature prefix with just 'ui-grid'
						url = url.replace(/^src\/features\/[^\/]+?\/templates/, 'ui-grid');

						// Remove the .html extension
						return url.replace('.html', '');
					}
				}
			}
		},

		// The loader config should go here.
		amdloader: {
			// Here goes the config for the amd plugins build process.
			config: {
				// baseUrl: "/",
				// paths: {
				//     "hello": "hello"
				// },
				// text should be replace by the module id of text plugin
				text: {
					inlineText: true
				},
				// i18n should be replace by the module id of i18n plugin
				i18n: {
					localesList: ["fr"]
				}
			}
		},

		// Copy the plugin files to the real output directory.
		copy: {
			image: {
				expand: true,
				cwd: 'themes/less/',
				src: [
					'images/*',
					'dthink.css',
					'dthink-a11y.css',
					'dthink-rtl.css',
					'dthink.less',
					'blue-theme.less'
				],
				// flatten: true,
				dest: 'release/themes/dthink'
			},
		},
		// Erase temp directory and previous build
		clean: {
			erase: [outdir],
			finish: [tmpdir]
		}
	});

	// The main build task.
	grunt.registerTask("amdbuild", function (amdloader) {
		var name = this.name,
			layers = grunt.config(name).layers;

		layers.forEach(function (layer) {
			grunt.task.run("amddepsscan:" + layer.name + ":" + name + ":" + amdloader);
			grunt.task.run("amdserialize:" + layer.name + ":" + name + ":" + outprop);
			grunt.task.run("concat");
			grunt.task.run("copy");
		});
	});


	// Load the plugin that provides the "amd" task.
	require( "load-grunt-tasks" )( grunt );

	// grunt.loadTasks( "build/task" );

	// Load vendor plugins.
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks('grunt-angular-templates');
	// grunt.loadNpmTasks('grunt-contrib-clean');
	// grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask( "js", [
		"build:*:*", 
		"concat:jquery_ui", 
		"concat:i18n", 
		"concat:jquery_i18n"
	]);
	grunt.registerTask( "css", ["copy"] );

	// Default task.
	grunt.registerTask("default", ["ngtemplates", "concat"]);
};