---
id: fixed-length-decimal-random-generator-satisfying-benfords-law-in-python
date: 2017-12-10 00:04
title: Python语言实现的符合本福特定律的十进制固定长度随机数发生器
lang: cn
tags:
  - Python
  - math
  - in-class
---

# 前言
本福特定律改变了人们对随机的认识。之前人们认为，在一组自然的随机数中，以每一个数字打头的数占总频数的频率是一样的。但是本福特定律却用严谨的数学语言证明了不同数字打头的数并不是一样的。本福特定律说明，在b进位制中，以数n起头的数出现的概率为log_b(1+1/n)。这篇文章中提出了一个在现有的平均概率随机数生成器的基础上实现一个十进制下符合本福特定律的、固定位数的随机数生成器。这篇文章展示它的效果，介绍它的算法以及它的代码实现。

# 代码
运行需要Python 3，不需要其他库依赖。

```python
import math, random
from functools import reduce

def possibility_for_n(n):
    return 0 if n==0 else math.log(1+1/n,10)

def distribution_list(n):
    result = []
    for i in range(0,10):
        r = 0
        for j in range(int(math.pow(10,n-2)),int(math.pow(10,n-1))):
            r = r + possibility_for_n(j*10+i)
        result.append(r)
return result

def search_list(distlist):
    return list(map(lambda i: sum(distlist[:i+1]), range(0,10)))

def generate_digit(n):
    rand = random.random()
    searchlist = search_list(distribution_list(n))
    if rand <= searchlist[0]:
        return 0
    for index in range(0,10):
        if rand > searchlist[index] and rand <= searchlist[index+1]:
            return index+1

def generate_one(length):
    return reduce(lambda x,y: x*10+y, map(lambda i: generate_digit(i), range(1,length+1)))

def generate_multiple(length, num):
    return [generate_one(length) for i in range(0,num)]
```

# 代码使用

调用generate_one函数来生成一个随机数，参数为数字位数。
调用generate_multiple函数生成指定个数个随机数，第一个参数为数位数，第二个参数为生成个数。

示例：

\> generate_one(4)

\> 4937

\> generate_multiple(4,10)

\> [6179, 4971, 7735, 1392, 5046, 4750, 4412, 2249, 1530, 8443]


# 代码效果

此代码可以生成指定位数的、指定个数的符合本福特定律的随机数集。


对于代码生成的如下50个4位随机数，

> [2152, 6766, 2117, 4239, 5047, 7623, 2497, 1382, 8081, 4431, 2983, 8968, 1669, 6670, 7242, 3819, 1565, 1399, 2102, 1706, 3257, 8281, 8735, 9197, 5254, 5872, 6805, 2526, 3951, 1271, 4271, 1540, 3713, 1124, 1452, 6037, 3279, 6424, 1550, 2596, 9411, 1272, 1996, 3735, 2403, 3007, 4303, 1146, 1513, 1098]

统计其首位各个数字出现频率，与理论计算值对照，得到如下表格：


| 开头数字n  |	实际频率p_a (n) | 理论频率p_e (n) |
| ----------- | -------------------| ----------------   |
| 1(n_start)  |	0.3      |	0.3010   |
|2  |	0.16 | 0.1760|
|3|0.14 |	0.1249|
|4|	0.08|	0.0969|
|5|	0.06|	0.0792|
|6|	0.1|	0.0669|
|7|	0.04|	0.0580|
|8|	0.08|	0.0512|
|9(n_end)|	0.04|0.0458|

使用公式

**α=(sum(k=n_start to n_end)((p_a (k)-p_e (k))^2))/(n_start-n_end+1)**

度量实际频率与理论频率的偏离程度，数字越小越好。

上例的结果为

>α_1=0.00038025004826301343。

以同样方法计算前两位与理论值的误差，结果为

**α_2 = 0.00013919331883366668**

。

作为对比，平均概率的随机数生成器生成的4位50个数字
>[2665, 2249, 4658, 3974, 2232, 1486, 1616, 7235, 4730, 5351, 1973, 4399, 7146, 2650, 7414, 9585, 2561, 1599, 1839, 6233, 1449, 8225, 7896, 2726, 4011, 7821, 8365, 2231, 4490, 2247, 9524, 7578,4203, 1741, 5035, 9362, 9340, 1798, 5398, 1676, 9247, 8809, 2948, 4933, 1040, 9487, 6529, 5773, 8622, 6047]

的

**α_1 = 0.0037032530835963864**
。



数字越多，其结果越贴近理论值，以下为10000个4位随机数首位各个数字的频率与理论对照值的表格（为了节省篇幅，不附上具体数字）：

|开头数字n|	实际频率p_a (n)|	理论频率p_e (n)|
|-----|-------|--------|
|1 |0.2991|	0.3010|
|2|	0.1783|	0.1760|
|3|	0.1227|	0.1249|
|4|	0.0986|	0.0969|
|5|	0.0780|	0.0792|
|6|	0.0701|	0.0669|
|7|	0.0560|	0.0580|
|8|	0.0500|	0.0512|
|9|	0.0472|	0.0458|

相关指标为：

**α_1 = 0.000003909609950132077**

**α_2 = 0.000002385500926719904**

# 算法分析

若设p(n)为本福特定律中指出的以n开头的数字占所有数字的出现的频率，那么对于从高位起第n位（最高位为第1位），数字i出现的频率为

**sum(k=10^(n-2) to 10^(n-1)-1)(p(10k+i))**

对于n=1，它的起始为0。对于最高位0，频率为0，对于其他位置出现的0，可以不特殊处理。

例如，对于从高位第2位，它出现2的概率为**p(12)+p(22)+p(32)+⋯+p(92)**，而对于高位第4位，它出现5的概率为**p(10005)+p(10015)+⋯+p(99995)**。

