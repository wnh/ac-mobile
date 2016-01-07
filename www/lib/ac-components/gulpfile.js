var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var express = require('express');
var webserver = require('gulp-webserver');
var templateCache = require('gulp-angular-templatecache');
var jade = require('gulp-jade');
var fs = require('fs');
var awspublish = require('gulp-awspublish');
var rename = require("gulp-rename");
var sourceFiles = [
    'src/acComponents/acComponents.prefix',
    'src/acComponents/acComponents.js',
    'src/acComponents/directives/**/*.js',
    'src/acComponents/filters/**/*.js',
    'src/acComponents/services/**/*.js',
    'src/acComponents/templates/**/*.js',
    'src/acComponents/acComponents.suffix'
];

gulp.task('example', function() {
    return gulp.src('example')
        .pipe(webserver({
            livereload: true,
            fallback: 'index.html'
        }));
});

gulp.task('templates', function () {
    return gulp.src('src/acComponents/templates/*.jade')
        .pipe(jade())
        .pipe(templateCache({
            module: 'acComponents.templates',
            standalone: true
        }))
        .pipe(gulp.dest('src/acComponents/templates/'));
});

gulp.task('build', function() {
    return gulp.src(sourceFiles)
        .pipe(concat('ac-components.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('ac-components.min.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('example:copy', ['build'], function () {
    var deps = {
        css: [
            './bower/mapbox.js/mapbox.css',
            './bower/Leaflet.label/dist/leaflet.label.css',
            './bower/leaflet.locatecontrol/src/L.Control.Locate.css',
            './bower/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
        ],
        js: [
            './bower/lodash/dist/lodash.min.js',
            './bower/jquery/dist/jquery.min.js',
            './bower/angular/angular.min.js',
            './bower/angular-sanitize/angular-sanitize.js',
            './bower/angular-sanitize/angular-sanitize.min.js',
            './bower/mapbox.js/mapbox.js',
            './bower/Leaflet.label/dist/leaflet.label.js',
            './bower/leaflet.locatecontrol/src/L.Control.Locate.js',
            './bower/moment/min/moment.min.js',
            './bower/leaflet.locatecontrol/src/L.Control.Locate.js',
            './bower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'

        ],
        map: [
            './bower/jquery/dist/jquery.min.map',
            './bower/angular/angular.min.js.map',
            './bower/angular-sanitize/angular-sanitize.min.js.map'
        ]
    };

    for (var dep in deps) {
        if(dep !== 'map'){
            gulp.src(deps[dep])
                .pipe(concat('vendor.'+dep))
                .pipe(gulp.dest('./example/'+dep));
        } else {
            gulp.src(deps[dep]).pipe(gulp.dest('./example/js'));
        }
    }

    gulp.src('./bower/mapbox.js/images/*.png')
        .pipe(gulp.dest('./example/css/images'));

    gulp.src('./dist/ac-components.js')
        .pipe(gulp.dest('./example/js'));
});

// requires aws-credentials.json in root project or will default to using std AWS ENV_VARS
// { key: '...',  secret: '...', bucket: '...' }
gulp.task('example:publish', function () {
    var aws;
    var publisher;

    fs.exists(__dirname + '/aws-credentials.json', function (exists) {
        if(exists) {
            aws = require('./aws-credentials.json');
        } else {
            aws = {
                key: process.env.AWS_ACCESS_KEY_ID,
                secret: process.env.AWS_SECRET_KEY,
                bucket: 'ac-components-example',
                region: 'us-west-2'
            };
        }

        publisher = awspublish.create(aws);

        return gulp.src('./example/**/*')
            .pipe(publisher.publish())
            .pipe(awspublish.reporter());
    });
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma-src.conf.js',
        singleRun: true
    }, done);
});

gulp.task('test-debug', function (done) {
    karma.start({
        configFile: __dirname + '/karma-src.conf.js',
        singleRun: false,
        autoWatch: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
    karma.start({
        configFile: __dirname + '/karma-dist-concatenated.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
    karma.start({
        configFile: __dirname + '/karma-dist-minified.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch', function () {
    gulp.watch('./src/acComponents/**/*.js', ['build', 'example:copy']);
    gulp.watch('./src/acComponents/templates/*.jade', ['templates', 'example:copy']);
});

gulp.task('dev', ['build', 'templates', 'watch', 'example']);
gulp.task('default', ['test', 'build']);
gulp.task('dist', ['test','test-dist-concatenated', 'test-dist-minified']);
