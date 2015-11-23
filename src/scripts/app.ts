import {bootstrap, Component, NgFor, provide} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Jsonp, JSONP_PROVIDERS,Response} from 'angular2/http';
import {RouteConfig} from 'angular2/router';

interface Category {
    id:number;
    slug:string;
    title:string;
    description:string;
    parent:number;
    post_count:number;
}
interface Post {
    id:number;
    type:string;
    url:string;
    slug:string;
    status:string;
    title:number;
    date:string;
    title_plain:string;
    content:string;
    modified:string;
    categories:Category;
    comments:any;
    comment_count:number;
    comment_status:string;
    custom_fields:string;
}
interface PostList {
    count:number;
    count_total:number;
    pages:number;
    posts:Array<Post>;
}

@Component({
    selector: 'post-list',
    templateUrl: 'jade/post-list.html',
    viewProviders: [HTTP_PROVIDERS, JSONP_PROVIDERS],
    directives: [NgFor]
})
@RouteConfig([
    {
        path: '/post',
        component: PostListComponent,
        name: 'PostListComponent'
    }
])

class PostListComponent {
    public post_list:PostList = {
        count: 0,
        count_total: 0,
        pages: 0,
        posts: []
    };
    public response;

    constructor(jsonp:Http) {
        this.getRecentPosts(jsonp);
    }

    getRecentPosts(jsonp:Http) {
        jsonp.request('http://ng.vaivei.com/api_json/get_recent_posts/')
            .subscribe(response => {
                this.response = response.json();
                this.post_list.count = this.response.count;
                this.post_list.count_total = this.response.count_total;
                this.post_list.pages = this.response.pages;
                this.post_list.posts = this.response.posts;
            });
    }
}


//启动组件
bootstrap(PostListComponent);
