/**
 * Created by Angular2 on 15-11-27.
 */
import {PostListApp} from "./app"
import {bind, provide} from 'angular2/angular2';
import {bootstrap} from 'angular2/bootstrap';
import {ROUTER_PROVIDERS, HashLocationStrategy, LocationStrategy} from 'angular2/router';

import {reflector} from 'angular2/src/core/reflection/reflection'
import {ReflectionCapabilities} from 'angular2/src/core/reflection/reflection_capabilities';
export function main() {
    reflector.reflectionCapabilities = new ReflectionCapabilities();
    bootstrap(PostListApp, [ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
}