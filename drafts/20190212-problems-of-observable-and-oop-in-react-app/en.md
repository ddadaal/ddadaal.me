---
id: "problems-of-observable-and-oop-in-react"
date: "2019/02/12 18:30"
title: "The problems of using observables and OOP in React"
lang: en
tags:
  - React
---

# What's good and what's not so good

[MobX](https://github.com/mobxjs/mobx) and [react.di](https://github.com/RobinBuschmann/react.di) are excellent libraries to integrate observable and object-oriented paradigm into a React app. MobX simplifies the way state is changed by introducing observable mechanism and is generally more performant than a flux framework like Redux. In the mean time, `react.di` brings the widely-adopted `Dependency Injection` mechanism into the frontend which greatly helps in managing complicated dependency relation. MobX with react.di were always my go-to choice for my last React projects.

On the flip side, however, during their extensive use in the A+Quant project for the Citicup Competition, some problems occurred that force me to rethink the impact they brought into my codebase. Although the integration works seeminglessly on the surface, the inconsistencies from deep down between **functional paradigm**(of React) and **object-oriented paradigm**(of MobX and react.di) bring not only conflicts in programming styles between how my project evolves and how React will develop, but also some hidden bugs and problems that sometimes quite hard to debug.

# Conflicts in programming styles

The biggest problem and most obvious consistency is the conflict in the ways React and OOP want programmer to write code in.

MobX and react.di prefer class-based code for good reasons. With react.di, the common (and the only) way to inject an `Injectable` (dependency) into a component is to introduce an instance member with `Inject` decorated, which requires the component to be an **class component** (a functional component can't have a *instance member*), like below.

```tsx
class AComponent extends React.Component {
  @Inject testStore: TestStore;
  // ...
}
```

On the other hand, React encourages to use functional component, because functional component is simpler, more explicit, more efficient in some cases and has more features to expect in the future (like Hooks that can't be used in a class component). `Dependency Injection`-like paradigm can be achieved in React's standard way by using `props` to declare a dependency and using `HOC`, `render props` with [`React Context`](https://reactjs.org/docs/context.html) to inject the dependency into the component.

For example, with react.di, I implement a LocaleMessage component, which receives an id as props and returns its corresponding translation, as follows:

```tsx
@observer
export class LocaleMessage extends React.Component<{ id: string }> {

  @Inject localeStore: LocaleStore;

  render() {
    return this.localeStore.get(this.props.id);
  }

}
```

This component is stateless and therefore should be a functional component, but since it relies on LocaleStore, a dependency that contains the actual information needed for the translation, it has to be written as a class compoennt for the instance to be declared and injected. In comparison with `render props` and `HOC` with `simstate`, class components look less compact and more verbose. (It is not the best, obviously, which is why `Hooks` is so important. More on this later.)

```tsx
// render props
const LocaleMessageWithRenderProps = ({ id }: { id: string }) => (
  <StoreConsumer storeTypes={[LocaleStore]}>
    {({ useStore }) => useStore(LocaleStore).get(id)}
  </StoreConsumer>
);

// HOC
const LocaleMessageWithHOC = withStores(LocaleStore)(
  ({ useStore, id }: WithStoreProps & { id: string }) => (
    useStore(LocaleStore).get(id)
  )
);
```

What's more important, the former (OOP) is also not as extensible, at least not so easy to extend, as render-props and HOCs are, either.

For example, if we need to inject some specific stores differently, the only thing to do for render-props and HOCs is wrap another function or component (which is also a function) upon current components, and use new functions and components instead.

For OOP, however, the first step is to understand how the react.di and TypeScript's reflection work, and then only to find out that it can't be achieved without modifying react.di's source code, if react.di doesn't expose an interface to hook into its injection process.

So,  should not be a hard dilemma since if a developer is really so into OOP paradigm, Angular is a better choice.

## Why not MobX's built-in DI system

If you are familiar with MobX, you might still remember that [MobX has a built-in DI system with an `inject` HOC](https://mobx.js.org/refguide/observer-component.html#connect-components-to-provided-stores-using-inject) to inject a store into a component.

```tsx
const Component = inject("testStore")(({ testStore }) => testStore.value);
```

It is a great feature to have, but injecting a store with a **string** is problematic and even a dealbreaker for me, because it loses type-safety and introduces potential problems that can't be found out during compilation, most of which are due to the **string constant** that is used as the key to identify which dependency to inject in.

In prevention of such accidental mistypes and future rename, usually the string constants will be extracted into string constants, but it would makes the code more cumbersome.

Here is the code snippet in a real-world project written with MobX's built-in DI system. You will the string constant is used at 5 different places (definition, provider, component props definition,)

Constants.tsx
```tsx
// 1. introduce a string constant
// highlight-next-line
const TEST_STORE = "testStore";
```

Provider.tsx
```tsx
const Store = new TestStore();

const stores = {
  // 2. specify the key with string constant
  // highlight-next-line
  [TEST_STORE]: store,
};

function Root(props: { children: ReactNode }) {
  return (
    // 3. spread the keys and stores into the props of Provider component
    // highlight-next-line
    <Provider {...stores}>
      {props.children}
    </Provider>
  );
}
```

AComponent.tsx
```tsx
interface Props {
  // 4. specify the prop with the string constant
  // highlight-next-line
  [TEST_STORE]: TestStore;
}

// You can't use decorator here and export it directly.
// TypeScript can't alter the signature of decorated value,
// so the exported component will still require a [TEST_STORE] prop.
//
// @inject(TEST_STORE)
class AComponent extends React.Component<Props> {

  someEventHandler = () => {
    // 5. use the store with bracket expression
    // Destruction is not possible since the name is not a string literal
    // Fortunately, the type of the store can be inferred.
    // highlight-next-line
    const store = this.props[TEST_STORE];
    // ...
  }

  render() {
    // 5. use the store with bracket expression again
    // highlight-next-line
    const value = this.props[TEST_STORE].someValue;

    // ...
  }
}

// 6. Instead, export the component with inject HOC wrapped
// highlight-next-line
export default inject(TEST_STORE)(AComponent);
```

Avoiding string constants and making the use of TypeScript's type system is one of the key reasons why I choose [react.di](https://github.com/RobinBuschmann/react.di), which utilizes reflection to **use type itself as the key for injection instead of a string**(another is to inject stores into other stores). But in exchange, functional component is no longer usable.

# Observable in Context Of Immutable

As is known to all, MobX uses observables mechanism
