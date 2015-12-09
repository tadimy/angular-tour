# AngularJS 2.0 依赖注入

## 什么是依赖注入

## 全新的依赖注入方式
在AngularJS 2 中，其开发团队重新设计了依赖注入，要深入理解新的依赖注入（DI2），先要知道下面三个名词：

* Injector - 注入容器(injection container) 用来实例化对象和解决依赖关系。Injector 是 new 操作符的一个替代方案，借助它可以自动解决构造函数的依赖。程序在构造函数中可通过 Injector解决依赖。

```javascript
import { Injector } from 'angular2/di';

@Injectable()
class Engine {}

@Injectable()
class Car {
    constructor(public engine Engine) {}
    }
var injector = Injector.resolveAndCreate([Car, Engine]);
var car = injector.get(Car);
expect(car instanceof Car).toBe(true);
expect(car.engine instanceof Engine).toBe(true);
```

* Provider - 描述 Injector 实例化依赖的方式

```javascript
import { Injector } from 'angular2/di';

var injector = Injector.resolveAndCreate([
    new Provider("message", {useValue: "Hello"})
]);

expect(injector.get("message")).toEqual("Hello");
```

* Dependency - 依赖(Dependency),即需要被实例化的类型

在上面的代码实例中，程序引入了 Injector, 它可以把一些静态的 API 注入程序。其中 resolveAndCreate() 是一个可以创建 injector，它可以接受一个 provider 列表作为参数。注意这一行代码：

```javascript
var car = injector.get(Car);
```

这行代码可获得一个 Car 的实例，那么 Angular 是如何知道程序想要实例化哪个类呢？再看看这一段代码：

```javascript
import { Inject } from 'angular2/di';

class Car {
    constructor(
        @Inject(Engine) engine
    ) {
    ...
    }
}
```

上面的程序从 angular2 DI 中引入了 Inject 模块，并且用它来修饰(decorator) Car 类的构造函数参数。 Inject 装饰器将一些元数据传给 Car类，这些元数据会被 DI 系统使用。所以简单说，@Inject(...) 标记这个构造函数的参数必须是 Engine 的一个实例。下面是使用 Typescript 重写的这段代码：

```javascript
class Car {
    constructor(engine: Engine) {
        ...
    }
}
```
