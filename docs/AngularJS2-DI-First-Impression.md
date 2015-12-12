# AngularJS 2.0 依赖注入

## 什么是依赖注入
依赖注入，顾名思义，就是把需要的东西(Dependency)放在一个注射器里(Injector)推入应用程序内，依赖(Dependency)可以是必需的，也可以是非必需的(Optional)。

## AngularJS 1.x 的依赖注入
依赖注入是 AngularJS 的最大特点之一，通过依赖注入这种设计模式，可以让代码变得清晰，让一个类只关心它的核心业务，而不需要做与它的业务关系不大的事情。
> 依赖注入让我们遵守这样一种开发风格，我们的类只是简单地获取它们需要的东西，而不需要创建那些它们所依赖的东西。
-- <<用 AngularJS 开发下一代应用>>

下面这段代码展示的是 AngularJS 1.x 中依赖注入的方式

```javascript
var app = angular.module('myApp', []);
app.service('Car', Car);
app.service('OtherService', function(Car) {
  ...
});
```
这样做显然让我们的代码更具可维护性，但是有几个缺点：
* **内部缓存** 1.x 中的依赖注入是单例模式的，在一个生命周期里只能被注入一次。
* **命名空间冲突**
  这个问题主要表现在，当程序需要注入一个名为 Car 的 service 的时候，又有一个第三方的模块也叫 Car, 程序员不得不修改自己的类名才能解决这个冲突了。
* **无法独立使用**
  AngularJS 1.x 的 DI 是被继承在框架内部的，无法独立使用，而 AngularJS 本身是一个较为庞大的框架，当工程里只需要它的依赖注入时，无法独立使用。

## 全新的依赖注入方式
在AngularJS 2 中，其开发团队重新设计了依赖注入，要深入理解新的依赖注入（DI2），先要知道下面三个名词：

* Injector - 注入容器(injection container) 用来实例化对象和解决依赖关系。Injector 是 new 操作符的一个替代方案，借助它可以自动解决构造函数的依赖。程序在构造函数中可通过 Injector解决依赖。

