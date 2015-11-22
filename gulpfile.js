/**
 * Created by Angular2 on 15-11-2.
 */
'use strict';

var gulp = require('gulp');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');


function throwToolsBuildMissingError() {
    throw new Error('ERROR: build.tools task should have been run before using angularBuilder');
}

var angularBuilder = {
    rebuildBrowserDevTree: throwToolsBuildMissingError,
    rebuildBrowserProdTree: throwToolsBuildMissingError,
    rebuildNodeTree: throwToolsBuildMissingError,
    rebuildDartTree: throwToolsBuildMissingError,
    uninitialized: true
};

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
            all: 'dist/scripts/',
            dev: {
                es6: 'dist/scripts/dev/es6',
                es5: 'dist/scripts/dev/es5'
            },
            prod: {
                es5: 'dist/scripts/prod/es5',
                es6: 'dist/scripts/prod/es6'
            }
        },
        html: {
            all: 'dist/views/'
        },
        css: {
            all: 'dist/styles/'
        }
    },
    src: {
        scripts: 'src/scripts',
        jade: 'src/jade',
        styles: 'src/styles'
    },
    docs: {}
};

function doCheckFormat() {
    return gulp.src(['modules/**/*.ts', 'tools/**/*.ts', '!**/typings/**/*.d.ts'])
        .pipe(gulpFormat.checkFormat('file', clangFormat));
}

gulp.task('check-format', function() {
    return doCheckFormat().on('warning', function(e) {
        console.log("NOTE: this will be promoted to an ERROR in the continuous build");
    });
});

gulp.task('enforce-format', function() {
    return doCheckFormat().on('warning', function(e) {
        console.log("ERROR: You forgot to run clang-format on your change.");
        console.log("See https://github.com/angular/angular/blob/master/DEVELOPER.md#clang-format");
        process.exit(1);
    });
});

gulp.task('lint', ['build.tools'], function() {
    var tslint = require('gulp-tslint');
    // Built-in rules are at
    // https://github.com/palantir/tslint#supported-rules
    var tslintConfig = {
        "rules": {
            "requireInternalWithUnderscore": true,
            "requireParameterType": true,
            "requireReturnType": true,
            "semicolon": true,
            "variable-name": [true, "ban-keywords"]
        }
    };
    return gulp.src(['modules/angular2/src/**/*.ts', '!modules/angular2/src/testing/**'])
        .pipe(tslint({
            tslint: require('tslint').default,
            configuration: tslintConfig,
            rulesDirectory: 'dist/tools/tslint'
        }))
        .pipe(tslint.report('prose', {emitError: true}));
});

gulp.task('build/clean.tools', function () {
    del(path.join('dist', 'tools'));
});
gulp.task('build/clean.js', function (done) {
    del(BUILD_CONFIG.dest.js.all, done);
});


//Server
function jsServeDev() {
    return jsserve(gulp, gulpPlugins, {
        path: CONFIG.dest.js.dev.es5,
        port: 8000
    })();
}

function jsServeProd() {
    return jsserve(gulp, gulpPlugins, {
        path: CONFIG.dest.js.prod.es5,
        port: 8001
    })();
}

gulp.task('build.js.prod', ['build.tools'], function (done) {

});

//todo
gulp.task('build.js.dev', ['build/clean.js'], function (done) {
    runSequence(

    )
});

gulp.task('serve.js.dev', ['build.js'], function (neverDone) {

});
gulp.task('serve.js.prod', jsServeProd());

// public task to build tools
gulp.task('build.tools', ['build/clean.tools'], function (done) {
    runSequence('!build.tools', sequenceComplete(done));
});


// private task to build tools
gulp.task('!build.tools', function () {
    var stream = gulp.src(['tools/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsc({
            target: 'ES5', module: 'commonjs',
            // Don't use the version of typescript that gulp-typescript depends on
            // see https://github.com/ivogabe/gulp-typescript#typescript-version
            typescript: require('typescript')
        }))
        .on('error', function (error) {
            // nodejs doesn't propagate errors from the src stream into the final stream so we are
            // forwarding the error into the final stream
            stream.emit('error', error);
        })
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/tools'))
        .on('end', function () {
            var AngularBuilder = require('./dist/tools/broccoli/angular_builder').AngularBuilder;
            angularBuilder = new AngularBuilder({
                outputPath: 'dist',
                dartSDK: DART_SDK,
                logs: logs
            });
        });

    return stream;
});

gulp.task('build.css.material', function () {
    return gulp.src('src/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(BUILD_CONFIG.dest.js.prod.es5))
        .pipe(gulp.dest(BUILD_CONFIG.dest.js.dev.es5));
});

gulp.task('build.js.material', function (done) {
    runSequence('build.js/dev', 'build.css.material', sequenceComplete(done));
});

gulp.task('cleanup.builder', function () {
    return angularBuilder.cleanup();
});

process.on('SIGINT', function () {
    if (!angularBuilder.uninitialized) {
        runSequence('cleanup.builder', function () {
            process.exit();
        });
    } else {
        process.exit();
    }
});
