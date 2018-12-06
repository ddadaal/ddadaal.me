---

id_name: "how-to-use-dependency-correctly-in-react"
date: 2018-12-06T21:39:22.058Z
title: "在React中如何正确地使用依赖"
draft: true
tags:
  - React

---

# 使用依赖到底有多少种方法？

所谓“使用依赖”，也就是**多个**可能散布在各个文件、各个组件位置的代码**共享同一个**变量的情况。

这种情况太常见了，以至于每个人在编程的各个阶段都经历过。数十年来，不同的大佬都给出了不同的解决方案。

而在React这个语境中，不同的人可能会给出如下的做法：

1. 全局变量
2. 依赖注入（使用[react.di](https://github.com/RobinBuschmann/react.di)这种典型的DI框架）
3. props把对象从顶层组件传下来
4. [Context](https://reactjs.org/docs/context.html)
5. [Higher Order Component](https://reactjs.org/docs/higher-order-components.html)
6. [Hooks](https://reactjs.org/docs/hooks-intro.html)

每个做法都有各自存在的理由，有各自存在的优势和劣势。下面我们来一个一个分析一下。

# 第一个：全局变量

全局变量是最简单的一个使用共享变量的方法。在React语境中，它意味着直接`import { variable } from "shared-module";`将变量导入需要引用的地方。

这种方法的优势就是**简单**，真\*\*\*简单。直接import & export就能解决这种依赖问题。

不仅如此，它还有一个优点：**便于优化**。考虑以下这个简化过的**进行网络请求**的代码：

```js
const USE_MOCK = false;

export function getInformation() {
  if (USE_MOCK) {
      return "mock information";
  }
  return fetch("http://a.com").then((res) => res.json());
}
```

这段代码由于使用了USE_MOCK这个常量，在编译期，编译器会发现if的条件永远为false，那么就会进行“死代码删除”，在编译后的代码中就不会再存在这段if。如果在每个网络请求
