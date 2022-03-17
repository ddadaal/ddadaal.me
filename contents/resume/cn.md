---

id: resume
absolute_path: /resume
date: 2020-10-25 16:20
title: 简历
lang: cn
ignored_in_list: true
hide_heading: true
no_toc: true

---

<resume>

<h1 class="name">
陈俊达
</h1>

<h3 class="contact">ddadaal@outlook.com | QQ 540232834 | 微信 ddadaal | https://ddadaal.me

</h3>

# 教育经历

## <span class="highlight">北京大学 信息科学技术学院</span> <span class="right">2020年9月-现在</span>

### 攻读计算机应用技术专业硕士；预计2023年7月毕业；GPA 3.73/4.0, 所有专业课成绩均在A-或以上

- 属于北大计算中心高性能平台组，负责设计、实现和运维超算相关信息系统，部署并运维内部GitLab和CI/CD设施

## <span class="highlight">南京大学 软件学院</span> <span class="right">2016年9月-2020年7月</span>

### 软件工程专业学士；2020年毕业；学位课程GPA 4.62/5.0；排名 1/220
- **国家奖学金**(2016-2017学年)， **董氏东方奖学金**和**校级优秀学生**(2017-2018学年)，**深交所奖学金**(2018-2019学年)，**校级优秀毕业生**

# 实习经历

## <span class="highlight">Alluxio</span> <span class="right">2021年12月-2022年3月</span>
### Software Engineer Intern

- Alluxio是一个创业公司，产品是一个开源的大规模数据编排工具，在最近一轮融资中融到了5千万美元
- 给alluxio增加了libfuse3的支持；给一个客户做了POC；参与集群自动化部署和测试的内部工具的开发

## <span class="highlight">微软苏州工程院</span> <span class="right">2019年7月-10月</span>
### Software Engineer Intern

- Office 365 Deployment组，负责内部部署监控网站的前端和后端开发； 实现并上线了3个新功能，优化了多个功能的性能和代码设计

# 项目经历（GitHub: ddadaal，个人网站 https://ddadaal.me）

## **北大超算运行管理系统** <span class="right">2021年9月-现在</span>

- 需求来自组内核心业务。独立负责开发和运维，已在一个集群上部署并试用，计划在学校的超算中全面推广
- 已实现：基于Web的终端、文件管理；多租户、多集群的账户用户管理、作业管理、作业计费收费，支持slurm调度器
- 正在实现更多面向用户的功能，如作业提交、基于Web的远程桌面等
- 相关技术：gRPC, Next.js, TypeScript, Docker, MySQL

## **第三届全国高校数据驱动创新研究大赛官方网站** data-competition.pku.edu.cn  <span class="right">2021年3月-7月</span>

- 北大信管等院系和部门主办的社科类比赛，网站具有信息展示，团队注册、报名、管理，提交成果等功能
- 主办单位提出需求，我独立负责需求细化、设计、前后端开发和运维
- 1000注册用户，200注册团队，至今总PV 73000
- 相关技术：Next.js,Fastify, TypeScript, MySQL, Docker, Grafana+Prometheus+Loki

## **个人网站** ddadaal.me <span class="right">2016年9月-现在</span>

- 基于Gatsby静态网页框架，自己设计布局和排版，支持响应式设计、多语言、markdown内容和网站代码分离

## 项目相关奖项

- 2021年HackPKU Hackathon比赛**二等奖**（校园食堂小程序，4人团队，负责小程序端）
- 2020年区块链技术网络安全应用创新大赛**一等奖**（基于区块链的教育信息验证系统，2人团队）
- 2019年NJU & VIVO Hackathon比赛**一等奖**（学术论文分享社交平台，4人团队，负责Web前端）
- 2018年第14届“花旗杯”金融创新应用大赛**一等奖**（基于人工智能的大类资产配置系统，技术9人，负责Web前端）
- 2018年“链谷杯”全国高校区块链应用链应用大赛**三等奖**，第三届全国高校区块链大赛**全国二等奖**（类GitHub的区块链信息平台，4人团队，负责技术架构设计和平台的demo应用）

## 开源项目和相关经历

- [`next-typed-api-routes`](https://github.com/ddadaal/next-typed-api-routes)
    - 给Next.js API Route定义一个TS接口，本库自动实现参数验证、类型自动完成、调用API的方法和更快的JSON响应序列化
- [`react-typed-i18n`](http://github.com/ddadaal/react-typed-i18n)
    - 强类型的React i18n库。用户定义ID和ID对应的文本，库使用TS的类型系统提供对ID的类型检查和自动完成，并在运行时零开销
- [`tsgrpc`](https://github.com/ddadaal/tsgrpc)
    - 一个Node生态下的gRPC服务器端框架，API设计类似fastify，以及包装了一个proto生成器和一些帮助函数
- 对`fastify-multipart`, `fastify`等开源项目有过贡献

# 技能/其他

- 了解Web项目前端（`React`技术栈）、后端（主要为`Node.js`）的实现和设计，能独立负责小型项目的需求、设计、开发和运维工作
- 熟悉`TypeScript/JavaScript`, `C#`语言，编写过`Java`, `Python`, `Go`, `Rust`等语言的项目
- 课程中实现了**编译器Lexer, Parser, IR优化**、**Android自动化测试**、**一些图计算算法**、**Go和Rust版本的Raft算法**等
- 南京大学微软学生俱乐部2018-2019年度主席，经历和贡献被MSRA官方微信公众号介绍：https://ddadaal.me/r/msc

</resume>
