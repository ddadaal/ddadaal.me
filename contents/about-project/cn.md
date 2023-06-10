---

id: about-project
absolute_path: /about/project
date: 2018-12-19 23:45
title: 关于ddadaal.me
ignored_in_list: true
lang: cn

---

# 项目信息

[![GitHub Actions](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fddadaal%2Fddadaal.me%2Fbadge&style=flat-square)](https://actions-badge.atrox.dev/ddadaal/ddadaal.me/goto)

ddadaal.me是一个基于Gatsby开发的网站，并未使用现成网站/博客框架（例如WordPress, Typecho、Hexo等），欢迎讨论和贡献本项目。

项目地址：https://github.com/ddadaal/ddadaal.me

# 一个个人博客的史诗

ddadaal.me经历了很多，才变成你现在看到这个网站。想知道ddadaal.me、其前身VicBlog和我在这个从2010年开始的史诗中的经历，请看[一个个人博客的史诗](/about/odyssey/cn).

# 历史实现

自从2016年开始，ddadaal.me已经用多种技术栈实现过。

## 目前的实现

[ddadaal.me](https://github.com/ddadaal/ddadaal.me)

**自从2018年8月起**，网站转为使用`Gatsby`框架实现，成为了一个**静态**网站。

现在的版本既不是**前后端分离**，因为没有一个**动态获取和提供数据给前端**的后端服务器，也不是动态获取数据、拼接HTML模板字符串的**传统网站**。

整个网站是完全使用**前端技术**实现的。**网站本身**是使用`React`编写的，而**内容（文章）**采用`markdown`格式。在网站开发和文章写作的过程，两部分是完全分离的：在写文章的时候不需要修改网站代码；在写网站代码的时候，也不关心文章有多少、具体内容是什么。

在**构建**时，**内容**被*转换*成为JS对象，之后这些对象通过`props`*提供*给**网站代码**。有了数据，网站代码被执行，React树被*服务器端渲染*成HTML/CSS字符串。浏览器可以在不执行JS的情况下直接根据这些字符串显示**首屏**。然后，这些HTML/CSS文件，再加上编译过的JS文件，就被*发布*到了服务器（目前是`GitHub Pages`），这些服务器的唯一作用就是**提供这些静态文件**给浏览器。这种做法一般被称为**预渲染(prerender)**。

这样的实现**不需要服务器有运算能力**，因为所有运算都在构建期间完成了，服务器端只存储和为客户端提供构建好的HTML/CSS/JS文件，所以这样能够做到**高效的缓存**、**简单的维护**和**低（甚至为0）的成本**。

这样做的缺点是，网站的**所有内容**都在构建期间确定，所以要实现一些需要动态加载和修改内容的功能，例如**评论**和**访客记录**，都需要额外引入服务器或者服务提供商，并像前后端分离一样通过API操作数据。

为了实现**评论**功能，我使用了[`gitalk`](https://github.com/gitalk/gitalk)，它将数据存储在了GitHub Issues上。对于访客记录，~~我部署了一个[`matomo`](https://matomo.org/)实例在我的一台腾讯云机器上，然后在前端界面上注入一个JS脚本，这个脚本将会记录用户的使用情况，并发送到这个`matomo`服务器上。~~我使用了[友盟的网站统计](https://web.umeng.com/main.php?c=user&a=index)，免费、部署在国内，而且对我来说已经足够了。

## 历史版本

### React + ASP.NET Core SPA 第二版（从2017年3月）

[VicBlog-Frontend](https://github.com/ddadaal/VicBlog-Frontend)

[VicBlog-Backend](https://github.com/ddadaal/VicBlog-Backend)

这是一个前端采用`React` + `MobX` + `TypeScript`，后端采用`ASP.NET Core` + `Entity Framework Core`的完整的单页应用（SPA）。前后端采用RESTful API进行通信，前端部署于`GitHub Pages`，后端部署于`Microsoft Azure`。在这个版本结束生命周期之前，这个版本实现了我对一个个人博客所需要的所有功能。它基于前一个SPA版本，并且进行了全面的重构，获得了更好的代码可读性、性能和可维护性。但是最终，因为同时维护前后端太过麻烦以及低于预期的性能，它还是被放弃了。

### React + ASP.NET Core SPA 第一版（从2016年12月）

这些代码被第二版的代码覆盖了。

这是我第一次写前后端分离的网站。我使用了当时最新的技术，`React`, `Redux`, `TypeScript`, `Ant Design`, `ASP.NET Core`和`RESTful API`。它的初版开始花费了一个月，然后被部署到了GitHub Pages和Azure。但是呢，由于经验和能力不足，这个版本的代码质量有巨大的问题，所以在2017年3月就被抛弃并且重写了。

### Flask（从2016年10月）

[VicBlog-Flask](https://github.com/ddadaal/VicBlog-Flask)

这是我第一次完整地写一个网站。因为当时什么都不懂，我就选择了当时最火地、宣称简单易学的Flask技术栈。后端采用了Flask作为Web框架、MongoDB作为数据库，在前端采用了jQuery和Bootstrap。它的开发和上线应该只用了几周。上线一两个月后，由于SPA和前后端分离的开发方式成为了主流，它很快就被下线了。
