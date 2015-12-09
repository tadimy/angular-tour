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
这样 DI 就可以从依赖声明里读取任何要初始化 Car 这个类所需要模块。但注入器(Injector)是怎么知道如何创建这个对象呢？这就轮到 providers 登场了。还记得上面讲到的 resolveAndCreate() 方法吗？
```javascript
var injector = Injector.resolveAndCreate([
    Car,
    Engine
]);
```
看到这段代码你可能会疑惑这个类列表为什么会被识别是一组 providers。其实上面的代码只是使用了简单的语法来描述需要被实例化的依赖类，下面这段代码更清晰的帮助理解其机制：
```javascript
var injector = Injector.resolveAndCreate([
    provide(Car, {useClass: Car}),
    provide(Engine, {useClass: Engine})
]);
```
这段代码中使用了 provide() 函数来为需要被实例化的对象和标识(token)之间建立了映射关系，这里的标识(token)既不是一个类型也不是字符串。代码中使用 Car 类实例化了一个 Car 类型变量，同样使用 Engine 类实例化了一个 Engine 类型变量。通过这种方式，不仅可以向程序中注入指定类作为依赖，并且可以配置这些依赖被注入程序的方式。
上面提到了本文中最开始使用短语法描述需要被实例化的类，刚刚又有一段用长语法方式来做这个事情，那么什么时候使用短语法？什么时候使用长语法？看看这行代码：
```javascript
provide(Engine, {useClass: otherEngine});
```
对比就能发现，长语法可用于为标识(token)与任何对象建立映射关系，可能那个 otherEngine 根本就不是一个描述汽车引擎的类...。这种方式在 AngularJS 1.x 中是不可行的，或者说实现起来很复杂。

### 其他 provider 配置

