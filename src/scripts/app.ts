import {bootstrap, Component, FORM_DIRECTIVES} from 'angular2/angular2';

class Hero {
    id:number;
    name:string;
    team:string;
    age:number;
}

@Component({
    selector: 'post-list',

    directives: [FORM_DIRECTIVES]
})

class AppComponent {
    public title = 'Lakers';
    public hero:Hero = {
        id: 24,
        name: 'Kobe Bryant',
        team: 'Lakers',
        age: 37
    }
}
bootstrap(AppComponent);
