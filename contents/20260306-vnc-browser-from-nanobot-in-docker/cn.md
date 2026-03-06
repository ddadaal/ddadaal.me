---
id: vnc-browser-from-nanobot-in-docker
date: 2026-03-06 18:50
title: 把nanobot关进Docker后，如何同时保留浏览器可视化与自动化
lang: cn
tags:
  - ai
  - nanobot
---

实在不太放心把 nanobot 这类可以直接操作本地电脑的程序直接装在操作系统上，所以我选择把 nanobot 放在容器里运行。但是nanobot很多有意义的工作又需要和宿主机上的环境（例如浏览器）交互，而浏览器上很多网站需要我们先去登录才可以正常使用，这就需要一个既可以由 nanobot操作、也可以由我们自己的操作的浏览器

经过一番查找，终于找一个不影响 nanobot 本身的方法，操作是在部署 nanobot的 `docker-compose.yaml` 目录下再创建一个 `docker-compose.override.yaml`，内容如下：

```yaml
services:
  chromium-vnc-cdp:
    image: linuxserver/chromium:latest
    container_name: chromium-vnc-cdp
    ports:
      - "3000:3000" # Web 界面
    shm_size: "2gb"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - CHROME_CLI=--remote-debugging-address=127.0.0.1 --remote-debugging-port=9222

  chromium-cdp-proxy:
    image: alpine/socat
    container_name: chromium-cdp-proxy
    restart: unless-stopped
    network_mode: "service:chromium-vnc-cdp"
    command: "TCP-LISTEN:19222,fork,bind=0.0.0.0,reuseaddr TCP:localhost:9222"
```

启动后，给 nanobot 一条明确指令：

> 之后都使用 `chromium-vnc-cdp:19222` 这个 CDP 端口操作浏览器。

## 为什么是两个容器

`chromium-vnc-cdp` 的职责是提供浏览器本体和 Web 访问界面（3000 端口），这样我们可以直接使用`localhost:3000`访问这个浏览器。

`chromium-cdp-proxy` 的职责是把 Chromium 容器里只监听 `127.0.0.1:9222` 的 CDP 端口，转发成同网络命名空间下可访问的入口。实际上这两个容器在同一个网络中，所以需要换个端口监听，这里选择了`19222`，其他任何端口都可以。

这里有一个关键限制：根据 pyppeteer 相关讨论中的实践结论，`--remote-debugging-address=0.0.0.0` 往往需要和 `--remote-debugging-port`、`--headless` 一起使用；但一旦使用 `--headless`，就无法达到“实时查看浏览器界面”的目标。

来源：<https://github.com/pyppeteer/pyppeteer/pull/379#issuecomment-2072215518>

因此我不走“浏览器直接对外暴露 CDP”的路线，而是保留有界面的 Chromium，再通过独立的 `socat` proxy 容器做端口转发。

这样拆分有三个好处：

1. 浏览器容器保持默认安全策略，CDP 仍然只在本地监听。
2. 通过 `socat` 单独做代理，不需要改 Chromium 镜像或启动脚本。
3. nanobot 只需要记住一个固定地址（`chromium-vnc-cdp:19222`），配置简单且稳定。

## 实际效果

这套配置完成后：

1. 你可以在 `3000` 端口看到浏览器 Web 界面。
2. nanobot 可以通过约定好的 CDP 地址持续复用同一个浏览器环境。
3. 浏览器自动化和人工观察（VNC/Web）可以并行进行，排障体验更好。

