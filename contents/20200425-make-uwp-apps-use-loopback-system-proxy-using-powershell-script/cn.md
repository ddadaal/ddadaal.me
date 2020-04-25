---
id: make-uwp-apps-use-loopback-system-proxy-using-powershell-script
date: 2020-04-25 23:40
title: 使用PowerShell脚本让UWP应用使用localhost上的系统代理
lang: cn
tags:
  - Windows
  - problem-investigation
---

# 问题

众所周知，国内微软服务的连接性很成问题，并且这个问题越来越严重了，所以必须要让这些应用通过梯子才能正常使用微软服务。

梯子一般都会设置系统代理，其原理是在本机localhost的某个端口上监听网络请求，并将请求发送到服务器。绝大部分普通的Win32应用都会遵循系统代理的设置，包括OneDrive桌面应用等，所以这些以Win32应用形式存在的应用程序可以很简单的解决。

但是微软的很多应用，例如自带的Windows商店、邮件、照片等，都是UWP应用，而UWP应用禁止了将网络流量发送到本机(localhost)，所以UWP应用是不能直接使用这种系统代理的。

# 手动解决方案

微软同样自带了一个工具`CheckNetIsolation.exe`（可以直接在powershell里运行），可以允许选定的UWP应用解除网络隔离，使用localhost的系统代理。

听起来问题解决了？

如果查看这个工具的帮助界面的话，会发现这个工具需要应用的名称(`-n`)或者ID(`-p`)，但是这些信息需要从注册表中获取，非常的麻烦。想要这样进行操作的用户可以尝试少数派的[这篇文章](https://sspai.com/post/41137)。

```
➜ CheckNetIsolation.exe LoopbackExempt -?

用法:
   CheckNetIsolation LoopbackExempt [operation] [-n=] [-p=]
      操作列表:
          -a  -  向环回免除列表中添加 AppContainer 或程序包系列。
          -d  -  从环回免除列表中删除 AppContainer 或程序包系列。
          -c  -  清除环回免除的 AppContainer 和程序包系列的列表。
          -s  -  显示环回免除的 AppContainer 和程序包系列的列表。

      参数列表:
          -n= - AppContainer 名称或程序包系列名称。
          -p= - AppContainer 或程序包系列安全标识符(SID)。
          -?  - 显示 LoopbackExempt 模块的此帮助消息。

完成。
```

# 自动化方案

## 巨人的肩膀

我们作为一个合格的程序员，看到这种事情的第一反应，应该是：我太懒了，我们需要自动化！

所以第一件事就是去网上找，果不其然找到一个dalao的[文章](https://yuan.ga/enable-win10-uwp-use-system-proxy/)，里面给出了一个Python脚本，可以自动做这个事情。

但是反正这个工具都是在Windows上用，为什么要用Python？用PowerShell，什么依赖都不要，它不香嘛？

进入这个大佬的GitHub，可以在它的[这个仓库](https://github.com/yearliny/myscript)中发现原来这个大佬也写了一份PowerShell脚本用来做这个事情。

但是当我尝试使用这个PowerShell时，发现了一些问题：

- 没有系统自带的应用
- 选择应用后会报`错误: 参数无效`错误

## 站在巨人的肩膀上

不能就这么放弃了！

于是我检查了一下这个PowerShell工具，解决了这两个问题：

- 没有系统自带的应用是因为dalao过滤了以`${`开头的应用，而这些应用正好就是邮箱、商店等系统应用
- 选择应用后报错应该是因为工具在后期改了API，所以原来直接使用`Moniker`键值的方法不能使用了

针对这两个问题，我对脚本做出了改进，并加入了一个根据名字进行筛选应用的功能，以方便让用户应用列表中中快速找到想要设置的应用。

改进后的脚本如下：

```powershell
param(
    [string] $Contain
)

$BASE_PATH = 'HKCU:\Software\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\AppContainer\Mappings\'
# 获取相关注册表信息，并进行筛选和排序
$mapping = Get-ChildItem -Pat $BASE_PATH | Where-Object {$Contain -Eq "" -or $_.GetValue('DisplayName').Contains($Contain)} | Sort-Object {$_.GetValue('DisplayName')}

if ($mapping.Length -eq 0) {
    Write-Output "没有包含字符 $Contain 的软件包，请重试。"
    exit
}
# 格式化打印 APP List
$mapping | Format-Table @{label='Num'; expression={$mapping.IndexOf($_)}}, @{label='DisplayName'; expression={$_.GetValue('DisplayName')}}
$input = Read-Host '回复序号并回车提交（若只有一项，输入0），添加指定应用到排除列表中'
$id = $mapping[$input].Name.Split("\") | Select-Object -Last 1
Write-Output $id
CheckNetIsolation LoopbackExempt -a -p="$id"
```

将这段代码复制粘贴到本地一个以`ps1`为扩展名的文件中，假设这个文件名字为`check.ps1`：

- 使用`PowerShell`直接运行这个脚本，不需要管理员权限。系统将会列出系统中所有的UWP应用的名称，输入编号，系统将会输入应用的ID，然后调用`CheckNetIsolation.exe`工具将这个应用解除网络隔离，允许使用系统代理。

```
-> .\check.ps1

Num DisplayName
--- -----------
 ...
 54 @{microsoft.windowscommunicationsapps_16005.12624.20368.0_x64__8wekyb3d8bbwe?ms-resource://microsoft.windowscommun…
 ...

回复序号并回车提交（若只有一项，输入0），添加指定应用到排除列表中: 54
S-1-15-2-...（剩下的ID）
完成。
```

- 使用`PowerShell`运行这个脚本，并加入参数`-Contain {字符串}`，工具将会筛选名称中含有这个字符串的应用。之后，和上面一样，输入编号回车即可。

```
-> .\check.ps1 -Contain communicationsapps

Num DisplayName
--- -----------
    @{microsoft.windowscommunicationsapps_16005.12624.20368.0_x64__8wekyb3d8bbwe?ms-resource://microsoft.windowscommun…

回复序号并回车提交（若只有一项，输入0），添加指定应用到排除列表中: 0
S-1-15-2-...（剩下的ID）
完成。
```

另外，这里给出可以用来筛选几个常见的需要进行代理的MS自带应用的筛选参数，方便大家直接复制运行（直接作为`-Contain`参数的值，运行脚本时输入0回车即可）：

| 软件 | 筛选参数 |
| --  | -- |
| 应用商店 | `WindowsStore` |
| 邮件 | `communicationsapps` |
| OneNote | `OneNote` |
| 照片 | `Windows.Photos` （注意不要选择后面有DLC的那一项）|

运行完脚本之后，关闭重启对应应用即可。

终于可以愉快地使用MS应用和服务了！

最后非常感谢这份PowerShell脚本的原作者！
