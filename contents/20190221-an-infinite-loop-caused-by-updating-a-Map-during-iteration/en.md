---
id: "an-infinite-loop-caused-by-updating-a-Map-during-iteration"
date: "2019/02/21 18:47"
title: "An Infinite Loop Caused by Updating a Map during Iteration"
lang: en
tags:
  - JavaScript
---

# The Problem

This is a rare situation that was accidently caused during the development of the next version of [simstate](/articles/simstate-and-why): During the iteration of a ES6 Map, if you

Store.tsx

```tsx
async setState(
  updater: Partial<State> | ((prevState: State) => State),
): Promise<void[]> {

  // ...

  const promises = [] as (void|Promise<void>)[];

  this.observers.forEach((info, observer) => {
    if (!info.deps || info.deps.some((dep) => changedStates.includes(dep))) {
      promises.push(observer());
    }
  });

  return Promise.all(promises);
}
```

