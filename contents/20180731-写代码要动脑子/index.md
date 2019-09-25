---
id: think-while-coding
date: 2018-07-31 14:12
title: 写代码要动脑子！
lang: cn
tags:
  - thoughts
---

在开发过程中，不要无脑复制粘贴照着示例写，而应边写边想有什么可优化的，并大胆地通过查资料、自己动手做实验等方法验证自己的优化可不可行，如果可行，请大胆地提交代码，并给所有人讲解你的做法。

# 错误示范

陈振宇说得好，重复3次以上的操作都要应该写程序来做。但是，事实上，很多人写代码根本不动脑子，看到示例怎么写，自己就复制一下，改改变量名，能用就行，不管复制多少次也不嫌烦。

这里举几个例子，全是大作业里的代码。大家都不需要知道每个变量具体是什么意思，单看代码就知道这种代码就是典型的不动脑子的代码：

重复switch（解决方法：多态，策略模式）
```java
@Override
public void updateMission(String missionId, int credits, MissionType missionType) throws SystemException, IOException, MissionIdDoesNotExistException, ClassNotFoundException {
    Mission mission = null;

    // highlight-start
    switch (missionType) {
        case IMAGE:
            mission = imageMissionDao.findImageMissionByMissionId(missionId);
            break;
        case TEXT:
            mission = getMissionByMissionId(missionId);
            break;
        case AUDIO:
            mission = audioMissionDao.findAudioMissionByMissionId(missionId);
            break;
        case VIDEO:
            mission = videoMissionDao.findVideoMissionByMissionId(missionId);
            break;
        case THREE_DIMENSION:
            mission = threeDimensionMissionDao.findTHreeDimensionMissionByMissionId(missionId);
            break;

    }
    // highlight-end
    mission.setCredits(mission.getCredits() + credits);
    updateMission(mission);
}
```

不可忍受的重复switch（解决方法：多态，策略模式）
```java
@Override
public String updateInstanceDetailVo(InstanceDetailVo instanceDetailVo) throws SystemException, IOException {
    MissionType missionType = instanceDetailVo.getMissionType();
    InstanceVo instanceVo = instanceDetailVo.getInstance();
    Instance result = null;

    // highlight-start
    switch (missionType) {
        case IMAGE:
            ImageInstanceDetailVo imageInstanceDetailVo = (ImageInstanceDetailVo) instanceDetailVo;
            ImageInstance imageInstance = generateImageInstance(instanceVo, imageInstanceDetailVo);
            result = saveImageInstance(imageInstance);
            break;
        case TEXT:
            TextInstanceDetailVo textInstanceDetailVo = (TextInstanceDetailVo) instanceDetailVo;
            TextInstance textInstance = generateTextInstance(instanceVo, textInstanceDetailVo);
            result = saveTextInstance(textInstance);
            break;
        case THREE_DIMENSION:
            ThreeDimensionInstanceDetailVo threeDimensionInstanceDetailVo = (ThreeDimensionInstanceDetailVo) instanceDetailVo;
            ThreeDimensionInstance threeDimensionInstance = generateThreeDimensionInstance(instanceVo, threeDimensionInstanceDetailVo);
            result = saveThreeDimensionInstance(threeDimensionInstance);
            break;
        case VIDEO:
            VideoInstanceDetailVo videoInstanceDetailVo = (VideoInstanceDetailVo) instanceDetailVo;
            VideoInstance videoInstance = generateVideoInstance(instanceVo, videoInstanceDetailVo);
            result = saveVideoInstance(videoInstance);
            break;
        case AUDIO:
            AudioInstanceDetailVo audioInstanceDetailVo = (AudioInstanceDetailVo) instanceDetailVo;
            AudioInstance audioInstance = generateAudioInstance(instanceVo, audioInstanceDetailVo);
            result = saveAudioInstance(audioInstance);
            break;
    }
    // highlight-end

    if (result == null)
        throw new SystemException();
    return result.getInstanceId();
}

```

逻辑几乎相同的多个方法（解决方法：泛型，策略模式）

