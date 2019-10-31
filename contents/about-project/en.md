---

id: about-project
absolute_path: /about/project
date: 2019-03-10 15:01
title: About Project ddadaal.me
ignored_in_list: true
lang: en

---

# Website Information

[![Build Status](https://travis-ci.org/ddadaal/ddadaal.me.svg?branch=master)](https://travis-ci.org/ddadaal/ddadaal.me)

ddadaal.me is a website designed and coded based on gatsby, without the use of existing website solutions like Wordpress, Typecho, Hexoetc. Any discussions and contributions to the repository are welcomed.


GitHub: https://github.com/ddadaal/ddadaal.me

# A Personal Blog Odyssey

It has been a long way for ddadaal.me to be the one you are looking at right now. To see the epic journey that ddadaal.me, its predecessor VicBlog and I have been through since 2010, please check out [A Personal Blog Odyssey](/about/odyssey/en).

# Implementations

Since 2016, ddadaal.me has been implemented several times with differences in technologies used and mostly the abilities I had during its implementation and maintenance.

## Current Implementation

[ddadaal.me](https://github.com/ddadaal/ddadaal.me)

Started in **August 2018** and written with `Gatsby` framework, the blog itself is now a **static** website.

It's neither **frontend backend separation**, since there is no backend dynamically retrieving and providing data to frontend, nor a **traditional website** in which the server receives requests, gets data, parses templates and then sends back to browser.

The whole website is fully implemented with **frontend technologies**. The **WEBSITE** itself is written with `React`, and the **CONTENTS** are written with `markdown`. During development and writting, the two parts are completely separated: no coding needed when writing articles; no markdown when implementing and modifying functions.

The two meet each other during **build**, when **CONTENTS** are *interpreted* and *converted* to JS objects, and then the data is *provided* into the **WEBSITE** via `props`. The **WEBSITE** program is executed and *server rendered*, resulting in **valid HTML/CSS string**, with which browser can *display directly* first screen without the execution of JS. The generated HTML/CSS files as well as the JS itself are then *published* to a server (currently `GitHub Pages`) , whose only responsibility is to provide **these prebuilt static files** directly to the client when requests arrive. This pattern is usually called `prerender`.

This implementation requires **no calculation capability** for the server, since all calculations are done during build, and the server only provides static HTML/CSS/JS contents, which enables efficient caching, easy maintanance and low (or no) costs.

The downside is that **all contents** are determined during build, therefore functions that need dynamic data, like **comments** and **visitor statistics** are not possible, unless dedicated servers or service providers are used and interoperated with APIs, like on a `frontend backend separation` website.

To implement comments, my choice is [`gitalk`](https://github.com/gitalk/gitalk), which hosts comments on GitHub issues directly. For statistics, ~~I deployed a [`matomo`](https://matomo.org/) instance on a Tencent Cloud VPS, and injected a JS script into the website, which records user usage and sends them to the `matomo` server~~I used [CNZZ](https://web.umeng.com/main.php?c=user&a=index) since it is free, hosted in China and is adaquate for me.

## Lagecy Versions

### React + ASP.NET Core SPA Second Version (Started in March, 2017)

[VicBlog-Frontend](https://github.com/ddadaal/VicBlog-Frontend)

[VicBlog-Backend](https://github.com/ddadaal/VicBlog-Backend)

It is a full-fledged SPA using `React` + `MobX` + `TypeScript` in frontend and `ASP.NET Core` + `Entity Framework Core` in Backend communicating with RESTful API and deployed on `GitHub Pages` and `Microsoft Azure` respectively. It contained all functions that I ever wanted in a personal blog before its EOL. It has learned from previous SPA version and been refactored for better readability, performance, maintainability etc. In the end, it has been discontinued for the efforts required to maintain both codebases and underwhelming performance. The aforementioned Gatsby-based static VicBlog and its successor ddadaal.me takes its place since August 2018.

### React + ASP.NET Core SPA First Version (Started in Dec 2016)

Repos have been overridden by SPA second version.

It was the first time I started to write a frontend-backend-separated website using latest technologies like React + Redux + TypeScript + Ant Design, ASP.NET Core and RESTful APIs. It was deployed online after a one-month development. However, several severe problems (like disorganized codebase and architecture) were realized so that it was quickly abandoned and replaced by the second version since March 2017.

### Flask (Started in Oct 2016)

[VicBlog-Flask](https://github.com/ddadaal/VicBlog-Flask)

It was the first time I started to write a full website on my own with only little understanding on web development. It used a easy-to-learn technology stack, Flask + MongoDb in backend and jQuery + Bootstrap in frontend, to achieve fast development. It went to live for months after development and dropped since SPA started to become mainstream.

The same repo contains other two branches containing the initial commits when learning React and ASP.NET Core.
