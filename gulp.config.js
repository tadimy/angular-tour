/**
 * Created by Angular2 on 15-12-19.
 */
module.exports = function () {
    var root = '/',
        app = 'app',
        clientApp = './app',
        dist = 'dist',
        tmp = '.tmp',
        docs = 'docs',
        landing = 'landing';
    return {
        root: root,
        app: app,
        dist: dist,
        tmp: tmp,
        index: app + "/index.html",
        alljs: [
            app + "/scripts/**/*.js",
            './*.js'
        ],
        allTs: [
            app + "/scripts/**/*.ts"
        ],
        jade: [
            app + "/jade/**/*.jade"
        ],
        assets: [
            app + "/app/**/*.html",
            app + "/bower_components/font-awesome/css/*",
            app + "/bower_components/font-awesome/fonts/*",
            app + "/bower_components/weather-icons/css/*",
            app + "/bower_components/weather-icons/font/*",
            app + "/bower_components/weather-icons/fonts/*",
            app + "/bower_components/material-design-iconic-font/dist/**/*",
            app + "/fonts/**/*",
            app + "/i18n/**/*",
            app + "/images/**/*",
            app + "/styles/loader.css",
            app + "/styles/ui/images/*",
            app + "/favicon.ico"
        ],
        less: [],
        sass: [
            app + "/styles/**/*.scss"
        ],
        js: [
            clientApp + "/**/*.module.js",
            clientApp + "/**/*.js",
            '!' + clientApp + "/**/*.spec.js"
        ],
        docs: docs,
        docsJade: [
            docs + "/jade/index.jade",
            docs + "/jade/layout.jade"
        ],
        allToClean: [
            tmp,
            ".DS_Store",
            ".sass-cache",
            "node_modules",
            ".git",
            app + "/bower_components",
            docs + "/jade",
            docs + "/layout.html",
            landing + "/jade",
            landing + "/bower_components",
            "readme.md"
        ]
    };
};