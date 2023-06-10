---
id: fix-gatsby-transformer-remark-chinese-word-count
date: 2019-11-03 10:10
title: 修复gatsby-transformer-remark插件中文词数统计错误问题
lang: cn
tags:
  - blog
  - problem-investigation
---

# 问题

本博客是使用[gatsby](https://gatsbyjs.com)搭建的，而gatsby官方提供了一个[gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark)插件可以用来将markdown转换成html。此外，这插件在渲染markdown之外，还提供了一些很贴心的小功能，包括**词数统计**(`wordCount`)和**阅读时间**(`timeToRead`)。这两个小数据放在博客里也能让用户能够简单地知道一篇文章的大致篇幅，从而提高用户体验。

但是呢，这两个功能在之前都**不支持非拉丁字符！**，让这两个功能形同虚设。并且，插件也没有提供设置自定义的计算函数的方法，所以这两个功能对中文等非拉丁字符用户来说是比较鸡肋的。

难道这功能就这样闲置下去吗？不！我在这里提供几个可以用来在一定程度上修复此插件在中文环境下失效的问题的方法。

# 推荐方法：使用timeToRead

[Gatsby的PR #18303](https://github.com/gatsbyjs/gatsby/pull/18303)已经修复了`timeToRead`无法统计中文字数的问题。虽然有人在下面说这个PR没有合并进去，但是实际上是可以用了的。

这个修复是在原来的数据上，再将文本使用`/[\p{sc=Katakana}\p{sc=Hiragana}\p{sc=Han}]/gu{:javascript}`这个正则表达式作为模式，统计文本中符合这个正则的元素的数量，把中文的数量加到原来的数据上。而对于中文，这个正则表达式简单来说就是把每个中文字符统计一个单独的元素。通过这样，用来计算`timeToRead`的字数数据就基本完善了。

而`timeToRead`的计算方法就是`词数/平均WPM(average word per minutes, avgWPM)`，平均WPM在代码中硬编码为`265`，所以这样得出的`timeToRead`也是基本准确的。相关代码可以参考下面的链接：

https://github.com/gatsbyjs/gatsby/blob/3aa41fb8dbf7fe294f35a706424c6b2b11345881/packages/gatsby-transformer-remark/src/extend-node-type.js#L586

另外，根据这个公式，也可以通过`timeToRead`**估算词数**，即是`timeToRead * avgWPM (265)`就可以了。但是由于插件返回的`timeToRead`是 `Math.round{:javascript}`过的整数，直接乘265的结果的误差在±265左右。其实这个误差不算大，但是由于265是5的倍数，这样估算出来的得出的结果有点太假（全是5的倍数，好巧），所以请看情况使用这个方法。

这里需要注意一下，`265`字/秒这个速度对英文来说可能比较合适，但是对中文来说是比较慢的。但是对于不同种类的文章来说，WPM是不一样的，比如读小说和读专业书的速度肯定是相差几倍，所以WPM取多少没有一个固定值。根据网上查到的资料（其实知乎上的某相关问题……）和自己的体验，在我的网站中对中文文章平均WPM取的值为`500`。

2020-4-11更新：gatsby的[PR #21312](https://github.com/gatsbyjs/gatsby/pull/21312)对中文字符和日文字符的timeToRead算法进行了一些改进，目前的结果较为正常，可以直接使用，不需要像上一段一样使用不一样的WPM重新计算timeToRead了。

# 替代方法：移植timeToRead统计算法

`wordCount.words`和`timeToRead`中词数的算法是不一样的：

- `wordCount`使用的是`remark`中`count`插件
- `timeToRead`使用的是上文所说的`lodash`的`_.words`方法

所以`timeToRead`修复了，不代表`wordCount`也修复了。实际上，[源码中也提到了*wordCount支持非拉丁字符是个TO-DO*](https://github.com/gatsbyjs/gatsby/blob/3aa41fb8dbf7fe294f35a706424c6b2b11345881/packages/gatsby-transformer-remark/src/extend-node-type.js#L613)，追溯到[`remark`的对应issue](https://github.com/remarkjs/remark/issues/251#issuecomment-296731071)，发现这个问题是2017年就提出了，而且看讨论的进度在短时间之内是不会修复了。

如果你不使用`wordCount` query中的其它项而只使用`wordCount.words`，那么可以考虑以下把`timeToRead`的词数统计方法移植出来，成为一个单独的field。具体有以下几种方法：

根据gatsby官方文档（ https://www.gatsbyjs.org/docs/creating-a-local-plugin/ ），gatsby是可以从你本地项目的`plugins`目录中使用插件的。

所以你通过进行如下操作，给`allMarkdownRemark`这个GraphQL query中增加一个`wordCountChinese`字段，这个字段使用`timeToRead`中的统计算法来统计文章字数：

1. 在项目根目录创建一个`plugins/gatsby-transformer-remark-fixed`目录
2. 把`node_modules/gatsby-transformer-remark`中的内容复制到`plugins/gatsby-transformer-remark-fixed`目录中
3. 在`plugins/gatsby-transformer-remark-fixed/extend-node-type.js`文件中，接近文件末尾的`wordCount`项之后，增加如下代码（如果`wordCount`最后没有`;`，记得加一个）：

```javascript
wordCountChinese: {
  type: "Int",
  resolve(markdownNode) {
    return getHTML(markdownNode).then(html => {
      const pureText = sanitizeHTML(html, {
        allowTags: []
      });
      return (
        _.words(pureText, /[\s\p{sc=Han}]/gu).length
      );
    });
  }
}
```
4. 然后在本地的`gatsby-config.js`里，将`gatsby-transformer-remark`替换成`gatsby-transformer-remark-fixed`
5. 之后，在项目里就可以在每个`node`上query `wordCountChinese`啦！

这个方法得出的数据比较偏大，在两篇文章上的结果如下表：

| 文章 | 语言 | 原插件`wordCount.words`的结果 | 这个方法的结果 | Microsoft Word的结果 |
| -- | -- | -- | -- | -- |
| [折腾Linux：从实体机到Win10](/articles/playing-with-linux-from-machine-to-win10) | 中文 | 587 | 5232 | 5211 |
| [A React Form Component Performance Optimization with Profiler](a-react-form-comp-perf-optimization-with-profiler) | 英文 | 1532 | 1939 | 1653 |

这个方法的问题就是：你需要跟随上游`gatsby-transformer-remark`的更新而更新本地的插件。这个更新是比较麻烦的，而且随以fork也是社区的分裂的根源之一，所以不建议。

# 参考项目：gatsby-transformer-remark-chinese-word-count

如果你非要获得一个较为真实的词数，但是又不想向上面一样的自己做（伸手党？），那么根据之上同样的方法，我弄了一个[gatsby-transformer-remark-chinese-word-count](https://github.com/ddadaal/gatsby-transformer-remark-chinese-word-count)项目，用来简化自己从`node_modules`中提取和修改插件这个流程。使用方法可以参考此项目的GitHub链接。

但是这个项目**仅供使用替代方法1时的参考**，个人**不推荐使用**在项目中这个插件，我也没有把插件发布到npm上去，理由如下：

1. 这个项目不会随着上游的更新而更新，所以很可能这个插件会是过时的
2. 使用这种插件会造成社区的分裂

而这种计算方法由于太过简单，并且也只覆盖了中文这一种情况（对于其他语言情况太过复杂，我也不甚了解，所以也没有能力去支持其他语言），gatsby团队应该也不会接受把这个算法合并进主项目。

# 总结

尽量使用`timeToRead`以及使用`timeToRead`来估算总词数。如果非要获得较为准确的词数不可，考虑自己修改`gatsby-transformer-remark`插件并维护。[gatsby-transformer-remark-chinese-word-count](https://github.com/ddadaal/gatsby-transformer-remark-chinese-word-count)项目仅用来作为修改插件时的参考。
