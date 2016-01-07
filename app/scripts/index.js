var app_1 = require("./app");
var core_1 = require('angular2/core');
var bootstrap_1 = require('angular2/bootstrap');
var router_1 = require('angular2/router');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var reflection_capabilities_1 = require('angular2/src/core/reflection/reflection_capabilities');
function main() {
    reflection_1.reflector.reflectionCapabilities = new reflection_capabilities_1.ReflectionCapabilities();
    bootstrap_1.bootstrap(app_1.PostListApp, [router_1.ROUTER_PROVIDERS, core_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })]);
}
exports.main = main;
