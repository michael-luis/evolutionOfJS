module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },
        clean: ['public/'],
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**/*.html', 'uploads/**'], dest: 'public/'}
                ]
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            target: {
                files: {
                    'public/assets/css/style.min.css': ['bower_components/bootstrap/dist/css/bootstrap.css', 'src/css/style.css']
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-resource/angular-resource.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'src/js/**/*.js'
                ],
                dest: 'public/assets/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'public/assets/js/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['src/js/**/*.js']
        },
        watch: {
            styles: {
                files: 'src/css/style.css',
                tasks: 'cssmin'
            },
            scripts: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin', 'copy', 'nodemon']);
};