import {bootstrap, Component, NgFor, provide} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Jsonp, JSONP_PROVIDERS,Response} from 'angular2/http';
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
    data:string;
    title_plain:string;
    content:string;
    modified:string;
    categories:Category;
    comments:string;
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
            .subscribe(response => this.post_list = response.json());
    }
}
bootstrap(PostListComponent);
