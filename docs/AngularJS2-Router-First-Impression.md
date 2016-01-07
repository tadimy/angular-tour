# AngularJS2 路由入门

## 什么是路由
我们开发任何web应用都离不开路由的概念，一个 http 请求从客户端发起，被 web 系统接到后，web 系统通过其特定的路由策略找到一个“资源”并返回给客户端。把一个 web 系统看作是一幢大楼，那么“路由”就是这幢大楼里的电梯、楼梯、门以及消防通道等可以给用户走的路径

> 从使用 Angular 框架开始，就告别了页面真实跳转的时代，页面之间的跳转全部由其集成的路由机制实现，这让我们的网页应用看起来更像原生的应用。
本质是借助解析页面内跳转的特性来实现的。

### AngularJS 1.x 中的路由

### AngularJS 2 中的路由
接下来先了解几个核心的概念：
1. 路由是一个根据一个URL提供对应的模块视图的服务，当URL改变时，路由服务从程序的配置 (RouterDefinition) 中寻找对应的模块。

    下面就是一个典型的路由配置
```typescript
@Component({...})
@RouteConfig([
    new Route({path: '/posts', component: PostListComponent, name: 'Posts'}),
    new Route({path: '/post/:id', component: PostComponent, name: 'Post'})
])
```

2. Router Outlet
  Route Outlet 是一个为 AngularJS 动态填充内容准备的占位符
  使用方法：
  ```html
  <router-outlet></router-outlet>
  ```
  那么 AngularJS 会在这个标签里填充什么内容呢？
  根据上面的路由配置(`RouterConfig`), 当我们访问 `/posts` 的时候，程序会在`Router Outlet`中渲染`PostListComponent`。
3. Router Link
  `Router Link`是`AngularJS2`中一个很常见的指令(`Directive`)，它被用来在页面中定义路由链接。
  使用方法：
  ```html
  <a [routerLink] = "['/Posts']"></a>
  ```