```java
public VideoInstance getVideoInstance(String instanceId)  {
    VideoInstance videoInstance = videoInstanceDao.findVideoInstanceByInstanceId(instanceId);
    try {
        FileInputStream fileIn = new FileInputStream(PathUtil.getSerPath() + "video_instance" + "_" + instanceId);
        ObjectInputStream in = new ObjectInputStream(fileIn);
        List<VideoResult> videoResults = (List<VideoResult>) in.readObject();
        in.close();
        fileIn.close();
        videoInstance.setVideoResults(videoResults);
    } catch (IOException e) {
        System.out.println("Results for " + instanceId + "not found. Returns empty list.");
        videoInstance.setVideoResults(new ArrayList<>());
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
    return videoInstance;
}

public AudioInstance getAudioInstance(String instanceId) {
    AudioInstance audioInstance = audioInstanceDao.findAudioInstanceByInstanceId(instanceId);
    try {
        FileInputStream fileIn = new FileInputStream(PathUtil.getSerPath() + "audio_instance" + "_" + instanceId);
        ObjectInputStream in = new ObjectInputStream(fileIn);
        List<AudioResult> audioResults = (List<AudioResult>) in.readObject();
        in.close();
        fileIn.close();
        audioInstance.setAudioResults(audioResults);
    } catch (IOException e) {
        System.out.println("Results for " + instanceId + "not found. Returns empty list.");
        audioInstance.setAudioResults(new ArrayList<>());
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
    return audioInstance;
}

public ThreeDimensionInstance getThreeDimensionInstance(String instanceId) {
    ThreeDimensionInstance threeDimensionInstance = threeDimensionInstanceDao.findThreeDimensionInstanceByInstanceId(instanceId);
    try {
        FileInputStream fileIn = new FileInputStream(PathUtil.getSerPath() + "threeDimension_instance" + "_" +    instanceId);
        ObjectInputStream in = new ObjectInputStream(fileIn);
        List<ThreeDimensionResult> threeDimensionResults = (List<ThreeDimensionResult>) in.readObject();
        in.close();
        fileIn.close();
        threeDimensionInstance.setThreeDimensionResults(threeDimensionResults);
    } catch (IOException e) {
        System.out.println("Results for " + instanceId + "not found. Returns empty list.");
        threeDimensionInstance.setThreeDimensionResults(new ArrayList<>());
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
    return threeDimensionInstance;
}
```


无脑try catch，几乎相同的处理逻辑（解决方法：让Spring boot处理错误）

无脑转发BL层（问题：BL层和Controller完全使用同样的函数签名和Po/Vo/返回值类型，这样的分层毫无意义）（解决方法：可直接将BL的代码写到controller中。）

```java
public ResponseEntity<Response> queryInstance(@PathVariable("instanceId") String instanceId) {
    try {
        return new ResponseEntity<>(requesterMissionBlService.queryInstance(instanceId), HttpStatus.OK);
    } catch (InstanceNotExistException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getResponse(), HttpStatus.NOT_FOUND);
    }
}

public ResponseEntity<Response> finalize(@PathVariable("instanceId") String instanceId, @RequestBody MissionFinalizeVo missionFinalizeVo) {
    try {
        return new ResponseEntity<>(requesterMissionBlService.finalize(instanceId, missionFinalizeVo), HttpStatus.OK);
    } catch (InstanceNotExistException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getResponse(), HttpStatus.NOT_FOUND);
    } catch (SystemException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getResponse(), HttpStatus.SERVICE_UNAVAILABLE);
    } catch (MissionIdDoesNotExistException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getResponse(), HttpStatus.NOT_FOUND);
    }
}
```

# 错误示范带来的问题

以上代码给我们的错误调试带来了巨大的难度，耗费了很多的时间和精力：

1. 新增一个分支，需要复制粘贴很多现有代码；
2. 修改一处逻辑，需要在多个switch分支、多个方法甚至多个文件里修改同样的逻辑，漏改几乎是肯定的；
3. 代码量爆炸，同样的逻辑无意义地重复多次，使得代码不美观；
4. 逻辑不清晰，需要看懂整个重复代码才能知道这是做什么；
5. 很多复制粘贴出来的代码其实根本不能运行，发现后浪费更多的时间在调试和重写上。


# 常见优化方法

1. 将共用代码提成一个函数/类（谁都知道）
2. 使用高级语言特性

```python
actual_value = 1
expected_values = [{value: 1}, {value: 2}, {value: 3}]
```

不好的
```python
for i in range(expected_values.__len__()):
    if actual_value == expected_values[i]["value"]:
        return True

return False
```

好的
```python
return actual_value in [ i["value"] for i in expected_values ]
```

3. 使用框架提供的工具，结构

大佬写的、全球这么多人都用的东西，肯定有其可取之处。我们不用自己想、自己实现一个框架那么牛逼的结构，但是总是该会用的。多看看开源代码，遇到问题多搜索，往往能够看到一个精妙的解决方案。

# 优化实例

下面通过一个例子来解释如何动脑子提高代码质量。


需求：我们正在做一个RESTful接口，其中一些路径在执行前需要验证是否登录，如果没有登录，直接返回401，并保存下当前用户；若已经登录，则继续执行。

最简单的方法如下：

```python
def path1():
    user=UserDao.get_user_by_username(request.args("username")):
    if not user:
        return {"error": "not login"}, 403
    pass

def path2():
    user=UserDao.get_user_by_username(request.args("username")):
    if not user:
        return {"error": "not login"}, 403
    pass

```