[(演示示例)](http://plnkr.co/edit/Bm6jQx)

##### 代码段
```typescript
import { Injector, Injectable } from 'angular2/angular2';

@Injectable()
class Engine{
  name:string;
  constructor() {
    this.name = 'v8';
  }
  getName() {
    return this.name
  }
}

class V16Engine{
  name:string;
  constructor() {
    this.name = 'v16';
  }
  getName() {
    return this.name
  }
}

@Injectable()
class Car {
    constructor(@Inject(Engine) engine) {
      this.engine = engine;
    }
}
var injector = Injector.resolveAndCreate([Car, Engine]);
var car = injector.get(Car);
var injector = Injector.resolveAndCreate([Car, provide(Engine, {useClass: V16Engine})]);
var car = injector.get(Car);
var engine = injector.get(Engine);
expect(car instanceof Car ).toBe(true);
expect(car.engine instanceof Engine).toBe(false);
expect(car.engine instanceof V16Engine).toBe(true);
```

* Provider - 可以理解为一个可被注入的服务，每一个 Provider 相当于一个原子容器，里面装着的就是需要被注入的依赖以及描述 Injector 实例化依赖的方式。

[(演示示例)](http://plnkr.co/edit/awreV6)
##### 代码段
```typescript
import { Injector } from 'angular2/angular2';

var injector = Injector.resolveAndCreate([
    new Provider("message", {useValue: "Hello"})
]);

expect(injector.get("message")).toEqual("Hello");
```
上面这段代码中，注入依赖的方式变成了实例化一个 Provider 对象，与直接在参数里写要注入的对象不同，这种方式提供了多种参数可以配置引入依赖的方式。本文稍后的部分会详细介绍每一种方式的用法。

* Dependency - 依赖(Dependency), 即在程序初始化的时候需要被引用的模块/类 。

在上面的代码实例中，程序引入了 Injector, 它可以把一些静态的 API 注入程序。其中 resolveAndCreate() 是一个可以创建 injector，它可以接受一个 provider 列表作为参数。注意这一行代码：

```typescript
var car = injector.get(Car);
expect(car instanceof Car).toBe(true);
```
这行代码可获得一个 Car 的实例，那么 Angular 是如何知道程序想要实例化哪个类呢？再看看这一段代码：

```javascript
import { Inject } from 'angular2/angular2';

class Car {
    constructor(
        @Inject(Engine) engine
    ) {
    ...
    }
}
```

上面的程序从 angular2 DI 中引入了 Inject 模块，并且用它来修饰(decorator) Car 类的构造函数参数。 Inject 装饰器将一些元数据传给 Car 类，这些元数据会被 DI 系统使用。所以简单说，@Inject(...) 标记这个构造函数的参数必须是 Engine 的一个实例。下面是使用 Typescript 重写的这段代码：

```typescript
class Car {
    constructor(engine: Engine) {
        ...
    }
}
```
这样 DI 就可以从依赖声明里读取任何要初始化 Car 这个类所需要模块。但注入器(Injector)是怎么知道如何创建这个对象呢？这就轮到 providers 登场了。还记得上面讲到的 resolveAndCreate() 方法吗？
```typescript
var injector = Injector.resolveAndCreate([
    Car,
    Engine
]);
```
看到这段代码你可能会疑惑这个类列表为什么会被识别是一组 providers。其实上面的代码只是使用了简单的语法来描述需要被实例化的依赖类，下面这段代码更清晰的帮助理解其机制：
```typescript
var injector = Injector.resolveAndCreate([
    provide(Car, {useClass: Car}),
    provide(Engine, {useClass: Engine})
]);
```
这段代码中使用了 provide() 函数来为需要被实例化的对象和标识(token)之间建立了映射关系，这里的标识(token)既不是一个类型也不是字符串。代码中使用 Car 类实例化了一个 Car 类型变量，同样使用 Engine 类实例化了一个 Engine 类型变量。通过这种方式，不仅可以向程序中注入指定类作为依赖，并且可以配置这些依赖被注入程序的方式。
上面提到了本文中最开始使用短语法描述需要被实例化的类，刚刚又有一段用长语法方式来做这个事情，那么什么时候使用短语法？什么时候使用长语法？看看这行代码：
```typescript
provide(Engine, {useClass: otherEngine});
```
对比就能发现，长语法可用于为标识(token)与任何对象建立映射关系，可能那个 otherEngine 根本就不是一个描述汽车引擎的类...。这种方式在 AngularJS 1.x 中是不可行的，或者说实现起来很复杂。

### 其他 provider 配置
当不需要一个类的实例而仅仅需要一个简单的值（比如一个字符串）时候，可以使用如下的集中方式来配置 provide(),下面这段代码是 AngularJS 2.0 中 provide() 方法的描述：

```typescript
export provide(token: any, {useClass, useValue, useExisting, useFactory, deps, multi}: {
  useClass?: Type,
  useValue?: any,
  useExisting?: any,
  useFactory?: Function,
  deps?: Object[],
  multi?: boolean
}) : Provider
```

#### useValue
可以通过 {useValue: value} 这种配置来提供一个简单的值：
```typescript
provide(String, {useValue: "Hello World"});
```
useValue 会告诉 DI 其配置的一个简单的值。
#### useExisting
这个机制可以用来为已经注入的依赖取个别名：
```typescript
provide(Engine, {useClass: Engine});
provide(AirplaneEngine, {useExisting: Engine});
```
#### useFactory
如果你使用过 AngularJS 1.x，factory 这个玩意儿你应该很熟悉，想想都有点小激动，看看怎么用：
```typescript
provide(Engine, {useFactory: () => {
    return function() {
            if (IS_V8) {
                return new V8Engine();
            } else {
                return new V6Engine();
            }
            }
});
```
如果被引用的 factory 还需要其他的依赖，需要再定义一个属性:
```typescript
provide(Engine, {
    useFactory: (car, engine) => {},
    deps: [Car, Engine]
    });
```
#### Multi:boolean
指定 multi 参数可为同一个 token 映射多个 provider。 Multi-providers 可被用于创建可嵌入的服务，当系统初始化时自带了一些默认的 provider，用户仍然可以注册其他的 provider。默认 provider 和附加的 provider 同时驱动系统中的各种行为。
```typescript
var injector = Injector.resolveAndCreate([
    new Provider("Strings", {useValue: "String1", multi: true}),
    new Provider("Strings", {useValue: "String2", multi: true})
]);

expect(injector.get("Strings").toEqual(["String1", "String2"]);
```
但是这么使用是不允许的：
```typescript
var injector = Injector.resolveAndCreate([
    new Provider("Strings", {useValue: "String1", multi: true}),
    new Provider("Strings", {useValue: "String2"})
]);
```
到此可了解到，新的 DI 解决了很多AngularJS 1 中的问题。

> 注意，新的 DI 仍然会创建单例。
于是一个新的问题来了，如果需要在程序中实例化一个临时的对象（非单例）应该怎么做？答案是使用 factory。

```typescript
provide(Engine, {useFactory: () => {
    return () => {
        return new Engine();
        }
    }
});
```
这里 Factory 会返回 Engine 类的实例，而不是单例。

#### Child Injector
AngularJS 2 的 Injector 还提供了一个 resolveAndCreateChild() 方法用来创建一个 child injector。
```typescript
class ParentProvider {}
class ChildProvider {}
var parent = Injector.resolveAndCreate([ParentProvider]);
var child = parent.resolveAndCreateChild([ChildProvider]);
// child injector's ParentProvider is an instance of ParentProvider
expect(child.get(ParentProvider) instanceof ParentProvider).toBe(true);
// child injector's ChildProvider is an instance of ChildProvider
expect(child.get(ChildProvider) instanceof ChildProvider).toBe(true);
// child injector's ParentProvider is an instance of parent injector's ParentProvider
expect(child.get(ParentProvider)).toBe(parent.get(ParentProvider));
```
这一段代码逻辑稍微复杂一点，但是细心一点就会发现，child 是从 parent 那里继承了ParentProvider，并且自己还增加了 ChildProvider。所以 child 其实注入了两个 provider。

## 实战 AngularJS 2 依赖注入
前面把 DI2 的一些细节逐一介绍了，接下来通过一个完整的示例程序进一步厘清编写 AngularJS 2 的依赖注入方式。
```typescript
import { Component, View, bootstrap,Injector, Inject, Injectable, provide} from 'angular2/angular2';
import { provide } from 'angular2/angular2';

// @Injectable()
class Engine{
  name:string;
  constructor() {
    this.name = 'v8';
  }
  getName() {
    return this.name
  }
}

class V16Engine{
  name:string;
  constructor() {
    this.name = 'v16';
  }
  getName() {
    return this.name
  }
}


class Tires{

}

class Car{
  name:string;
  engine: V16;
  constructor(
    @Inject(Engine) engine
    ){
      this.name = 'Tesla';
      this.engine = engine;
  }
}

var jasmineEnv = jasmine.getEnv();
var injector = Injector.resolveAndCreate([Engine, Car]);
describe("Engine Can Be Inject", function() {
  it("To be True", function() {
    expect(injector.get(Car) instanceof Car ).toBe(true);
  });
});
jasmineEnv.execute();

@Component({
  selector: 'car',
  viewProviders: [
    provide(Engine, {useClass: V16Engine}),
    Car
    ]
})
@View({
  template: `<dl>
  <dt>Car Name</dt>
  <dd>{{car.name}}</dd>
  <dt>Car Engine Name<dt>
  <dd>{{car.engine.name}}</dd>
  </dl>`
})

class CarCmp{
  car:Car;
  constructor(@Inject(Car) car){
    this.car = car;
  }
}

@Component({
    selector: 'app'

})
@View({
    template: '<car></car> ',
    directives: [CarCmp]
})
class App{

}

bootstrap(App);
```

参考资料：
* [Dependency Injection in Angular 2](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html)

* [AngularJS 2 Official Documents](https://angular.io/docs/)
