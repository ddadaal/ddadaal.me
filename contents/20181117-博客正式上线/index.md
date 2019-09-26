---
id: gatsby-powered-vicblog-online
date: 2018-11-17 14:51
title: 新博客正式上线
lang: cn
tags:
  - blog
---

# 为什么又换了？？

相信大家看到这个文章，第一反应如标题：**为什么又换了？？**

上个寒假花了20天，用React+ASP.NET Core完整撸了一套博客网站出来。本以为就这样就可以了，结果却漏洞百出，且维护成本极高，例如：

- 后端20请求能爆5个异常，大部分和网络请求有关（不知道为什么都在Azure上访问还是会很慢……
- 没有管理员管理界面，甚至没有文章编辑器，写文章还得手动发POST请求，更别提图床（上传图片）了
- 性能很不好，每次访问界面都需要去Azure拿数据，放GitHub Pages上的前端虽然已经做了代码分割，可是在国内GitHub Pages的速度也是不敢恭维，导致每次访问博客的速度非常慢
- 加功能成本极大，需要前后端都写。前后端分离有利于多人分工，可是却增大了工作量，对个人开发来说就是一种负担

因此，这套完整的博客系统虽然功能强大和完整，但是日常维护起来可是非常难受。

# Gatsby to the rescue!

不久前偷窥其他同学的GitHub发现了Gatsby，从此打开了新世界，马不停蹄地把博客用Gatsby重做一下。

花了两天时间（其实也就10个小时）撸了一个博客出来。这里推荐一个工具wakatime，可以记录每天编程的时间、语言、项目，知道自己到底花了多少时间在编程上。

![wakatime](./wakatime.png)

为什么最后用Gatsby？

- 高性能

Gatsby最后生成的是静态网页，不需要折腾部署，并且便于被CDN和缓存

- 灵活，能够用上React和整个npm前端生态圈

有人看到这个之前可能要问为什么不直接用hexo这种专门写博客的框架，这就是我的原因。hexo等这种静态博客工具过于局限，也不便于用上React等现在已经非常成熟的前端框架来让开发过程更加现代化。同样，Gatsby的灵活也便于扩展网站的功能和自定义。Gatsby有自己的生态系统，这个生态系统里的工具用起来有时还更爽更简单。

当然，Gatsby也是有坑的，例如一些开源项目通病

- 文档不完整或者写得不好
- 网络上的教程质量不高
- 第三方插件质量参差不齐

只不过这些坑踩过之后影响不大，并且随着时间的推移越做越好了。

# 上线

原型撸完之后，又经过这么久的调试、测试和数据迁移，新博客总算是正式上线了。

新的博客有如下的特性：

- Static website with modern web technologies
- Full Support for Progressive Web Application
- Articles written on markdown
- Full i18n
- Styling with both [styled-components](https://github.com/styled-components/styled-components) and SCSS
- Source code and contents separated
- Comment system via [gitalk](https://github.com/gitalk/gitalk)
- Icons via [react-icons](https://github.com/react-icons/react-icons)

现在的版本基本已经满足了我对博客的所有期望。

> 博客的大厦已经基本建好，接下来只需要小修小补即可

希望大家多多支持，多发评论多发邮件和[反馈](/cn/feedback)！谢谢大家！
