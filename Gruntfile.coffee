module.exports = (grunt) ->

    require('load-grunt-tasks') grunt

    grunt.initConfig
        coffee:
            '01-html5-canvas':
                options:
                    join: true
                files: [ 'dist/01-html5-canvas/app.js': '01-html5-canvas/*.coffee' ]
            '02-particles':
                options:
                    join: true
                files: [ 'dist/02-particles/app.js': '02-particles/*.coffee' ]
        connect: server: options:
            port: grunt.option('port') || 8080
            base: 'dist'
        copy:
            html:
                files: [
                    expand: true
                    src: ['index.html', '01-html5-canvas/**/*.html', '02-particles/**/*.html']
                    dest: 'dist/'
                ]
            jquery:
                files: [
                    src: ['node_modules/jquery/dist/jquery.js']
                    dest: 'dist/libs/jquery.js'
                ]
            three:
                files: [
                    src: ['node_modules/three/three.js']
                    dest: 'dist/libs/three.js'
                ]
        watch:
            html:
                files: ['**/*.html']
                tasks: ['copy:html']
            coffee:
                files: ['**/*.coffee']
                tasks: ['coffee']

    grunt.registerTask 'serve', ['coffee', 'copy', 'connect', 'watch']
    grunt.registerTask 'default', ['serve']
