/**
 * Created by Angular2 on 15-11-2.
 */
'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var tsc = require('gulp-typescript');
var htmlify = require('gulp-angular-htmlify');
var fs = require('fs');
var $ = require('gulp-load-plugins')({lazy: true});
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
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('clean-tmp', function (done) {
    var files = config.tmp;
    clean(files, done);
});

gulp.task('clean', function (done) {
    var delconfig = [].concat(config.dist, config.tmp);
    log('Cleaning ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-all', function (done) {
    var delconfig = config.allToClean;
    log('Cleaning ' + $.util.colors.blue(delconfig));
    clean(delconfig, done);
});

gulp.task('jade-docs', function () {
    log('Compiling docs jade --> html');

    var options = {
        pretty: false
    };

    return gulp
        .src(config.docsJade)
        .pipe($.jade(options))
        .pipe(gulp.dest(config.docs));
});

gulp.task('less', function () {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 2%']}))
        .pipe(gulp.dest(config.tmp));
});

gulp.task('less-watcher', function () {
    gulp.watch([config.less], ['less']);
});

gulp.task('sass', function () {
    log('Compiling Sass --> CSS');

    var sassOptions = {
        outputStyle: 'nested' // nested, expanded, compact, compressed
    };

    return gulp
        .src(config.sass)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp + '/styles'));
});

gulp.task('sass-min', function () {
    log('Compiling Sass --> minified CSS');

    var sassOptions = {
        outputStyle: 'compressed' // nested, expanded, compact, compressed
    };

    return gulp
        .src(config.sass)
        .pipe($.plumber())
        .pipe($.sass(sassOptions))
        .pipe(gulp.dest(config.tmp + '/styles'));
});

gulp.task('sass-watcher', function () {
    gulp.watch([config.sass], ['sass']);
});

gulp.task('jade', function () {
    log('Compiling Jade --> HTML');

    var jadeOptions = {
        doctype: 'html'
    };
    return gulp
        .src(config.jade)
        .pipe($.plumber())
        .pipe($.jade(jadeOptions))
        .pipe(htmlify())
        .pipe(gulp.dest(config.tmp + '/views'))
});

gulp.task('js', function () {
    var result = gulp.src(config.allTs)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe(tsc(tsProject));

    return result.js
        .pipe($.sourcemaps.write())
        .pipe($.template(templateLocals()))
        .pipe(gulp.dest(config.app + '/scripts'))
        .pipe(gulp.dest(config.tmp));
});
gulp.task('inject', function () {
    log('Injecting custom scripts to index.html');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.js), {relative: true}))
        .pipe(gulp.dest(config.app));
});

gulp.task('copy', function () {
    log('Copying assets');

    return gulp
        .src(config.assets, {base: config.app})
        .pipe(gulp.dest(config.dist + '/'));
});

gulp.task('optimize', ['inject', 'sass-min', 'jade'], function () {
    log('Optimizing the js, css, html');

    var assets = $.useref.assets({
        searchPath: [config.app, config.tmp]
    });
    var cssFilter = $.filter('**/*.css', {restore: true});
    var jsFilter = $.filter('**/*.js', {restore: true});

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe(assets)

        .pipe(cssFilter)
        .pipe($.concat('styles/main.css'))
        .pipe(cssFilter.restore)

        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore)

        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(config.dist));
});


gulp.task('serve', ['inject', 'sass', 'jade'], function () {
    startBrowserSync('serve');
});

gulp.task('build', ['optimize', 'copy'], function () {
    startBrowserSync('dist');
});

gulp.task('serve-dist', function () {
    gulp.run('build');
});

gulp.task('serve-docs', ['jade-docs'], function () {
    startBrowserSync('docs');
});


function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}

// function changeEvent(event) {

// }

function startBrowserSync(opt) {
    if (args.nosync || browserSync.active) {
        return;
    }

    var options = {
        port: 3000,
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0, //1000,
        online: false
    };

    switch (opt) {
        case 'dist':
            log('Serving dist app');
            serveDistApp();
            break;
        case 'docs':
            log('Serving docs');
            serveDocs();
            break;
        default:
            log('Serving app');
            serveApp();
            break;
    }

    function serveApp() {
        gulp.watch([config.sass], ['sass']);

        options.server = {
            baseDir: [
                './',
                './node_modules',
                config.app,
                config.tmp
            ]
        };
        options.files = [
            config.app + '/**/*.*',
            '!' + config.sass,
            config.tmp + '/**/*.css'
        ];

        options.routes = {
            //"/node_modules": config.root + "/node_modules",
            //"/rxjs": config.root + "/node_modules/rxjs"
        };

        browserSync(options);
    }

    function serveDistApp() {
        options.server = {
            baseDir: [
                config.dist
            ]
        };
        options.files = [];

        browserSync(options);
    }

    function serveDocs() {
        gulp.watch([config.docsJade], ['jade-docs']);

        options.server = {
            baseDir: [
                config.docs
            ]
        };

        options.files = [
            config.docs + '/index.html',
            '!' + config.jade
        ];

        browserSync(options);
    }

}


