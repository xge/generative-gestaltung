module.exports = (grunt) ->

    require('load-grunt-tasks') grunt

    grunt.initConfig
        coffee:
            '01-html5-canvas':
                options:
                    join: true
                files: [ 'dist/01-html5-canvas/app.js': 'src/01-html5-canvas/*.coffee' ]
            '02-particles':
                options:
                    join: true
                files: [ 'dist/02-particles/app.js': 'src/02-particles/*.coffee' ]
            '03-keyframes':
                options:
                    join: true
                files: [ 'dist/03-keyframes/app.js': 'src/03-keyframes/*.coffee' ]
            '04-endless-blend':
                options:
                    join: true
                files: [ 'dist/04-endless-blend/app.js': 'src/04-endless-blend/*.coffee' ]
            '05-three':
                options:
                    join: true
                files: [ 'dist/05-three/app.js': 'src/05-three/*.coffee' ]
            '06-tapeten':
                options:
                    join: true
                files: [ 'dist/06-tapeten/app.js': 'src/06-tapeten/*.coffee' ]
            '07-voronoi':
                options:
                    join: true
                files: [ 'dist/07-voronoi/app.js': 'src/07-voronoi/*.coffee' ]
        concat:
            addons:
                src: ['addons/**/*.js']
                dest: 'dist/libs/addons.js'
        connect: server: options:
            port: grunt.option('port') || 8080
            base: 'dist'
        copy:
            html:
                files: [
                    expand: true
                    cwd: 'src/'
                    src: ['**/*html']
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
            voronoi:
                files: [
                    src: ['node_modules/voronoi/rhill-voronoi-core.js']
                    dest: 'dist/libs/rhill-voronoi-core.js'
                ]
        watch:
            html:
                files: 'src/**/*.html'
                tasks: ['copy:html']
            coffee:
                files: ['**/*.coffee']
                tasks: ['coffee']

    grunt.registerTask 'serve', ['coffee', 'concat', 'copy', 'connect', 'watch']
    grunt.registerTask 'default', ['serve']
