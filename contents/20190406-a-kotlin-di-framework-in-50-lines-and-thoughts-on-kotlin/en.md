---
id: a-kotlin-di-framework-in-50-lines-and-thoughts-on-kotlin
date: 2019-04-06 15:48
title: A Kotlin DI Framework in 50 Lines and Thoughts on Kotlin
lang: en
tags:
  - Kotlin
  - code-trick
  - thoughts
---

# Why

If you have got used to using DI framework (like Spring) to manage and inject dependencies, and now you have to start a new, relatively simpler, but not so simple project, you have 2 options to work with in terms of dependency management:

- **introduce a full blown DI framework** and waste plenty of time in numerous and verbose configurations
- **use traditional object instantiation or simple factory pattern** and make the code clumsy and hard to modify

I encountered this sort of problem a week ago when I was writing [the demo project for architecture class](https://github.com/ddadaal/ClassroomAssistant), which was only a simple JavaFX project that had a simple dependency hierarchy. What was different in this project from other simple and less designed project was that instead of using class directly, it used **interface and implementation class pattern** in order to match the class diagram and meet the course requirement. Using interface decoupled the interface and implementation, which was a good practice, but also introduced complexity in using this code, since it would be impossible to **new** an interface.

As mentioned before, excluding DI framework option, two patterns could be applied: **object instantiation** and **factory pattern**. Kotlin also supports [singleton object declaration](https://kotlinlang.org/docs/tutorials/kotlin-for-py/objects-and-companion-objects.html#object-declarations) which was also a good choice. All of them, however, made the code *less elegant*:


```kotlin
// interface and implementation
interface SomeService
class SomeServiceImpl: SomeService
```

Pattern 1: object instantiation

```kotlin
import xxx.SomeService

// highlight-start
// Problem 1: have to import the impl class
import xxx.SomeServiceImpl
// highlight-end


class User {
  // highlight-start
  // Problem 2: have to specify the interface type and the implementation type
  // Problem 3: not valid if we want singleton
  private val service: SomeService = SomeServiceImpl()
  // highlight-end

}
```

Pattern 2: simple **singleton** factory pattern

```kotlin
// in the same file where Service and ServiceImpl are defined

// highlight-start
// Problem1: manual object instantiation
val instance = SomeServiceImpl()
// highlight-end


// highlight-start
// Problem2: manually write a factory function
fun createSomeService(): SomeService {
  return instance
}
// highlight-end

```

```kotlin
// in another file
import xxx.SomeService

class User {
  // highlight-start
  // Problem 3: manual factory function call
  // Problem 4: implicit and extra dependency to factory function
  private val service = createSomeService()
  // highlight-end

}
```

Pattern 2.1: simple **singleton** factory pattern using [companion object](https://kotlinlang.org/docs/tutorials/kotlin-for-py/objects-and-companion-objects.html#companion-objects)

```kotlin
// in the same file where Service and ServiceImpl are defined

interface SomeService {
  companion object {
    // highlight-start
    // Problem 1: interface relies on implementation??
    val service: SomeService = SomeServiceImpl()
    // highlight-end
  }
}

class SomeServiceImpl: SomeService
```

Pattern 2.2: **singleton** using [singleton object declaration](https://kotlinlang.org/docs/tutorials/kotlin-for-py/objects-and-companion-objects.html#object-declarations)

```kotlin
// in the same file where Service and ServiceImpl are defined

interface SomeService

// highlight-next-line
object SomeServiceImpl: SomeService
```

```kotlin
import xxx.SomeService

// highlight-start
// Problem 1: have to import the impl class
import xxx.SomeServiceImpl
// highlight-end


class User {
  // highlight-start
  // Problem 2: have to specify the interface type and the implementation type
  private val service: SomeService = SomeServiceImpl
  // highlight-end
}
```

All of these problems were of little importance, but to an extent affected my coding experiences. What I would like was **minimal dependencies** and **minimal extra code**.

Luckily, with the help of [delegation](https://kotlinlang.org/docs/reference/delegation.html) and classpath scan capability provided by [classgraph](https://github.com/classgraph/classgraph), we could achieve the *minimality*, with the introduction of only three simple APIs:

- `Service` annotation to annotate service interface
- `ServiceImpl` annotation to annotate implementation
- `di` function for delegation

```kotlin
// annotate service interface with @Service
@Service
interface YourService {
  fun hello()
}

// annotate service implementation class with @ServiceImpl
@ServiceImpl
class YourServiceImpl: YourService {
  override fun hello() {
    println("Hello from YourServiceImpl")
  }
}
```

```kotlin
// in a random class that uses the service
import YourService

class AnotherClass {
  // declare a property with the interface type and delegate it with di(),
  // the function *where the magic is*
  private val yourService: YourService by di()

  fun hello() {
    // just call it
    yourService.hello();
  }
}

fun main() {
  // just new an instance as usual
  val obj = AnotherClass()

  obj.hello() // print out "Hello from YourServiceImpl"
}

```

# How It is Done?

Here is the code with some comments to help understanding.

Before getting started, install [classgraph](https://github.com/classgraph/classgraph) in your project with Maven or Gradle to have all the Services and ServiceImpls automatically scanned and configured like Spring Boot would do.

```kotlin
// imports
import io.github.classgraph.ClassGraph
import kotlin.reflect.KClass
import kotlin.properties.ReadOnlyProperty
import kotlin.reflect.KProperty

// annotations to annotate Service interface and Service implementation class
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class ServiceImpl

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Service

// the exception when an implementation is not available
class NotProvidedException: Exception()

// the container class
// `scanBase` is the base package that would be scanned
@Suppress("UNCHECKED_CAST")
class CADiContainer(scanBase: String) {

  // key as the Java Class object and value as its corresponding singleton instance
  private val map = mutableMapOf<Class<*>, Any?>()

  init {
    // scan specified package
    ClassGraph()
      .enableAllInfo()
      .whitelistPackages(scanBase)
      .scan()
      .use { scanResult ->

        // find out all interfaces annotated with Service
        val services = scanResult.getClassesWithAnnotation(Service::class.qualifiedName).loadClasses()

        // find out all implementation classes annotated with ServiceImpl
        val impls = scanResult.getClassesWithAnnotation(ServiceImpl::class.qualifiedName)

        // fill the instance map with service and service implementation
        services.forEach { service ->
            map[service] = impls.find { it.implementsInterface(service.name) }?.loadClass()?.newInstance()
        }
      }
  }

  // just look up the map and try to get the instance
  fun <T : Any> getInstance(type: Class<T>): T {
    return map[type] as T? ?: throw NotProvidedException()
  }
}

// instantiate a DI Container
val container = CADiContainer(scanBase)

// Here is where magic is:
// define a inline function with reified type parameter
// and return an anonymous ReadOnlyProerty object to be used as a delegate
// which uses the reified type parameter
// to look up and return the instance in the container
inline fun <reified T : Any> di(): ReadOnlyProperty<Any, T> {
    return object : ReadOnlyProperty<Any, T> {
        override fun getValue(thisRef: Any, property: KProperty<*>): T {
            return container.getInstance(T::class.java)
        }
    }
}
```

# What's Good?

- **Singleton** injection

All injected instances are singleton, which is how DI is usually used.

- **new** support

You can also simply **new** an object (which should not be annotated with @ServiceImpl) if singleton injection is not enough, or context parameters are required when using a service. **New-ed** object can still use its dependencies. No extra learning needed.

- **Circular** and **hierarchy** Dependency

Unlike commonly used **constructor injection** and **setter injection**, dependent object are fetched **dynamically** from the container **when the property is being accessed**. Nothing will be injected during the instantiation of objects. So there would be no problem to have circular and hierarchy dependency structure at all.

- **Structure** your project as you wish

With other DI frameworks (like [autofac](https://autofac.readthedocs.io/en/latest/getting-started/index.html#structuring-the-application) and Spring), the whole application must be structured **from the ground up** and configured in guidance of the DI framework of your choice , which is time-wasting and totally a overkill if a simple application is all what you need.

# Limitations

- Can not use dependency in `init` block

All services are instantiated **randomly** (to be more precise, in the order of time when it is scanned), regardless of **their dependency relationships**. For example, **if A uses B, it is possible that B is instantiated earier than A**, in which case access to B inside A's `init` block would cause `NotProvidedException` since at that time A instance has not been in the container. This problem can be solved with **prior dependency relationship analysis** or **custom after-instantiation hook**.

- No advanced features like object lifetime control, scope, test...

It should be emphasized that our 50 lines of code only targets to **small application** and **is not for production**, so advanced features are never considered. Use full blown DI framework if your application is serious.

# My Thoughts on Kotlin

My first impression to Kotlin was a mixed bag:

It had lots of features that C# and Java did't, which does improve coding experience a lot: **strict nullity check**, **pattern matching**(which C# is introducing), **delegation**, **function type** (`(Int, String) -> String{:kotlin}`, which is more intuitive than `Action` delegations in C#, and various and differently named built-in functional interfaces (like `Consumer`, `Producer`) in Java which are hard to remember), **inline functons** and more;

Some parts of language seemed confusing at first, but later was proved to be excellent. For example **[lambda](https://kotlinlang.org/docs/reference/lambdas.html#lambda-expressions-and-anonymous-functions)** in Kotlin needs to be wrapped with a brace(`{}`) pair  (like `func(arr, {a, b ->  a < b}){:kotlin}` (just an example)), where Java doesn't (`func(arr, (a, b) -> a < b){:java}`). However with the ability to [write the last lambda parameter outside of parentheses](https://kotlinlang.org/docs/reference/lambdas.html#lambda-expressions-and-anonymous-functions) (`func(arr) {a, b -> x a < b}{:kotlin}`), the extra abilities it brings overweigh the disadvantages.

For example, with the help of [TornadoFX](https://tornadofx.io/), an excellent JavaFX framework for Kotlin, building JavaFX views can be done **directly in Kotlin** elegantly, which is even better than FXML, since *strongly-typed-ness* makes coding way less error-prone, verbose and intuitive than XML.

```kotlin
// define a vbox
vbox {
	// define a button as a child component, with "Button" as text, and an onAction function
	button("Button") {
		action {
			replaceWith<StudentCheckinView>(sizeToScene = true)
		}
	}
	// a list view whose data source is aList
	listview(aList)
}
```

Gradle also [supports Kotlin as its DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) alongside Groovy, which also proves the benefits of this grammar are phenomenal.

Of course Kotlin has some problems, like the grammar of anonymous object is more verbose than Java's (where just a lambda would be enough) and some type system related problems thanks to the type erasure of JVM.

But the defects cannot obscure the virtues.

The features (including *grammar sugars*) Kotlin has have opened my eyes, showing me how a programming language that is modern, well-designed and has no history burdens can be like, how these features and grammar sugars can make coding much more productive and enjoyful, and most importantly, **how our ways of thinking a problem can be different**.

Everyone knows that programming languages are just tools: that's true, but **tools can also influence how we look at problems**.

A programmer who only knew procedural programming language would try to solve every problems procedurally, quickly being overwhelmed by exponentially growing complexity; A OOP only programmer would wrap everything into objects, resulting in piles of useless boilerplate codes and a class hierarchy so complicated that only god could understand it; A FP originalist would try to use FP on everything, ignoring the nature of the problem, the communities of selected technologies and his/her teammates, all leading to the failure of the project.

Learning different languages can bring different angles to view a problem and different tools to solve a problem, and that is valuable for any programmers.








