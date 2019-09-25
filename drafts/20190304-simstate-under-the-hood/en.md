---
id: "simstate-under-the-hood"
date: "2019-3-4 23:50"
title: "Simstate Under the Hood"
lang: en
tags:
  - simstate
  - React
---

# Introduction

If you are new to my blog, and are wondering what is [simstate](https://github.com/viccrubs/simstate), you should probably check out [simstate and why](/articles/simstate-and-why) first before continuing reading this article. This article will focus on the implementation details of this library, explain how all of the components work and why they are designed this way, and also some thoughts raised during the development.

# Basic Mechanism

This library is hugely inspired by the awesome [unstated](https://github.com/jamiebuilds/unstated), which shows not only similar APIs, but also the basic mechanism. The most important ones, which I believe some of you may have guessed out already, are

[React Context](https://reactjs.org/docs/context.html) for passing stores to anywhere in the component tree
- **Observer Pattern** to observe changes in stores and trigger component update

## Passing Stores using React Context

This is a simple one. React Context has been the
