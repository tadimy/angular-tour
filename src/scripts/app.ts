import {bootstrap, Component, NgFor, provide} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Jsonp, JSONP_PROVIDERS,Response} from 'angular2/http';
class Hero {
    id:number;
    name:string;
    team:string;
    age:number;
}


@Component({
    selector: 'post-list',
    templateUrl: 'jade/post-list.html',
    viewProviders: [HTTP_PROVIDERS, JSONP_PROVIDERS],
    directives: [NgFor]
})

class PostComponent {
    public post_list;
    public request;

    constructor(jsonp:Http) {
        jsonp.request('http://ng.vaivei.com/api_json/get_recent_posts/')
            .subscribe(response => this.post_list = response.json());
        console.log(this.post_list);

    }

    //public title = 'Lakers';
    //public hero:Hero = {
    //    id: 24,
    //    name: 'Kobe Bryant',
    //    team: 'Lakers',
    //    age: 37
    //}
}
bootstrap(PostComponent);