可以看到，

每一位的每一个数字的概率都可以通过这个公式计算出来，所以每一位上每一个数字出现的概率都是一定的，并且是可以计算出来的。

所以针对每一位数，根据它对应的频率生成一次随机数，可以保证最后的结果能够满足本福特定律。

称每一位每一个数字出现的概率按对应数据大小排序的结果为**分布表(distribution list，d)**。最高位的分布表为

**d_0 = [0,0.3010,0.1760,0.1249,0.0969,0.0792,0.0669,0.0580,0.0512,0.0458]**

，分别对应0,1,2,3,4,5,6,7,8,9为起始的数字的出现概率。

接下来问题转到了如何根据确定的概率分布生成一位数字。

定义概念搜索表(search list, s)。搜索表定义如下：

**s[i]= sum(k=0 to i)(d[k]) ,∀i∈[0,n_end-n_start]**

用人话说，搜索表的第n项等于其对应分布表首项到第n项的概率之和。

那么上文d_0对应的搜索表为

**s_0=[0,0.3010,0.4771,0.6021,0.6990,0.7782,0.8451,0.9031,0.9542,1.000]**

根据定义，搜索表最后一项一定为1。
下面需要假设现有随机数的发生器可以在[0,1)区间按平均的概率生成随机数。幸运的是，几乎所有语言都提供了生成这种随机数的机制。

现在假设生成为随机数为r∈[0,1)，那么在搜索表中寻找i∈[0,n_end-n_start]，使得r>s[i]且r≤s[i+1]，取i+1作为本位随机数结果。如果r≤s[0]，取0。因为搜索表的每一项是单增的，可以保证i唯一；由于搜索表最后一项一定为1，可以保证i一定存在。

根据这个算法得出的数字能够保证了每一位数字出现的概率和搜索表符合。

对每一位运用此算法，计算其对应的分布表和搜索表，就可以生成指定位数的随机数。

# 代码分析
代码分为6个部分，分别为**以n开头的数字的频率（possibility_for_n(n)函数）**、**本位的分布表（distribution_list(n)函数）**、**本位的搜索表(search_list(distlist))**、**生成第n位（generate_digit(n)函数）**、**生成一个数(generate_one(length))**以及**生成多个数(generate_multiple(length, num))**。

## 以n开头的数字的频率

```python
def possibility_for_n(n):
    return 0 if n==0 else math.log(1+1/n,10)
```

这段代码很好理解：计算以n开头的数字的频率。由于数字不能以0开头，所以以0开头的数字的频率为0。

## 本位的分布表

```python
def distribution_list(n):
    result = []
    for i in range(0,10):
        r = 0
        for j in range(int(math.pow(10,n-2)),int(math.pow(10,n-1))):
            r = r + possibility_for_n(j*10+i)
        result.append(r)
    return result
```
根据定义生成第n位的分布表。

## 本位的搜索表

```python
def search_list(distlist):
    return list(map(lambda i: sum(distlist[:i+1]), range(0,10)))
```

参数为搜索表对应的分布表。为了简洁，这里采用了map高阶函数。它的作用是把第二个参数的每一项作为参数执行第一项的函数，函数的返回值组成新列表作为表达式结果。distlist[:i+1]表示取distlist的从0项到第i项的子表。

## 生成第n位

```python
def generate_digit(n):
    rand = random.random()
    searchlist = search_list(distribution_list(n))
    if rand <= searchlist[0]:
        return 0
    for index in range(0,10):
        if rand > searchlist[index] and rand <= searchlist[index+1]:
            return index+1
```

参数n的含义为第n位。这段函数中，第一句代码生成随机数rand ∈[0,1)（random.random()正好如此），之后生成第n位的搜索表，然后根据上文所阐述的搜索index。这里为了简洁，使用了顺序搜索，虽然它时间复杂度为O(n)，弱于二分法，但是由于每个表的规模恒定为常数9，这个复杂度可以接受。

## 生成一个数
```python
def generate_one(length):
    return reduce(lambda x,y: x*10+y, map(lambda i: generate_digit(i), range(1,length+1)))
```

参数为数的位数（长度）。这里为了简洁，采用了map和reduce两个高阶函数。Map不再赘述。reduce把一个函数作用在一个序列[x1, x2, x3, ...]上，把结果继续和序列的下一个元素做累积计算。

例如，reduce(lambda x,y: x+y, [1,2,3])的结果是6，计算过程为：

[1,2,3]->[1+2,3]->[3,3]->[3+3]->[6]->6。

这里首先采用map生成第1位到第length位的数字，然后采用reduce方法将这些数字合并成一个数字。

## 生成多个数
``` python
def generate_multiple(length, num):
  return [generate_one(length) for i in range(0,num)]
```

length为数的位数，num为生成数的个数。函数调用num次generate_one(length)方法，返回结果。

# 总结

这篇文章展示了一个实用的符合本福特定律的十进制固定长度随机数生成器，并对它的原理和代码实现进行了简要的介绍。在此基础上，可以很容易地扩展到任意进制的随机数长度生成器。但是，这个算法仍然有改进空间，例如可以根据相同的原理实现任意长度的生成器。读者如果有兴趣，可以对此进行更深一步的研究。

# 参考

[1] https://en.wikipedia.org/wiki/Benford%27s_law

[2] http://blog.iharder.net/2010/11/10/benford-how-to-generate-your-own-benfords-law-numbers/

[3] https://softwareengineering.stackexchange.com/questions/255892/unevenly-distributed-random-number-generation

[4] https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014317852443934a86aa5bb5ea47fbbd5f35282b331335000