以上代码中出现了重复的代码（if else）。这个写法带来了以下的问题：

1. 每新增一个路径，都要复制同样的代码
2. 一旦逻辑有变（获得用户的方法）或者返回值有变（return语句），每个地方都要重新修改，很容易造成修改不完全
3. 代码膨胀，不够清晰，需要看懂整个代码才能知道这段代码的作用，并且会影响真正逻辑的阅读

于是，根据**方法1：提取公共方法**，上述代码可以优化成以下代码。

```python

def get_user():
    return UserDao.get_user_by_username(request.args("username")):

not_login_error = ({"error": "not login"}, 403)

def path1():
    user=get_user()
    if not user:
        return {"error": "not login"}, 403
    pass

def path2():
    user=get_user()
    if not user:
        return not_login_error
    pass

```

这个解决方法能够部分解决以上提到的三个问题。

大部分人都能把上述代码优化成如下的代码，并且他们内心中都会觉得这样已经是最简了，即使这个做法仍然要多次重复写if return语句，他们也会觉得这是没有办法的事。

其实，还有更好的方法。

根据以上的**方法2：使用高级语言特性**，这里是decorator，以上代码还能继续优化成以下代码：

```python

def need_login(func):
    def wrapped(*args, **kwargs):
        user=UserDao.get_user_by_username(request.args("username")):
        if not user:
            return {"error": "not login"}, 403
        return func(*args, user=user, **kws)
    return wrapped

@need_login
def path1(user: User):
    pass

@need_login
def path2(user: User):
    pass
```

请对比以上代码和之前两段代码，就能很明显的发现这段代码有以下的好处：

1. 逻辑清晰

看到@need_login就知道，原来这个path需要登录才能进入，并且还能知道这个方法运行的时候还需要使用用户作为参数。当path更多的时候，这样做也能显著降低代码量，并减少阅读时无关代码的数量。

2. 便于测试

要只想测试path的逻辑，不需要真正去运行获得用户（`UserDao.get_user_by_username`）的代码，测试代码只需要传入一个Mock User，就可以测试这段代码的逻辑是否正确。当然，前两个代码也可以做到这点，但是不得不引入多余的方法。

3. 修改灵活

need_login中可以随意修改逻辑，甚至可以完全取消这个验证，完全不影响业务代码。

这种方法有个缺陷，就是只适合于动态类型的语言（JS也有类似的），对于写Spring Boot的Java，应该怎么办呢？

根据**方法3：使用框架提供的工具，结构**，我们只需要搜索一下，就能知道Spring Boot提供了Filter机制，特别适合用来完成这种工作。（这里黑一波Spring和Java：在网上搜Spring和Java，出来的东西很多都是过时的和重复的，用英文搜索稍微好一些。所以Java和Spring在网上热度高不是没有道理：毕竟你得花很长的时间才能找到你想要的东西，反观CSharp和ASP.NET Core，没有什么是MSDN不能解决的，如果有，就用英文Google一下很快就能找到）

```java
// 定义Filter

@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    @Qualifier("jwtUserDetailsServiceImpl")
    @Autowired
    private UserDetailsService userDetailsService;

    @Value("${jwt.header}")
    private String tokenHeader;

    @Value("${jwt.tokenHead}")
    private String tokenHead;

    @Autowired
    private JwtService jwtService;

    @Autowired
    public JwtAuthenticationTokenFilter() {
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader(this.tokenHeader);
        if (authHeader != null && authHeader.startsWith(tokenHead)) {
            final String authToken = authHeader.substring(tokenHead.length());
            String username = jwtService.getUsernameFromToken(authToken);

            if (authToken.length() > 0) {
                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (jwtService.validateToken(authToken)) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(
                            request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        chain.doFilter(request, response);
    }
}

// 使用。这样，整个Controller在执行以前，都会经过Filter验证，如果没有，就直接返回Response。

@PreAuthorize(value = "hasRole('" + Role.REQUESTER_NAME + "')")
@RestController
public class RequesterInfoController {
    //...
}
```


其实，之前decorator的做法在flask文档中都有提到，以上代码就几乎等同于这个[官方示例](http://flask.pocoo.org/docs/1.0/patterns/viewdecorators/)。

# 总结

很多同学写代码只图早点做完，只图能跑，这固然可以理解：学习任务重，DDL紧，检查也只看效果不看代码更别说质量了。可是，只图快不动脑的代码会极大地浪费自己或者组内大佬的调试时间，破坏心情和组内的关系（我看到这种代码的第一反应就是骂人），当代码量上去后，这种代码也只会让开发的时间和难度指数型上升，最终害人害己。

所以，我想呼吁所有人，为了自己和他们的时间，写代码时请带上脑子！
