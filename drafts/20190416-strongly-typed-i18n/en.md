---
id: strongly-typed-i18n-with-typescript
date: "2019/04/16 21:00"
title: "Strongly Typed i18n with TypeScript"
lang: en
tags:
  - web-frontend
  - code-trick
  - TypeScript
---

# i18n and The "Raw String" Problem

Internationalization, also known as i18n (18 characters between the leading *i* and trailing *n*), is about making a product friendly to global users, and one of the most important work is to **deliver common contents using different language according to user's preference**. For example, for the same text content `login`, our application should show `login` for English users, whereas `登录` for Chinese users etc.

## Text Placeholder (Id)

One typical technique to achieve it is to use **placeholder** (or **id**) in the places of text contents. During compilation or runtime, these **id**s will be replaced with **localized strings** which are usually defined in dedicated files, each one of these files consisting of all the texts in one language.

## Defining the Mapping from Id to Content

There are many ways to structure a file, and one of them is **nested object**, where the id of a value is all the keys in the path joined with dot(`.`). The nesting structure works as index for a database, which would be beneficial to maintain the file, especially when the number of entries grow.

```tsx
// en.ts, which contains all the texts in English
export default {
  login: {
    button: {
      text: "Login",
    },
  },
}

// cn.ts, which contains all the texts in Chinese
export default {
  login: {
    button: {
      text: "登录",
    },
  },
}

// both language files are isomorphic,
// i.e. have the same structure

// the id for the text content `Login` is login.button.text
```

Another form that is commonly accepted is **plain key-value mapping**, like iOS ([example](https://medium.com/lean-localization/ios-localization-tutorial-938231f9f881)) and ASP.NET Core MVC ([example](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/localization?view=aspnetcore-2.2)), which is just simply, well, an id-to-text mapping.

## Applying the Id

After the mapping has been defined, one way to use the id is to **define a custom component** which **receives an id** and **returns the text content** according the current language setting.

```tsx
// This component receives id and returns the text content.
function LocalizedString({ id }: { id: string }) {
  // get the currentLanguageObject (the object defined above) from anywhere,
  // like React Context, redux store, mobx store, simstate store, or just import it

  // For simplicity, use Ramda to safely get nested value
  return R.path(id.split("."))(currentLanguageObject);
}

// Use the component in the place of raw text content
<Button><LocalizedString id="login.button.text" /></Button>

// Previously...
<Button>Login</Button>
```

It looks promising. By using id, the followings can be easily achieved, which are left as assignments for readers :smile:.

- **Auto update** the text content when language changes
- use the **localized text** where **only string is allowed**
    - and also make it observable
- **String interpolation**
    - insert string or React component into localized text content
    - like `c±printf("Content %d", anInt);`
- **Fallback**
    - when current language doesn't define value for a key, use fallback language to provide the text
- **Generate separate pages** for **each languages** in **complie-time**

## The "Raw String" Problem

The biggest problem of this solution is **raw string id**. Without external support from compiler or IDE (like [Angular Language Service](https://angular.io/guide/language-service) whcih supports Angular templates), using raw strings in code is harmful and should be avoided.

- No error check (like typo)
    - increases debugging time
- Hard to refactor the object
- No IDE autocompletion, navigating, and other good stuff
    - have to look up and type the key (which might be very looooog) every time


```tsx
// typo
<Button><LocalizedString id="login.buton.text" /></Button>

// long key
<LocalizedString id="app.header.userindicator.loggedin.dropdown.login.button.text" />
<LocalizedString id="app.header.userindicator.loggedin.dropdown.logout.button.text" />

// What if a key in the path is renamed?
```

# Make it Strongly Typed



