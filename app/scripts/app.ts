import { Component,EventEmitter, View, Inject, provide,Injectable, QueryList, Pipe} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {NgFor} from 'angular2/common';
import {Http, HTTP_PROVIDERS, Jsonp, JSONP_PROVIDERS,Response} from 'angular2/http';
import {RouterLink, RouteConfig, Route, Router,RouteParams,Location,RouterOutlet} from 'angular2/router';
import {ObservableWrapper, Observable, PromiseWrapper, Promise} from 'angular2/src/facade/async';
import {ListWrapper} from 'angular2/src/facade/collection';
import {isPresent, DateWrapper} from 'angular2/src/facade/lang';
import * as db from '../data/post-list'
import {PipeTransform} from "angular2/core";

@Pipe({name: 'escapeHtml', pure: false})
class EscapeHtmlPipe implements PipeTransform {
    transform(value:any, args:any[] = []) {
    }
}

@Injectable()
class WPService {
    baseUrl:string = 'http://ng.vaivei.com/api_json/';

    getData():Promise<any[]> {
        var p = PromiseWrapper.completer();
        p.resolve(db);
        return p.promise;
    }

    posts():Promise<any> {
        return PromiseWrapper.then(this.getData(), (data:any[]) => {
            //console.log(data);
            return data;
        });
    }

    post(id):Promise<any> {
        return PromiseWrapper.then(this.getData(), (data)=> {
            return data;
        });
    }
}

@Injectable()
class WPRestfulService {
    baseUrl:string = "http://ng.vaivei.com/api_json/";
    ready:boolean = false;
    data:any = '';
    jsonp:Jsonp;

    getData(url, jsonp):Promise<any[]> {
        var p = PromiseWrapper.completer();
        p.resolve(jsonp.get(this.baseUrl + url));
        return p.promise;
    }

    posts(url, jsonp):Promise<any> {
        return PromiseWrapper.then(this.getData(url, jsonp), (data:any[]) => {
            console.log(data);
            return data;
        });
    }

    //post(url, jsonp):Promise<any[]> {
    //    return PromiseWrapper.then(this.getData(url,jsonp),)
    //}
}
@Injectable()
class PostItem {
    id:string = '';
    type:string = '';
    url:string = '';
    slug:string = '';
    status:string = '';
    title:string = '';
    date:string = '';
    title_plain:string = '';
    content:string = '';
    modified:string = '';
    comments:any = '';
    comment_count:string = '';
    comment_status:string = '';
    custom_fields:string = '';

    constructor(data:{
        id:string,
        type:string,
        url:string,
        slug:string,
        status:string,
        title:string,
        date:string,
        title_plain:string,
        content:string,
        modified:string,
        comments:any,
        comment_count:string,
        comment_status:string,
        custom_fields:string,
    } = null) {
        if (isPresent(data)) {
            this.setData(data);
        }
    }

    setData(item:{
        id:string,
        type:string,
        url:string,
        slug:string,
        status:string,
        title:string,
        date:string,
        title_plain:string,
        content:string,
        modified:string,
        comments:any,
        comment_count:string,
        comment_status:string,
        custom_fields:string,
    }) {
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
    }
}
@Injectable()
class PostList {
    count:string = '';
    count_total:string = '';
    pages:string = '';
    posts:any[] = [];

    constructor(data:{
        count:string,
        count_total:string,
        pages:string,
        posts:any[]
    } = null) {
        if (isPresent(data)) {
            this.setData(data);
        }
    }

    setData(item:{
        count:string,
        count_total:string,
        pages:string,
        posts:any[]
    }) {
        this.count = item.count;
        this.count_total = item.count_total;
        this.pages = item.pages;
        this.posts = item.posts;
    }
}

@Component({
    selector: 'post',
    viewProviders: [HTTP_PROVIDERS, JSONP_PROVIDERS, WPRestfulService],
})
@View({
    templateUrl: './app/jade/post.html',
})
class PostComponent {
    post:PostItem = new PostItem();
    ready:boolean = false;

    constructor(wpRestful:WPRestfulService, params:RouteParams, jsonp:Http) {
        var id = params.get('id');
        PromiseWrapper.then(wpRestful.posts('get_post' + '?id=' + id, jsonp), (data) => {
            data.subscribe((res) => {
                this.ready = true;
                this.post = new PostItem(res.json().post);
                console.log(res.json());
                console.log(this.post);
            });
        })
    }
}

@Component({
    selector: 'post-list',
    viewProviders: [HTTP_PROVIDERS, JSONP_PROVIDERS, WPService, WPRestfulService]
})
@View({
    templateUrl: './app/jade/post-list.html',
    directives: [NgFor, RouterLink]
})
class PostListComponent {
    public ready:boolean = true;
    public post_list:PostList = new PostList();

    constructor(public router:Router, wpService:WPService, wpRestful:WPRestfulService, jsonp:Http) {
        PromiseWrapper.then(wpRestful.posts('get_recent_posts', jsonp), (data)=> {
            data.subscribe((res) => {
                this.ready = true;
                this.post_list = new PostList(res.json())
            });
        }).catch((reason) => {
            console.log(reason);
        });
    }

}

@Component({
    selector: 'post-app',
    templateUrl: "./app/jade/post-app.html",
    directives: [RouterOutlet, RouterLink]
})
@RouteConfig([
    new Route({path: '/posts', component: PostListComponent, name: 'Posts'}),
    new Route({path: '/post/:id', component: PostComponent, name: 'Post'})
])
export class PostListApp {
    router:Router;
    location:Location;

    constructor(router:Router, location:Location) {
        this.router = router;
        this.location = location;
    }

    postListPageActive() {
        return this.location.path() == '';
    }
}