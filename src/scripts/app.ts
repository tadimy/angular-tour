import {bootstrap, Component, FORM_DIRECTIVES} from 'angular2/angular2';

class Hero {
    id:number;
    name:string;
    team:string;
    age:number;
}

@Component({
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
    <h2>{{hero.name}} details!</h2>
    <div>
    <label>ID:</label>
    {{hero.id}}
    </div>
    <div>
    <label>Name:</label>
    {{hero.name}}
    </div>
    <div>
    <label>Age:</label>
    <input [(ng-model)]="hero.age" placeholder="Input Age"/>
    {{hero.age}}
    </div>
    `,
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
