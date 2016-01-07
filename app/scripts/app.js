var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var http_1 = require('angular2/http');
var router_1 = require('angular2/router');
var async_1 = require('angular2/src/facade/async');
var lang_1 = require('angular2/src/facade/lang');
var db = require('../data/post-list');
var EscapeHtmlPipe = (function () {
    function EscapeHtmlPipe() {
    }
    EscapeHtmlPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = []; }
    };
    EscapeHtmlPipe = __decorate([
        core_1.Pipe({ name: 'escapeHtml', pure: false }), 
        __metadata('design:paramtypes', [])
    ], EscapeHtmlPipe);
    return EscapeHtmlPipe;
})();
var WPService = (function () {
    function WPService() {
        this.baseUrl = 'http://ng.vaivei.com/api_json/';
    }
    WPService.prototype.getData = function () {
        var p = async_1.PromiseWrapper.completer();
        p.resolve(db);
        return p.promise;
    };
    WPService.prototype.posts = function () {
        return async_1.PromiseWrapper.then(this.getData(), function (data) {
            return data;
        });
    };
    WPService.prototype.post = function (id) {
        return async_1.PromiseWrapper.then(this.getData(), function (data) {
            return data;
        });
    };
    WPService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], WPService);
    return WPService;
})();
var WPRestfulService = (function () {
    function WPRestfulService() {
        this.baseUrl = "http://ng.vaivei.com/api_json/";
        this.ready = false;
        this.data = '';
    }
    WPRestfulService.prototype.getData = function (url, jsonp) {
        var p = async_1.PromiseWrapper.completer();
        p.resolve(jsonp.get(this.baseUrl + url));
        return p.promise;
    };
    WPRestfulService.prototype.posts = function (url, jsonp) {
        return async_1.PromiseWrapper.then(this.getData(url, jsonp), function (data) {
            console.log(data);
            return data;
        });
    };
    WPRestfulService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], WPRestfulService);
    return WPRestfulService;
})();
var PostItem = (function () {
    function PostItem(data) {
        if (data === void 0) { data = null; }
        this.id = '';
        this.type = '';
        this.url = '';
        this.slug = '';
        this.status = '';
        this.title = '';
        this.date = '';
        this.title_plain = '';
        this.content = '';
        this.modified = '';
        this.comments = '';
        this.comment_count = '';
        this.comment_status = '';
        this.custom_fields = '';
        if (lang_1.isPresent(data)) {
            this.setData(data);
        }
    }
    PostItem.prototype.setData = function (item) {
        this.id = item['id'];
        this.type = item['type'];
        this.url = item['url'];
        this.slug = item['slug'];
        this.status = item['status'];
        this.title = item['date'];
        this.date = item['date'];
        this.title_plain = item['title_plain'];
        this.content = item['content'];
        this.modified = item['modified'];
        this.comments = item['comments'];
        this.comment_count = item['comment_count'];
        this.comment_status = item['comment_status'];
        this.custom_fields = item['custom_fields'];
    };
    PostItem = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object])
    ], PostItem);
    return PostItem;
})();
var PostList = (function () {
    function PostList(data) {
        if (data === void 0) { data = null; }
        this.count = '';
        this.count_total = '';
        this.pages = '';
        this.posts = [];
        if (lang_1.isPresent(data)) {
            this.setData(data);
        }
    }
    PostList.prototype.setData = function (item) {
        this.count = item.count;
        this.count_total = item.count_total;
        this.pages = item.pages;
        this.posts = item.posts;
    };
    PostList = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object])
    ], PostList);
    return PostList;
})();
var PostComponent = (function () {
    function PostComponent(wpRestful, params, jsonp) {
        var _this = this;
        this.post = new PostItem();
        this.ready = false;
        var id = params.get('id');
        async_1.PromiseWrapper.then(wpRestful.posts('get_post' + '?id=' + id, jsonp), function (data) {
            data.subscribe(function (res) {
                _this.ready = true;
                _this.post = new PostItem(res.json().post);
                console.log(res.json());
                console.log(_this.post);
            });
        });
    }
    PostComponent = __decorate([
        core_1.Component({
            selector: 'post',
            viewProviders: [http_1.HTTP_PROVIDERS, http_1.JSONP_PROVIDERS, WPRestfulService],
        }),
        core_1.View({
            templateUrl: './app/jade/post.html',
        }), 
        __metadata('design:paramtypes', [WPRestfulService, router_1.RouteParams, http_1.Http])
    ], PostComponent);
    return PostComponent;
})();
var PostListComponent = (function () {
    function PostListComponent(router, wpService, wpRestful, jsonp) {
        var _this = this;
        this.router = router;
        this.ready = true;
        this.post_list = new PostList();
        async_1.PromiseWrapper.then(wpRestful.posts('get_recent_posts', jsonp), function (data) {
            data.subscribe(function (res) {
                _this.ready = true;
                _this.post_list = new PostList(res.json());
            });
        }).catch(function (reason) {
            console.log(reason);
        });
    }
    PostListComponent = __decorate([
        core_1.Component({
            selector: 'post-list',
            viewProviders: [http_1.HTTP_PROVIDERS, http_1.JSONP_PROVIDERS, WPService, WPRestfulService]
        }),
        core_1.View({
            templateUrl: './app/jade/post-list.html',
            directives: [common_1.NgFor, router_1.RouterLink]
        }), 
        __metadata('design:paramtypes', [router_1.Router, WPService, WPRestfulService, http_1.Http])
    ], PostListComponent);
    return PostListComponent;
})();
var PostListApp = (function () {
    function PostListApp(router, location) {
        this.router = router;
        this.location = location;
    }
    PostListApp.prototype.postListPageActive = function () {
        return this.location.path() == '';
    };
    PostListApp = __decorate([
        core_1.Component({
            selector: 'post-app',
            templateUrl: "./app/jade/post-app.html",
            directives: [router_1.RouterOutlet, router_1.RouterLink]
        }),
        router_1.RouteConfig([
            new router_1.Route({ path: '/posts', component: PostListComponent, name: 'Posts' }),
            new router_1.Route({ path: '/post/:id', component: PostComponent, name: 'Post' })
        ]), 
        __metadata('design:paramtypes', [router_1.Router, router_1.Location])
    ], PostListApp);
    return PostListApp;
})();
exports.PostListApp = PostListApp;
