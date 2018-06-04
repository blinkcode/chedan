
# 扯弹后台管理系统

暂时想到的内容如下，不排除会在使用过程中对其中的内容稍作修改，望理解。

### 待解决问题

0. 之前有个需求，在token过期的时候，可以直接跳转到登录页面，这个你处理一下，目前么有跳转(已解决)
0. 更新电影的时候，电影海报路径，演员ID列表，导演ID列表，电影宣传图片列表均没有提供(已解决)
0. 更新电影的时候，电影的状态，需要进行一下转化（1即将上映，2正在热映，4已下线）（同时页面上面的文字也改成这三个）
0. 在点击保存之后，已有的演员，导演列表会增加几个，这个需要调整一下
0. 目前电影编辑页面，仍然不能显示刚刚上传的电影海报。上传电影图片按钮也不好使
0. 点击添加电影，进入电影编辑页面，输入信息之后，点击保存，调用的是put接口，应该调用post来创建的，而且，海报信息会过来，需要调整
0. 风格页面，在点击添加按钮的时候，判断一下是否为空，否则会加一个空的类型
0. 片花页面，点击输入框会有列表出来，点击（或者别的方式）选中一个电影的时候，自动跳转到查看片花页面，否则现在输入框没有作用的
0. 你在找一下之前我在微信里面给你的，演员导演添加页面的样式，片花页面的样式，稍微调整一下

### 开发语言
+ VUE + Element

### 在线文档（测试环境）
+ http://chedan.paijiazhuang.com/swagger/#

```Shell
演员的相关接口：http://chedan.paijiazhuang.com/swagger/#!/actor
导演的相关接口：http://chedan.paijiazhuang.com/swagger/#!/director
电影的相关接口：http://chedan.paijiazhuang.com/swagger/#!/channel
片花的相关接口：http://chedan.paijiazhuang.com/swagger/#!/trailer
安装包的相关接口：http://chedan.paijiazhuang.com/swagger/#!/package
评论的相关接口：http://chedan.paijiazhuang.com/swagger/#!/comment
电影风格信息：http://chedan.paijiazhuang.com/swagger/#/style
```

### 登录页面
+ 模仿现有页面即可：http://back.chedanapp.com/index.html
+ 用户登录接口：http://chedan.paijiazhuang.com/swagger/#!/user/post_user_login
+ 出了登录页面，其他页面都需要检查一下缓存的token，如果TOKEN过期了，则跳转至登录页面
+ 用户登录的时候会获取到token，需要将token和日期存到本地
+ 日期是检查token是否过期的简单方法而已（获取到当前日期如果不同，判断token已经过期）

### 列表页面左边的导航
+ 模仿现有页面即可：http://back.chedanapp.com/film.html
+ 下方的退出登录，将token从本地去掉，之后跳转到登录页面即可

### 电影列表页面
![电影信息展示](src/assets/img/film.jpg)

+ 如图，左边是电影的海报，右面对应的电影的各种信息，简单信息分两排来展示
+ 第一排放不下自动放到第二排，第三排为一行电影简介（判断字符数量，后面用...表示）
+ 第四排为电影的宣传图片信息，如果图片较多，设置成为可以左右可以拉动
+ 左边海报下面的编辑，点击，切换到对应的电影编辑页面，这个时候需要展示电影信息（添加的时候不需要展示）
+ 并且，两个接口不一样，带着信息过来的，使用put进行更新，不带信息过来的（添加电影）使用post进行创建
+ 电影编辑页面，需要通过标签的方式，添加演员，导演，电影风格信息

