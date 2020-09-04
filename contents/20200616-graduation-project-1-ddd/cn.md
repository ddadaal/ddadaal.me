---
id: graduation-project-1-ddd
date: 2020-06-16 20:35
title: EF Core使用代理类映射接口类属性到数据库
lang: cn
tags:
  - graduation-project
  - problem-investigation
---

# ORM

ORM，对象关系映射，可以将数据库中的模型和代码中的模型进行映射。说具体一点，一个功能完整的ORM应该能够做到以下工作：

- 把面向对象语言**代码中的类**和关系型数据库中的**表结构**进行映射
- 从数据库中取出数据，并将其**转换**为代码中的对象（称为实体）
- **跟踪**取出的实体的**状态变化**，并根据状态变化生成对应的SQL语句，执行后可以将对象的状态变化映射到表中
- 在数据库表中映射新增和删除实体操作

有了ORM，很多常见的数据库CRUD操作，可以直接使用编程语言中的代码进行实现。在很多情况下，ORM可以直接取代数据层，直接将用户在业务逻辑层的操作自动地反应到数据库中，大幅减少代码量。

例如，我们有如下的一个多对多关系。用户(User)可以属于多个域(Domain)，域中可以有多个用户。用户在域中具有角色(role)。

## 示例

```plantuml
class User {
  +String Id
}

class Domain {
  +String Id
}

class UserDomainAssignment {
  +Role Role
}

User "1..*" - "1..*" Domain
(User, Domain) .. UserDomainAssignment
```

根据这个定义，我们可以写出如下的C#代码：

```c#
public class User
{
    public Guid Id { get; set; }
    public ICollection<UserDomain> Domains { get; set; }
}

public class Domain
{
    public Guid Id { get; set; }

    public ICollection<UserDomain> Users { get; set; }
}

public class UserDomainAssignment
{
    public Guid Id { get; set; }
    public User User { get; set; }
    public Domain Domain { get; set; }
}
```

运行程序后，让ORM自动生成表结构，可以看到EF Core生成了以下的CREATE TABLE语句：（下列结果为Entity Framework Core 3.1.5 运行在 .NET Core 3.1的结果，不同环境可能有不同）

```sql
CREATE TABLE "Users" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY,
);
CREATE TABLE "UserDomainAssignments" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_UserDomainAssignments" PRIMARY KEY,
    "UserId" TEXT NOT NULL,
    "DomainId" TEXT NOT NULL,
    "Role" INTEGER NOT NULL,
    CONSTRAINT "FK_UserDomainAssignments_Domains_DomainId" FOREIGN KEY ("DomainId") REFERENCES "Domains" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserDomainAssignments_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);
CREATE TABLE "Domains" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Domains" PRIMARY KEY,
);
```

第一段和第三段为Users和Domains表的定义，可以看到，所有列就是类中的字段的直接对应。C# 8开始支持可空类型，而类中定义所有字段都是非空的，所以EF Core在生成SQL语句时，也同时给列生成了NOT NULL约束。

但是Users和Domains表中并没有表示列表的列，而是在UserDomainAssignments这个表示用户和域的关系的表中生成了两个外键约束（FOREIGN KEY CONSTRAINT）。

UserDomainAssignments对指向User的列生成了UserId列，并将这列作为对User表中的Id列的外键，并且由于在UserDomainAssignments中用户属性为非空，所以UserId列也为NOT NULL，并且给指向User的外键约束设置了级联删除（ON DELETE CASCADE），保证数据的一致性。对于Domain来说也是如此。

这是一个典型的多对多关系的表结构，正好和业务模型中的实体关系相对应。

另外，当实体的状态被修改（也包括实体的子属性，如用户的用户关系对象被修改）时，或增加实体、删除实体（也包括往实体的子属性，如用户的Projects列表中增加或者删除对象时），Entity Framework Core会跟踪这些状态的变化，并在用户代码调用SaveChangeAsync方法时，生成对应的SQL语句，让这些变化持久化到数据库中。

因此，基本上所有对象之间的操作，在不对性能有极端考虑的情况下，Entity Framework Core等其他ORM已经可以完美解决，基本可以直接取代数据层的工作，使我们写的代码可以专注于业务。

# 接口类型的属性

但是，
