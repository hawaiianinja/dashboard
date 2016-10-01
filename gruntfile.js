/// <binding AfterBuild='debug' />
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            appJs: {
                options: {
                    configFile: 'eslint.json'
                },
                src: ['src/scripts/**/*.js']
            }
	    },
        clean: {
            build: ['build**/*']
        },
        copy: {
            srcToBuild: {
                expand: true,
                cwd: 'src',
                src: ['**/*', '!scripts/**','!styles/**'],
                dest: 'build'
            },
            libToBuild: {
                expand: true,
                cwd: 'lib',
                src: ['**/*'],
                dest: 'build'
            },
            appCss: {
                expand: true,
                cwd: 'src/styles',
                src: ['**/*'],
                dest: 'build/styles'
            }
        },
        rollup: {
            appJs: {
                options: {
                    format: 'iife'
                },
                src: ['src/scripts/app.js'],
                dest: 'build/scripts/app.js'
            },
        },
        uglify: {
            appJs: {
                options: {
                    mangle: false, /* We don't rename variables so prevent breaking IE Dev tool variable watches */
                    sourceMap: true,
                    sourceMapName: 'build/scripts/app.min.map'
                },
                src: ['build/scripts/app.js'],
                dest: 'build/scripts/app.min.js'
            }
        },
        cssmin: {
            appCss: {
                src: ['src/styles/app.css'],
                dest: 'build/styles/app.min.css'
            }
        },
        replace: {
            appJsAndAppCss: {
                options: {
                    patterns: [
                        {
                            match: /scripts\/app\.js/g,
                            replacement: 'scripts\/app.min.js'
                        },
                        {
                            match: /styles\/app\.css/g,
                            replacement: 'styles\/app.min.css'
                        }
                    ]
                },
                src: ['build/index.html'],
                dest: 'build/index.html'
            }
        },
        cacheBust: {
            /*
            Order matters because some static assets reference other static assets
            Static assets must be busted in the following order to prevent errors
            1. image files, because they cannot reference other static assets
            2  view files, because for this project, view files referance images and are only referenced by app.js, and app.min.js
            3. css files, because for this project, css files referance images and are only referenced by app.css, app.min.css, and index.html
            4. js files, becaues for this project, js files reference images and are only referenced by app.js, app.min.js, app.min.map, and index.html
            */
            options: {
                deleteOriginals: true,
                jsonOutput: false,
                queryString: false,
            },
            images: {
                options: {
                    baseDir: 'build/images',
                    assets: ['**/*']
                },
                cwd: 'build',
                src: ['**/*.html', '**/*.css', '**/*.js', '**/*.aspx']
            },
            views: {
                options: {
                    baseDir: 'build/views',
                    assets: ['*.html']
                },
                cwd: 'build',
                src: ['scripts/app.js', 'scripts/app.min.js',]
            },
            styles: {
                options: {
                    baseDir: 'build/styles',
                    assets: ['*.css']
                },
                cwd: 'build',
                src: ['styles/*.css', 'index.html']
            },
            scripts: {
                options: {
                    baseDir: 'build/scripts',
                    assets: ['*.js', '*.min.js', '*.min.map']
                },
                cwd: 'build',
                src: [ 'index.html', 'scripts/app.*.js', 'scripts/app.min.*.js', 'scripts/app.min.*.map']
            }
        },
        sync: {
            buildWithDeployTest: {
                expand: true, 
                cwd: 'build',
                src: ['**/*'],
                dest: 'deploy/test',
                updateAndDelete: true,
                compareUsing: 'md5'
            },
            buildWithDeployProduction: {
                expand: true,
                cwd: 'build',
                src: ['**/*'],
                dest: 'deploy/production',
                updateAndDelete: true,
                compareUsing: 'md5'
            }
        },
        run: {
            options: {
                failOnError: true
            },
            deployTest: {
                exec: 'TODO'
            },
            deployProduction: {
                exec: 'TODO'
            }
        },
        watch: {
            'srcToBuild': {
                files: ['**/*', '!scripts/**','!styles/**'],
                tasks: ['copy:srcToBuild']
            },
            'libToBuild': {
                files: ['lib/**/*'],
                tasks: ['copy:libToBuild']
            },
            'scripts': {
                files: 'src/scripts/**/*.js',
                tasks: ['eslint', 'rollup:appJs'],
            },
            'styles': {
                files: 'src/styles/**/*.css',
                tasks: ['copy:appCss']
            }
        }
    });

    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-rollup');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-sync');

    grunt.registerTask('debug', [

        // Lint js files to minimize chance of errors
        'eslint',

        // Clear build directory then copy files from scr and lib to build, excluding src scripts and styles
        'clean:build',
        'copy:srcToBuild',
        'copy:libToBuild',

        // Copy non-minified version of app scripts and styles files from src to build
        'rollup:appJs',
        'copy:appCss',

    ]);

    grunt.registerTask('deployTest', [

        // Lint js files to minimize chance of errors
        'eslint',

        // Clear build directory then copy files from scr and lib to build, excluding src scripts and styles
        'clean:build',
        'copy:srcToBuild',
        'copy:libToBuild',

        // Copy non-minified version of app scripts and styles files from src to build
        'rollup:appJs',
        'copy:appCss',

        // cacheBust static assets to prevent issues with GCDS caching
        //'cacheBust',

        // Sync build folder with deploy/test folder then deploy to server
        'sync:buildWithDeployTest',
        //'run:deployTest'

    ]);

    grunt.registerTask('deployProduction', [

        // Lint js files to minimize chance of errors
        'eslint',

        // Clear build directory then copy files from scr and lib to build, excluding src scripts and styles
        'clean:build',
        'copy:srcToBuild',
        'copy:libToBuild',

        // Copy minified version of app scripts and styles files from src to build
        'rollup:appJs',
        'uglify:appJs',
        'cssmin:appCss',
        'replace:appJsAndAppCss',

        // cacheBust static assets to prevent issues with GCDS caching
        //'cacheBust',

        // Sync build folder with deploy/test folder then deploy to server
        'sync:buildWithDeployProduction',
        //'run:deployProduction' 

    ]);

};