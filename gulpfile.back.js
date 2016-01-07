/**
 * Created by Angular2 on 15-11-2.
 */
'use strict';

var gulp = require('gulp');
var del = require('del');
var gulpPlugins = require('gulp-load-plugins')();
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var jade = require('gulp-jade');
var htmlify = require('gulp-angular-htmlify');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var fs = require('fs');
var connect = require('gulp-connect');
var jsserve = require('./tools/build/jsserve');
var webserver = require('gulp-webserver');
var APP_BASE = '/';

var tsProject = tsc.createProject('tsconfig.json', {
    typescript: require('typescript')
});

function templateLocals() {
    return {
        VERSION: getVersion(),
        APP_BASE: APP_BASE
    };
}

function getVersion() {
    var pkg = JSON.parse(fs.readFileSync('package.json'));
    return pkg.version;
}

function throwToolsBuildMissingError() {
    throw new Error('ERROR: build.tools task should have been run before using angularBuilder');
}


function sequenceComplete(done) {
    return function (err) {
        if (err) {
            var error = new Error('build sequence failed');
            error.showStack = false;
            done(error);
        } else {
            done();
        }
    };
}
var BUILD_CONFIG = {
    dest: {
        js: {
            all: './dist/scripts',
            dev: {
                all: './dist/dev/'
            },
            prod: {
                all: '.dist/prod/scripts'
            }
        },
        views: {
            all: "./dist/views",
            dev: {
                all: './dist/dev/views'
            },
            prod: {
                all: '/dist/prod/views'
            }
        },
        css: {
            all: './dist/',
            dev: {
                all: './dist/dev/'
            },
            prod: {
                all: './dist/prod/'
            }
        },
        fonts: {
            all: './dist/**/fonts',
            dev: {
                all: './dist/dev/fonts'
            },
            prod: {
                all: './dist/prod/fonts'
            }
            //all: [
            //    './dist/dev/fonts',
            //    './dist/prod/fonts'
            //]
        }
    },
    src: {
        scripts: {
            files: 'app/**/*.ts'
        },
        jade: {
            files: 'app/jade/**/*.jade',
            watch: 'app/jade/**/*.jade'
        },
        styles: {
            dir: 'app/styles',
            files: 'app/**/*.scss',
            watch: 'app/styles/**/*.scss'
        }
    },
    docs: {}
};
gulp.task('build.clean.jade', function (done) {
    del(BUILD_CONFIG.dest.views.all, done);
});

gulp.task('build.clean.css', function (done) {
    del(BUILD_CONFIG.dest.css.all, done);
});

gulp.task('build.clean.fonts', function (done) {
    del(BUILD_CONFIG.dest.fonts.all, done);
});


gulp.task('build.clean.all', ['build.clean.jade', 'build.clean.css', 'build.clean.fonts']);

gulp.task('build.css.dev', function () {
    return gulp.src(BUILD_CONFIG.src.styles.files)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(BUILD_CONFIG.dest.css.dev.all));
});

gulp.task('build.jade.dev', function () {
    return gulp.src(BUILD_CONFIG.src.jade.files)
        .pipe(changed(BUILD_CONFIG.src.jade.files, {extension: '.html'}))
        .pipe(jade(
            {doctype: 'html'}
        ))
        .on('error', handleError)
        .pipe(htmlify())
        .pipe(gulp.dest(BUILD_CONFIG.dest.views.dev.all))
});

gulp.task('build.js.dev', function () {
    var result = gulp.src(BUILD_CONFIG.src.scripts.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    return result.js
        .pipe(sourcemaps.write())
        .pipe(template(templateLocals()))
        .pipe(gulp.dest(BUILD_CONFIG.dest.js.dev.all));
});
gulp.task('build.js.prod', function () {
    var result = gulp.src(BUILD_CONFIG.src.scripts.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));
    return result.js
        .pipe(sourcemaps.write())
        .pipe(template(templateLocals()))
        .pipe(gulp.dest(BUILD_CONFIG.dest.prod.all));
});
gulp.task('build.fonts.dev', () => {
    return gulp.src(require('main-bower-files')({
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }).concat('app/fonts/**/*'))
        .pipe(gulp.dest('.tmp/fonts'))
        .pipe(gulp.dest(BUILD_CONFIG.dest.fonts.dev.all));
});

gulp.task('serve.dev', function () {
    return gulp.src('./dist/dev/')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});
// Error handler
function handleError(err) {
    // console.log(err.toString());
    gutil.log(err);
    gutil.beep();
    this.emit('end');
}
var defaultTasks = [
    'build.clean.all',
    'build.jade.dev',
    'build.css.dev',
    'build.js.dev',
    'build.fonts.dev'
];
gulp.task('default', defaultTasks);