```shell
电影相关信息：
	Id           int64
	Name         string        `orm:"size(64);index"`                    // 电影名称
	Poster       string        `orm:"size(128)"`                         // 电影海报
	Images       string        `orm:"size(1000)"`                        // 海报剧照
	Introduction string        `orm:"size(1024)"`                        // 电影介绍
	TotalTime    int64         `orm:""`                                  // 电影总时长（毫秒数）
	Status       ChannelStatus `orm:"index;default(2)"`                  // 类别 FilmStatus    1即将上线,2正在上映,4已下架
	Type         ChannelType   `orm:"index;default(1)"`                  // 渠道类型: 1:电影; 2:电视
	Recommend    int           `orm:"index"`                             // 被推荐层度(0,普通,1-10推荐层度)
	FirstShow    time.Time     `orm:"auto_now_add;type(datetime);index"` // 首映时间
	CommentCount int64         `orm:""`                                  // 评论条数
	AcceptReward bool          `orm:""`                                  // 是否接受打赏
	RewardCount  int64         `orm:"index"`                             // 收到的总打赏
	RewardWeek   int64         `orm:"index"`                             // 周打赏
	WantToSee    int64         `orm:"index"`                             // 点看人数
	RankingWeek  int64         `orm:"index"`                             // 周排行
	Actors       []*Actor      `orm:"rel(m2m)"`                          // 电影的演员列表
	Directors    []*Director   `orm:"rel(m2m)"`                          // 电影的导演列表
	Styles       []*Style      `orm:"rel(m2m)"`                          // 电影的类型列表
	RewardList   []*Reward     `orm:"reverse(many)"`
	Created      time.Time     `orm:"auto_now_add;type(datetime)"`
```

### 演员列表页面

```shell
演员的信息如下：
    Name         string
    Introduction string
    Header       string
```

+ 演员只有头像，名称，简介需要展示，所以每行可以根据宽度来进行调整展示的数量（3-5）
+ 每一个演员的展示模块，可以做成 左边头像，右边上下分别为名称和简介的形式
+ 这个编辑页面可以直接在列表页面编辑（因为数据量比较少）或者单独在另一个页面进行编辑也可以（逻辑和电影的类似）

### 导演相关页面

+ 导演的内容和演员的完全一样，可以照搬

### 电影风格信息

+ 电影风格只有名字的特性，所以直接做一个列表即可（两列id+name,多行）
+ 可以直接在这个列表页面添加风格即可

### 片花的信息

+ 片花的内容其实和电影的比较类似

```shell
片花的数据结构如下：
    Id           int64
    Name         string        `orm:"size(64);index"`                    // 片花名称
    Poster       string        `orm:"size(128)"`                         // 片花海报
    Paths        string        `orm:"size(1000)"`                        // 片花视频路径
    Channel      *Channel      `orm:"rel(fk);index"`                     // 电影
    TotalTime    int64         `orm:""`                                  // 电影总时长（毫秒数）
    Created      time.Time     `orm:"auto_now_add;type(datetime)"`
```

+ 展示的内容有：名称，海报（点击可以播放视频）所属电影，总时长，创建时间
+ 此页面需要有个输入框，输入电影的名称来进行筛选
+ 结构中有个字段是Channel，这个标识这是某个电影，在输入框中输入电影的名称，通过搜索接口找到对应的匹配的电影名称列表，用户点击，可以选定，之后片花根据选定电影来选择片花列表进行展示。

### 安装包

+ 安装包比较简单，以下信息显示出来即可，可以在新页面进行编辑或者添加操作

```shell
安装包的信息如下
    Id           *int64  `json:"id,omitempty"`
    VersionName  *string `json:"versionName,omitempty"`
    VersionCode  *int64  `json:"versionCode,omitempty"`
    Introduction *string `json:"introduction,omitempty"`
    Path         *string `json:"path,omitempty"`
    Created      *string `json:"created,omitempty"`
```

### 评论页面

+ 此部分其实际意义在于为后台添加一些评论信息，通过提供ChannelId，Comments，来提供相关信息
+ 接口；http://chedan.paijiazhuang.com/swagger/#!/helper/post_helper_comments
+ 评论页面是添加测试品论的功能，这个只需要有个输入框可以选择电影，之后有个输入框可以将评论copy进去并且点击上传即可
+ 1，电影的输入框和片花中类似，可以搜索电影列表，选择选定电影
+ 2，另一个大的输入域，可以添加comments列表的json数据，
+ 3，提供一个button，点击添加即可（添加之后，将数据清空，以免多次添加数据）。

### 七牛云相关

+ 所有后台需要上传的文件，都上传到七牛云
+ 七牛云token的获取接口：http://www.chedanapp.com/swagger/#!/keys/get_keys_qiniu
+ 所有的图片名称为 image_md5(file).png(jpg) 前缀（image_) + 文件的md5哈希值 + 文件扩展名
+ 所有的视频前缀为 video_trailer_ + channelId + 文件hash + 扩展名
+ 所有的开发安装包文件名称为用户填写
+ 上面说的三条文件名称，作为七牛云上传文件的KEY

### END
