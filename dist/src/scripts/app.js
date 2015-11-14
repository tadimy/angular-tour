var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var http_1 = require('angular2/http');
var Category = (function () {
    function Category() {
    }
    return Category;
})();
var Post = (function () {
    function Post() {
    }
    return Post;
})();
var PostList = (function () {
    function PostList() {
    }
    return PostList;
})();
var PostListComponent = (function () {
    function PostListComponent(jsonp) {
        this.post_list = {
            count: 0,
            count_total: 0,
            pages: 0,
            posts: []
        };
        this.getRecentPosts(jsonp);
    }
    PostListComponent.prototype.getRecentPosts = function (jsonp) {
        var _this = this;
        jsonp.request('http://ng.vaivei.com/api_json/get_recent_posts/')
            .subscribe(function (response) { return _this.post_list = response.json(); });
    };
    PostListComponent = __decorate([
        angular2_1.Component({
            selector: 'post-list',
            templateUrl: 'jade/post-list.html',
            viewProviders: [http_1.HTTP_PROVIDERS, http_1.JSONP_PROVIDERS],
            directives: [angular2_1.NgFor]
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PostListComponent);
    return PostListComponent;
})();
angular2_1.bootstrap(PostListComponent);
