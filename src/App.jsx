import { useState, useEffect, useRef, useCallback } from "react";

// ─── Compact Character Data: [char, pinyin, word1, word2, initial, final] ────
// Grouped by [book][lesson]
const DATA = {
  1: {
    name: "第一册", lessons: {
      1: { name:"数字", chars: [["一","yi","一个","一天","y","i"],["二","er","二月","第二","","er"],["三","san","三个","三月","s","an"],["四","si","四个","四季","s","i"],["五","wu","五个","五月","w","u"],["六","liu","六个","六月","l","iu"],["七","qi","七个","七月","q","i"],["八","ba","八个","八月","b","a"],["九","jiu","九个","九月","j","iu"],["十","shi","十个","十月","sh","i"],["百","bai","一百","百花","b","ai"]]},
      2: { name:"身体", chars: [["人","ren","人们","大人","r","en"],["大","da","大人","大家","d","a"],["小","xiao","小鸟","大小","x","iao"],["多","duo","多少","很多","d","uo"],["少","shao","多少","少年","sh","ao"],["口","kou","门口","口水","k","ou"],["耳","er","耳朵","木耳","","er"],["手","shou","小手","手指","sh","ou"],["足","zu","足球","手足","z","u"],["目","mu","目光","目前","m","u"],["头","tou","头发","石头","t","ou"]]},
      3: { name:"自然", chars: [["日","ri","日出","生日","r","i"],["月","yue","月亮","月饼","y","ue"],["水","shui","喝水","水果","sh","ui"],["火","huo","火车","大火","h","uo"],["木","mu","树木","木头","m","u"],["土","tu","土地","泥土","t","u"],["山","shan","高山","山水","sh","an"],["石","shi","石头","石子","sh","i"],["禾","he","禾苗","禾田","h","e"],["田","tian","田地","水田","t","ian"]]},
      4: { name:"方位", chars: [["上","shang","上学","上面","sh","ang"],["下","xia","下雨","上下","x","ia"],["入","ru","进入","出入","r","u"],["出","chu","出去","出来","ch","u"],["来","lai","来了","回来","l","ai"],["去","qu","去年","出去","q","u"],["左","zuo","左边","左右","z","uo"],["右","you","右边","左右","y","ou"],["立","li","立正","站立","l","i"],["坐","zuo","坐下","请坐","z","uo"],["走","zou","走路","走开","z","ou"],["中","zhong","中国","中间","zh","ong"]]},
      5: { name:"四季", chars: [["天","tian","天空","今天","t","ian"],["地","di","地上","土地","d","i"],["春","chun","春天","春风","ch","un"],["夏","xia","夏天","夏日","x","ia"],["秋","qiu","秋天","秋风","q","iu"],["冬","dong","冬天","冬日","d","ong"],["风","feng","大风","风车","f","eng"],["雨","yu","下雨","雨伞","y","u"],["雪","xue","下雪","雪花","x","ue"],["云","yun","白云","云朵","y","un"]]},
      6: { name:"动物颜色", chars: [["草","cao","小草","草地","c","ao"],["花","hua","花朵","花园","h","ua"],["鸟","niao","小鸟","鸟巢","n","iao"],["鱼","yu","小鱼","金鱼","y","u"],["虫","chong","小虫","虫子","ch","ong"],["羊","yang","小羊","山羊","y","ang"],["牛","niu","牛奶","水牛","n","iu"],["马","ma","小马","马车","m","a"],["白","bai","白云","白色","b","ai"],["红","hong","红色","红花","h","ong"],["黑","hei","黑色","黑夜","h","ei"],["绿","lv","绿色","绿草","l","v"],["蓝","lan","蓝天","蓝色","l","an"],["黄","huang","黄色","黄金","h","uang"],["开","kai","开门","开心","k","ai"],["电","dian","电话","电视","d","ian"],["说","shuo","说话","说明","sh","uo"]]},
      7: { name:"学校", chars: [["文","wen","文学","语文","w","en"],["生","sheng","学生","生日","sh","eng"],["老","lao","老师","老人","l","ao"],["爱","ai","爱好","喜爱","","ai"],["我","wo","我们","自我","w","o"],["同","tong","同学","不同","t","ong"],["师","shi","老师","师父","sh","i"],["学","xue","学校","学习","x","ue"],["校","xiao","学校","校长","x","iao"]]},
      8: { name:"朋友", chars: [["你","ni","你好","你们","n","i"],["们","men","我们","他们","m","en"],["好","hao","你好","好人","h","ao"],["了","le","好了","来了","l","e"],["高","gao","高大","高山","g","ao"],["见","jian","看见","再见","j","ian"],["车","che","火车","汽车","ch","e"],["真","zhen","认真","真好","zh","en"],["早","zao","早上","早安","z","ao"],["兴","xing","高兴","兴趣","x","ing"]]},
      9: { name:"家庭", chars: [["爸","ba","爸爸","老爸","b","a"],["妈","ma","妈妈","大妈","m","a"],["爷","ye","爷爷","老爷","y","e"],["奶","nai","奶奶","牛奶","n","ai"],["家","jia","回家","家人","j","ia"],["的","de","好的","我的","d","e"],["是","shi","是的","不是","sh","i"],["有","you","没有","有人","y","ou"],["这","zhe","这个","这里","zh","e"]]},
      10: { name:"生活", chars: [["他","ta","他们","其他","t","a"],["看","kan","看见","好看","k","an"],["门","men","大门","门口","m","en"],["后","hou","后面","以后","h","ou"],["前","qian","前面","面前","q","ian"],["外","wai","外面","外国","w","ai"],["个","ge","一个","个人","g","e"],["年","nian","新年","去年","n","ian"],["季","ji","四季","春季","j","i"],["儿","er","儿子","女儿","","er"],["园","yuan","花园","公园","y","uan"]]},
      11: { name:"方向", chars: [["面","mian","面前","上面","m","ian"],["东","dong","东方","东西","d","ong"],["西","xi","东西","西方","x","i"],["南","nan","南方","南北","n","an"],["北","bei","北方","南北","b","ei"],["方","fang","方向","东方","f","ang"],["太","tai","太阳","太大","t","ai"],["阳","yang","太阳","阳光","y","ang"],["向","xiang","方向","向上","x","iang"],["认","ren","认识","认真","r","en"]]},
      12: { name:"穿戴", chars: [["到","dao","到了","看到","d","ao"],["戴","dai","穿戴","戴上","d","ai"],["穿","chuan","穿衣","穿上","ch","uan"],["衣","yi","衣服","穿衣","y","i"],["帽","mao","帽子","草帽","m","ao"],["身","shen","身体","身上","sh","en"],["体","ti","身体","体育","t","i"],["热","re","热天","热水","r","e"],["新","xin","新年","新的","x","in"],["习","xi","学习","习惯","x","i"],["祝","zhu","祝福","祝你","zh","u"],["闹","nao","热闹","闹钟","n","ao"]]},
    }
  },
  2: {
    name: "第二册", lessons: {
      1: { name:"中文学校", chars: [["在","zai","在家","在学校","z","ai"],["教","jiao","教室","教学","j","iao"],["画","hua","画画","画家","h","ua"],["写","xie","写字","写作","x","ie"],["字","zi","汉字","写字","z","i"],["歌","ge","唱歌","儿歌","g","e"],["喜","xi","喜欢","喜爱","x","i"],["欢","huan","喜欢","欢乐","h","uan"],["汉","han","汉字","汉语","h","an"]]},
      2: { name:"教室里", chars: [["那","na","那个","那里","n","a"],["她","ta","她的","她们","t","a"],["笔","bi","铅笔","毛笔","b","i"],["本","ben","本子","书本","b","en"],["子","zi","孩子","本子","z","i"],["讲","jiang","讲话","讲中文","j","iang"],["里","li","家里","这里","l","i"],["书","shu","书本","读书","sh","u"],["室","shi","教室","房室","sh","i"],["吗","ma","好吗","是吗","m","a"],["不","bu","不是","不好","b","u"]]},
      3: { name:"放学了", chars: [["放","fang","放学","放心","f","ang"],["今","jin","今天","今年","j","in"],["星","xing","星期","星星","x","ing"],["期","qi","星期","日期","q","i"],["告","gao","告诉","报告","g","ao"],["午","wu","上午","中午","w","u"],["朋","peng","朋友","小朋友","p","eng"],["友","you","朋友","友好","y","ou"],["问","wen","问题","请问","w","en"],["谁","shei","是谁","谁的","sh","ei"],["听","ting","听说","听写","t","ing"],["心","xin","开心","心里","x","in"]]},
      4: { name:"讲礼貌", chars: [["用","yong","用心","有用","y","ong"],["记","ji","记住","日记","j","i"],["请","qing","请坐","请问","q","ing"],["谢","xie","谢谢","感谢","x","ie"],["对","dui","对不起","不对","d","ui"],["起","qi","起来","一起","q","i"],["没","mei","没有","没关系","m","ei"],["关","guan","关门","没关系","g","uan"],["系","xi","关系","联系","x","i"],["再","zai","再见","再来","z","ai"],["做","zuo","做事","做好","z","uo"],["孩","hai","孩子","小孩","h","ai"]]},
      5: { name:"买东西", chars: [["买","mai","买东西","买书","m","ai"],["岁","sui","六岁","几岁","s","ui"],["昨","zuo","昨天","昨日","z","uo"],["给","gei","给你","送给","g","ei"],["蛋","dan","鸡蛋","蛋糕","d","an"],["包","bao","书包","面包","b","ao"],["果","guo","水果","果汁","g","uo"],["玩","wan","玩具","好玩","w","an"],["具","ju","玩具","文具","j","u"],["哥","ge","哥哥","大哥","g","e"],["姐","jie","姐姐","大姐","j","ie"],["张","zhang","一张","张开","zh","ang"],["卡","ka","生日卡","卡片","k","a"],["唱","chang","唱歌","合唱","ch","ang"]]},
      6: { name:"我会做", chars: [["会","hui","会做","学会","h","ui"],["事","shi","做事","故事","sh","i"],["可","ke","可是","可以","k","e"],["别","bie","别人","特别","b","ie"],["收","shou","收拾","收到","sh","ou"],["拾","shi","收拾","拾起","sh","i"],["房","fang","房间","房子","f","ang"],["间","jian","房间","时间","j","ian"],["洗","xi","洗手","洗衣","x","i"],["饿","e","很饿","饥饿","","e"]]},
      7: { name:"两件宝", chars: [["两","liang","两个","两天","l","iang"],["件","jian","一件","文件","j","ian"],["宝","bao","宝贝","珍宝","b","ao"],["双","shuang","双手","一双","sh","uang"],["脑","nao","大脑","脑子","n","ao"],["工","gong","工人","工作","g","ong"],["思","si","思考","意思","s","i"],["考","kao","考试","思考","k","ao"],["作","zuo","工作","作业","z","uo"],["万","wan","一万","万一","w","an"],["又","you","又大又小","又来","y","ou"],["得","de","做得好","觉得","d","e"]]},
      8: { name:"月亮", chars: [["亮","liang","月亮","亮光","l","iang"],["跟","gen","跟着","跟人","g","en"],["也","ye","也是","也好","y","e"],["为","wei","为什么","因为","w","ei"],["什","shen","什么","为什么","sh","en"],["么","me","什么","怎么","m","e"],["远","yuan","远方","很远","y","uan"],["哪","na","哪里","哪个","n","a"],["觉","jue","觉得","感觉","j","ue"],["明","ming","明天","明白","m","ing"],["很","hen","很好","很大","h","en"]]},
      9: { name:"为什么", chars: [["时","shi","时间","小时","sh","i"],["夜","ye","黑夜","夜里","y","e"],["光","guang","光明","月光","g","uang"],["河","he","小河","河水","h","e"],["流","liu","流水","河流","l","iu"],["动","dong","动物","运动","d","ong"],["湖","hu","湖水","西湖","h","u"],["飞","fei","飞机","起飞","f","ei"],["游","you","游泳","旅游","y","ou"],["想","xiang","想念","思想","x","iang"]]},
      10: { name:"春雨", chars: [["种","zhong","种子","种花","zh","ong"],["像","xiang","好像","像是","x","iang"],["色","se","颜色","红色","s","e"],["落","luo","落下","降落","l","uo"],["吹","chui","吹风","吹牛","ch","ui"],["把","ba","把手","一把","b","a"],["知","zhi","知道","知识","zh","i"],["每","mei","每天","每个","m","ei"],["快","kuai","快乐","很快","k","uai"],["最","zui","最好","最大","z","ui"]]},
      11: { name:"江河", chars: [["海","hai","大海","海水","h","ai"],["江","jiang","长江","江水","j","iang"],["条","tiao","一条","条件","t","iao"],["经","jing","已经","经过","j","ing"],["过","guo","经过","过去","g","uo"],["长","chang","长大","长江","ch","ang"],["像","xiang","好像","像是","x","iang"],["边","bian","旁边","左边","b","ian"],["城","cheng","城市","长城","ch","eng"],["被","bei","被子","被人","b","ei"]]},
      12: { name:"放假了", chars: [["假","jia","放假","假日","j","ia"],["带","dai","带来","带走","d","ai"],["些","xie","一些","这些","x","ie"],["它","ta","它们","它的","t","a"],["跳","tiao","跳舞","跳高","t","iao"],["弟","di","弟弟","兄弟","d","i"],["妹","mei","妹妹","姐妹","m","ei"],["总","zong","总是","总共","z","ong"],["跑","pao","跑步","赛跑","p","ao"],["呢","ne","好呢","你呢","n","e"]]},
    }
  },
  3: {
    name: "第三册", lessons: {
      1: { name:"小猫钓鱼", chars: [["猫","mao","小猫","猫咪","m","ao"],["钓","diao","钓鱼","垂钓","d","iao"],["呀","ya","好呀","是呀","y","a"],["找","zhao","找到","寻找","zh","ao"],["叫","jiao","叫声","大叫","j","iao"],["条","tiao","一条鱼","条件","t","iao"],["只","zhi","一只","只有","zh","i"],["坐","zuo","坐下","请坐","z","uo"],["钓","diao","钓鱼","钓竿","d","iao"]]},
      2: { name:"小马过河", chars: [["深","shen","深浅","深水","sh","en"],["浅","qian","深浅","浅水","q","ian"],["试","shi","试试","考试","sh","i"],["答","da","回答","答案","d","a"],["急","ji","着急","急忙","j","i"],["腿","tui","大腿","跑腿","t","ui"],["条","tiao","一条河","条件","t","iao"],["该","gai","应该","该做","g","ai"],["淹","yan","淹没","淹死","y","an"]]},
      3: { name:"龟兔赛跑", chars: [["龟","gui","乌龟","海龟","g","ui"],["兔","tu","兔子","白兔","t","u"],["赛","sai","比赛","赛跑","s","ai"],["比","bi","比赛","比较","b","i"],["输","shu","输赢","认输","sh","u"],["赢","ying","输赢","赢了","y","ing"],["睡","shui","睡觉","睡着","sh","ui"],["醒","xing","醒来","清醒","x","ing"],["慢","man","慢慢","太慢","m","an"]]},
      4: { name:"称象", chars: [["称","cheng","称象","名称","ch","eng"],["象","xiang","大象","象牙","x","iang"],["重","zhong","重量","很重","zh","ong"],["船","chuan","小船","轮船","ch","uan"],["石","shi","石头","石子","sh","i"],["办","ban","办法","办事","b","an"],["法","fa","办法","方法","f","a"],["沉","chen","沉重","沉下","ch","en"],["线","xian","画线","线条","x","ian"]]},
      5: { name:"狐假虎威", chars: [["狐","hu","狐狸","狐假虎威","h","u"],["虎","hu","老虎","虎牙","h","u"],["威","wei","威风","威力","w","ei"],["怕","pa","害怕","可怕","p","a"],["跑","pao","跑步","赛跑","p","ao"],["回","hui","回家","回来","h","ui"],["往","wang","往前","来往","w","ang"],["信","xin","相信","写信","x","in"],["狸","li","狐狸","果子狸","l","i"]]},
      6: { name:"司马光", chars: [["司","si","司马","公司","s","i"],["掉","diao","掉下","丢掉","d","iao"],["救","jiu","救人","救命","j","iu"],["搬","ban","搬家","搬走","b","an"],["砸","za","砸破","砸碎","z","a"],["缸","gang","水缸","鱼缸","g","ang"],["破","po","打破","破碎","p","o"],["吓","xia","吓人","惊吓","x","ia"],["哭","ku","哭了","大哭","k","u"]]},
      7: { name:"刻舟求剑", chars: [["刻","ke","刻苦","立刻","k","e"],["舟","zhou","小舟","龙舟","zh","ou"],["求","qiu","要求","请求","q","iu"],["剑","jian","宝剑","利剑","j","ian"],["掉","diao","掉了","丢掉","d","iao"],["岸","an","岸边","上岸","","an"],["傻","sha","傻瓜","发傻","sh","a"],["拿","na","拿起","拿来","n","a"],["急","ji","着急","焦急","j","i"]]},
      8: { name:"猴子捞月亮", chars: [["猴","hou","猴子","金丝猴","h","ou"],["捞","lao","打捞","捞起","l","ao"],["影","ying","影子","电影","y","ing"],["连","lian","连忙","连接","l","ian"],["倒","dao","倒下","颠倒","d","ao"],["挂","gua","挂上","牵挂","g","ua"],["原","yuan","原来","原因","y","uan"],["抬","tai","抬头","抬起","t","ai"]]},
      9: { name:"朋友", chars: [["让","rang","让开","礼让","r","ang"],["使","shi","使用","天使","sh","i"],["温","wen","温暖","温度","w","en"],["暖","nuan","温暖","暖和","n","uan"],["冷","leng","寒冷","冷水","l","eng"],["吵","chao","吵闹","争吵","ch","ao"],["错","cuo","错误","不错","c","uo"],["助","zhu","帮助","助手","zh","u"],["难","nan","困难","难过","n","an"]]},
      10: { name:"绝句", chars: [["绝","jue","绝句","绝对","j","ue"],["句","ju","句子","绝句","j","u"],["鸣","ming","鸟鸣","鸣叫","m","ing"],["翠","cui","翠绿","翠鸟","c","ui"],["含","han","包含","含义","h","an"],["岭","ling","山岭","翠岭","l","ing"],["泊","bo","停泊","湖泊","b","o"],["窗","chuang","窗户","窗口","ch","uang"]]},
      11: { name:"锄禾", chars: [["锄","chu","锄禾","锄头","ch","u"],["当","dang","当时","应当","d","ang"],["盘","pan","盘子","棋盘","p","an"],["餐","can","午餐","晚餐","c","an"],["粒","li","一粒","米粒","l","i"],["辛","xin","辛苦","辛劳","x","in"],["苦","ku","辛苦","苦难","k","u"],["汗","han","汗水","出汗","h","an"]]},
      12: { name:"悯农", chars: [["悯","min","悯农","怜悯","m","in"],["农","nong","农民","农村","n","ong"],["闲","xian","休闲","空闲","x","ian"],["饥","ji","饥饿","饥荒","j","i"],["死","si","死亡","生死","s","i"],["粮","liang","粮食","口粮","l","iang"],["食","shi","食物","粮食","sh","i"],["伤","shang","伤心","受伤","sh","ang"]]},
    }
  },
  4: {
    name: "第四册", lessons: {
      1: { name:"小红帽", chars: [["森","sen","森林","阴森","s","en"],["林","lin","树林","森林","l","in"],["奇","qi","好奇","奇怪","q","i"],["怪","guai","奇怪","怪物","g","uai"],["摘","zhai","摘花","采摘","zh","ai"],["篮","lan","篮子","花篮","l","an"],["送","song","送给","欢送","s","ong"],["病","bing","生病","病人","b","ing"],["路","lu","路上","马路","l","u"]]},
      2: { name:"丑小鸭", chars: [["丑","chou","丑小鸭","丑陋","ch","ou"],["鸭","ya","鸭子","小鸭","y","a"],["孤","gu","孤独","孤单","g","u"],["独","du","独自","孤独","d","u"],["冻","dong","冻住","冰冻","d","ong"],["翅","chi","翅膀","鸡翅","ch","i"],["膀","bang","翅膀","肩膀","b","ang"],["美","mei","美丽","美好","m","ei"],["丽","li","美丽","华丽","l","i"]]},
      3: { name:"三个和尚", chars: [["和","he","和尚","和平","h","e"],["尚","shang","和尚","高尚","sh","ang"],["抬","tai","抬头","抬水","t","ai"],["渴","ke","口渴","干渴","k","e"],["吃","chi","吃饭","吃药","ch","i"],["懒","lan","懒惰","偷懒","l","an"],["挑","tiao","挑水","挑选","t","iao"],["井","jing","水井","井水","j","ing"],["烧","shao","烧火","发烧","sh","ao"]]},
      4: { name:"春晓", chars: [["晓","xiao","春晓","拂晓","x","iao"],["眠","mian","睡眠","冬眠","m","ian"],["处","chu","到处","处理","ch","u"],["闻","wen","新闻","闻到","w","en"],["啼","ti","啼叫","鸟啼","t","i"],["落","luo","落花","降落","l","uo"],["诗","shi","诗人","古诗","sh","i"],["首","shou","一首","首先","sh","ou"]]},
      5: { name:"颜色", chars: [["颜","yan","颜色","容颜","y","an"],["紫","zi","紫色","紫花","z","i"],["粉","fen","粉红","花粉","f","en"],["橙","cheng","橙色","橙子","ch","eng"],["灰","hui","灰色","灰尘","h","ui"],["深","shen","深色","深浅","sh","en"],["淡","dan","淡色","清淡","d","an"],["彩","cai","彩色","色彩","c","ai"],["虹","hong","彩虹","长虹","h","ong"]]},
      6: { name:"数字歌", chars: [["鹅","e","天鹅","白鹅","","e"],["猪","zhu","小猪","猪肉","zh","u"],["鸡","ji","小鸡","鸡蛋","j","i"],["数","shu","数字","数学","sh","u"],["排","pai","排队","安排","p","ai"],["差","cha","差别","差不多","ch","a"],["整","zheng","整齐","完整","zh","eng"],["齐","qi","整齐","齐心","q","i"],["队","dui","排队","队长","d","ui"]]},
      7: { name:"猜谜语", chars: [["猜","cai","猜谜","猜测","c","ai"],["谜","mi","谜语","谜底","m","i"],["语","yu","语文","汉语","y","u"],["答","da","回答","答案","d","a"],["尾","wei","尾巴","结尾","w","ei"],["巴","ba","尾巴","下巴","b","a"],["跳","tiao","跳远","跳高","t","iao"],["腿","tui","后腿","大腿","t","ui"],["眼","yan","眼睛","眼泪","y","an"]]},
      8: { name:"小公鸡和小鸭子", chars: [["公","gong","公鸡","公园","g","ong"],["捉","zhuo","捉住","捕捉","zh","uo"],["急","ji","着急","急忙","j","i"],["叫","jiao","大叫","叫声","j","iao"],["直","zhi","一直","直接","zh","i"],["感","gan","感谢","感觉","g","an"],["情","qing","事情","心情","q","ing"],["伙","huo","伙伴","合伙","h","uo"],["伴","ban","伙伴","同伴","b","an"]]},
      9: { name:"乌鸦喝水", chars: [["乌","wu","乌鸦","乌云","w","u"],["鸦","ya","乌鸦","鸦片","y","a"],["渐","jian","渐渐","逐渐","j","ian"],["升","sheng","升高","上升","sh","eng"],["终","zhong","终于","最终","zh","ong"],["于","yu","终于","由于","y","u"],["瓶","ping","瓶子","花瓶","p","ing"],["旁","pang","旁边","身旁","p","ang"],["许","xu","许多","也许","x","u"]]},
      10: { name:"狼和小羊", chars: [["狼","lang","大灰狼","狼群","l","ang"],["温","wen","温和","温暖","w","en"],["吃","chi","吃掉","好吃","ch","i"],["弄","nong","弄脏","弄好","n","ong"],["脏","zang","弄脏","脏了","z","ang"],["气","qi","生气","天气","q","i"],["理","li","道理","理由","l","i"],["扑","pu","扑上","扑倒","p","u"]]},
      11: { name:"小猴子下山", chars: [["猴","hou","猴子","金猴","h","ou"],["掰","bai","掰开","掰玉米","b","ai"],["扛","kang","扛着","扛起","k","ang"],["扔","reng","扔掉","扔球","r","eng"],["抱","bao","拥抱","抱住","b","ao"],["追","zhui","追赶","追上","zh","ui"],["空","kong","空手","空间","k","ong"],["玉","yu","玉米","玉石","y","u"],["米","mi","大米","玉米","m","i"]]},
      12: { name:"棉花姑娘", chars: [["棉","mian","棉花","棉衣","m","ian"],["姑","gu","姑娘","姑妈","g","u"],["娘","niang","姑娘","新娘","n","iang"],["治","zhi","治病","治好","zh","i"],["燕","yan","燕子","飞燕","y","an"],["青","qing","青蛙","青草","q","ing"],["蛙","wa","青蛙","蛙鸣","w","a"],["瓢","piao","瓢虫","水瓢","p","iao"],["虫","chong","瓢虫","虫子","ch","ong"]]},
    }
  },
  5: {
    name: "第五册", lessons: {
      1: { name:"去超市", chars: [
        ["超","chao","超市","超人","ch","ao"],["市","shi","超市","城市","sh","i"],
        ["购","gou","购物","购买","g","ou"],["单","dan","清单","单子","d","an"],
        ["品","pin","食品","品尝","p","in"],["裙","qun","裙子","裙装","q","un"],
        ["挑","tiao","挑选","挑出","t","iao"],["选","xuan","选择","选出","x","uan"],
        ["新","xin","新鲜","新年","x","in"],["鲜","xian","新鲜","鱼鲜","x","ian"],
        ["节","jie","节约","节日","j","ie"],["约","yue","节约","大约","y","ue"],
        ["折","zhe","打折","折起","zh","e"],["错","cuo","错误","不错","c","uo"],
        ["列","lie","列出","排列","l","ie"],["颜","yan","颜色","容颜","y","an"],
        ["行","xing","行动","行走","x","ing"],["末","mo","末日","周末","m","o"],
        ["周","zhou","周末","一周","zh","ou"]
      ]},
      2: { name:"去露营", chars: [
        ["露","lu","露营","露水","l","u"],["营","ying","营地","露营","y","ing"],
        ["搭","da","搭帐篷","搭车","d","a"],["帐","zhang","帐篷","帐号","zh","ang"],
        ["烤","kao","烧烤","烤肉","k","ao"],["浪","lang","海浪","浪花","l","ang"],
        ["滩","tan","沙滩","河滩","t","an"],["泳","yong","游泳","泳池","y","ong"],
        ["油","you","油画","食油","y","ou"],["躺","tang","躺下","躺着","t","ang"],
        ["换","huan","换衣","交换","h","uan"],["聊","liao","聊天","闲聊","l","iao"]
      ]},
      3: { name:"中华文化大乐园", chars: [
        ["功","gong","功夫","成功","g","ong"],["夫","fu","功夫","夫人","f","u"],
        ["武","wu","武术","武功","w","u"],["术","shu","武术","艺术","sh","u"],
        ["舞","wu","跳舞","舞蹈","w","u"],["艺","yi","艺术","手艺","y","i"],
        ["响","xiang","响亮","音响","x","iang"],["民","min","人民","民族","m","in"],
        ["族","zu","民族","家族","z","u"],["统","tong","传统","统一","t","ong"],
        ["敢","gan","勇敢","敢做","g","an"],["勇","yong","勇敢","勇气","y","ong"],
        ["巧","qiao","心灵手巧","巧手","q","iao"],["骑","qi","骑马","骑车","q","i"],
        ["者","zhe","作者","学者","zh","e"],["捏","nie","捏泥","捏紧","n","ie"]
      ]},
      4: { name:"狼和小羊", chars: [
        ["反","fan","反正","反对","f","an"],["坏","huai","坏人","坏话","h","uai"],
        ["害","hai","害怕","害人","h","ai"],["脏","zang","弄脏","肮脏","z","ang"],
        ["近","jin","附近","近来","j","in"],["惊","jing","吃惊","惊奇","j","ing"],
        ["借","jie","借口","借用","j","ie"],["口","kou","借口","口水","k","ou"],
        ["轻","qing","轻轻","轻重","q","ing"],["亲","qin","亲爱","亲人","q","in"],
        ["先","xian","先生","首先","x","ian"]
      ]},
      5: { name:"狐狸和葡萄", chars: [
        ["葡","pu","葡萄","葡萄酒","p","u"],["萄","tao","葡萄","葡萄园","t","ao"],
        ["狐","hu","狐狸","狐狸精","h","u"],["架","jia","葡萄架","书架","j","ia"],
        ["够","gou","够了","足够","g","ou"],["垂","chui","垂头","垂下","ch","ui"],
        ["摘","zhai","摘下","采摘","zh","ai"],["丧","sang","垂头丧气","丧气","s","ang"],
        ["甜","tian","甜美","甜蜜","t","ian"],["运","yun","运气","运动","y","un"],
        ["总","zong","总是","最后","z","ong"],["最","zui","最后","最好","z","ui"],
        ["准","zhun","准备","准时","zh","un"],["算","suan","算了","计算","s","uan"],
        ["照","zhao","照片","按照","zh","ao"]
      ]},
      6: { name:"成语二则·闻鸡起舞 画龙点睛", chars: [
        ["闻","wen","闻鸡起舞","新闻","w","en"],["睛","jing","眼睛","画龙点睛","j","ing"],
        ["晨","chen","早晨","晨光","ch","en"],["驾","jia","驾车","驾驶","j","ia"],
        ["绝","jue","拒绝","绝对","j","ue"],["拒","ju","拒绝","拒之","j","u"],
        ["但","dan","但是","不但","d","an"],["典","dian","字典","典型","d","ian"],
        ["断","duan","不断","断开","d","uan"],["补","bu","补上","修补","b","u"],
        ["励","li","鼓励","励志","l","i"],["效","xiao","效果","有效","x","iao"],
        ["提","ti","提出","提起","t","i"],["理","li","理想","道理","l","i"],
        ["信","xin","相信","信心","x","in"],["互","hu","互相","互动","h","u"],
        ["知","zhi","知识","知道","zh","i"],["识","shi","知识","认识","sh","i"],
        ["认","ren","认识","认为","r","en"],["为","wei","认为","为了","w","ei"]
      ]},
      7: { name:"唐人街", chars: [
        ["岸","an","海岸","岸边","","an"],["所","suo","所以","场所","s","uo"],
        ["独","du","独立","独自","d","u"],["集","ji","集中","集合","j","i"],
        ["旧","jiu","旧的","旧书","j","iu"],["卖","mai","买卖","出卖","m","ai"],
        ["强","qiang","强大","坚强","q","iang"],["侨","qiao","华侨","侨胞","q","iao"],
        ["荣","rong","光荣","荣誉","r","ong"],["商","shang","商店","商人","sh","ang"],
        ["繁","fan","繁华","繁忙","f","an"],["联","lian","联系","联合","l","ian"],
        ["笼","long","笼子","鸟笼","l","ong"],["特","te","特别","特点","t","e"],
        ["迎","ying","欢迎","迎接","y","ing"],["越","yue","越来越","穿越","y","ue"],
        ["来","lai","来自","来了","l","ai"],["自","zi","来自","自己","z","i"],
        ["刚","gang","刚才","刚好","g","ang"],["各","ge","各地","各种","g","e"],
        ["地","di","各地","土地","d","i"]
      ]},
      8: { name:"太空英雄", chars: [
        ["宝","bao","宝贝","珍宝","b","ao"],["充","chong","充满","充分","ch","ong"],
        ["射","she","发射","射击","sh","e"],["升","sheng","升空","上升","sh","eng"],
        ["艘","sou","一艘","艘船","s","ou"],["顺","shun","顺利","顺风","sh","un"],
        ["厅","ting","大厅","客厅","t","ing"],["钟","zhong","钟","时钟","zh","ong"],
        ["永","yong","永远","永久","y","ong"],["英","ying","英雄","英语","y","ing"],
        ["雄","xiong","英雄","雄伟","x","iong"],["歇","xie","歇息","歇一下","x","ie"],
        ["载","zai","载人","装载","z","ai"],["另","ling","另外","另一","l","ing"],
        ["秘","mi","秘密","秘书","m","i"],["航","hang","航天","航行","h","ang"],
        ["分","fen","分钟","分开","f","en"],["成","cheng","成功","成为","ch","eng"],
        ["发","fa","发射","出发","f","a"],["出","chu","出发","出生","ch","u"],
        ["满","man","充满","满足","m","an"],["来","lai","来自","来到","l","ai"]
      ]},
      9: { name:"古诗·吟咏", chars: [
        ["扩","kuo","扩大","扩张","k","uo"],["恐","kong","恐怕","恐惧","k","ong"],
        ["何","he","任何","何时","h","e"],["旧","jiu","旧时","旧友","j","iu"],
        ["吟","yin","吟咏","吟唱","y","in"],["临","lin","临近","面临","l","in"],
        ["慈","ci","慈爱","慈祥","c","i"],["迟","chi","迟到","迟早","ch","i"],
        ["缝","feng","缝补","缝衣","f","eng"],["改","gai","改变","改动","g","ai"],
        ["归","gui","归来","回归","g","ui"],["童","tong","儿童","童年","t","ong"],
        ["线","xian","线","红线","x","ian"],["衰","shuai","衰老","衰退","sh","uai"],
        ["无","wu","无边","无法","w","u"],["寸","cun","寸","尺寸","c","un"]
      ]},
      10: { name:"曹冲称象", chars: [
        ["称","cheng","称","称象","ch","eng"],["秤","cheng","秤","杆秤","ch","eng"],
        ["冲","chong","曹冲","冲动","ch","ong"],["沉","chen","沉下","深沉","ch","en"],
        ["大","da","大象","大人","d","a"],["官","guan","官员","做官","g","uan"],
        ["员","yuan","官员","成员","y","uan"],["摇","yao","摇头","摇动","y","ao"],
        ["沿","yan","沿着","沿江","y","an"],["赶","gan","赶紧","赶快","g","an"],
        ["重","zhong","重量","重要","zh","ong"],["赞","zan","称赞","赞美","z","an"],
        ["点","dian","点头","一点","d","ian"]
      ]},
      11: { name:"设计·现代", chars: [
        ["参","can","参加","参观","c","an"],["而","er","而且","从而","","er"],
        ["设","she","设计","设备","sh","e"],["计","ji","设计","计算","j","i"],
        ["精","jing","精美","精彩","j","ing"],["镜","jing","眼镜","镜子","j","ing"],
        ["唯","wei","唯一","唯有","w","ei"],["任","ren","任何","责任","r","en"],
        ["典","dian","经典","典型","d","ian"],["拍","pai","拍照","拍手","p","ai"],
        ["出","chu","出现","出去","ch","u"],["现","xian","现代","现在","x","ian"],
        ["止","zhi","停止","止步","zh","i"],["怀","huai","怀念","胸怀","h","uai"],
        ["特","te","特别","特点","t","e"],["整","zheng","整天","整理","zh","eng"]
      ]},
      12: { name:"伟大的著作", chars: [
        ["暗","an","暗中","黑暗","","an"],["部","bu","部分","全部","b","u"],
        ["此","ci","从此","因此","c","i"],["纲","gang","大纲","纲要","g","ang"],
        ["广","guang","广大","宽广","g","uang"],["留","liu","留下","留学","l","iu"],
        ["穷","qiong","穷人","贫穷","q","iong"],["适","shi","合适","适合","sh","i"],
        ["误","wu","错误","误会","w","u"],["译","yi","翻译","译文","y","i"],
        ["珍","zhen","珍贵","珍爱","zh","en"],["性","xing","个性","性格","x","ing"],
        ["改","gai","改变","改动","g","ai"],["变","bian","改变","变化","b","ian"],
        ["感","gan","感谢","感动","g","an"],["谢","xie","感谢","谢谢","x","ie"],
        ["著","zhu","著作","名著","zh","u"],["作","zuo","著作","作品","z","uo"],
        ["伟","wei","伟大","伟人","w","ei"]
      ]},
    }
  },
};

// ─── Build CHARS array (with override support) ─────────────────
// Each character appears in every lesson where the textbook lists it —
// no deduplication, so character counts match the book exactly.
function buildChars(overrides) {
  const chars = [];
  for (const b of Object.keys(DATA).map(Number).sort((a,x)=>a-x)) {
    const lessonData = (overrides && overrides[b] && overrides[b].lessons) ? overrides[b].lessons : DATA[b].lessons;
    for (const l of Object.keys(lessonData).map(Number).sort((a,x)=>a-x)) {
      const chs = lessonData[l].chars;
      for (const ch of chs) {
        chars.push({ c: ch[0], p: ch[1], w: [ch[2], ch[3]], i: ch[4], f: ch[5], b, l });
      }
    }
  }
  return chars;
}

function getBookData(bookNum, overrides) {
  if (overrides && overrides[bookNum]) return overrides[bookNum];
  return DATA[bookNum];
}

let CHARS = buildChars(null);
const BOOKS = Object.keys(DATA).map(Number).sort((a,b)=>a-b);

// ─── Common char→pinyin map for auto-fill ──────────────────────
const CHAR_PINYIN = {};
for (const b of Object.keys(DATA)) {
  for (const l of Object.keys(DATA[b].lessons)) {
    for (const ch of DATA[b].lessons[l].chars) {
      if (!CHAR_PINYIN[ch[0]]) CHAR_PINYIN[ch[0]] = { p: ch[1], i: ch[4], f: ch[5] };
    }
  }
}

// ─── Pinyin Utils ───────────────────────────────────────────────
function normPy(r) { let s=r.toLowerCase().replace(/[^a-z]/g,""); s=s.replace(/ang/g,"an").replace(/eng/g,"en").replace(/ing/g,"in"); if(s.startsWith("zh"))s="z"+s.slice(2);else if(s.startsWith("ch"))s="c"+s.slice(2);else if(s.startsWith("sh"))s="s"+s.slice(2);if(s.startsWith("l"))s="n"+s.slice(1);return s; }
function lev(a,b){const m=a.length,n=b.length;const d=Array.from({length:m+1},(_,i)=>{const r=new Array(n+1).fill(0);r[0]=i;return r});for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n];}
function pySim(a,b){if(!a&&!b)return 1;if(!a||!b)return 0;const na=normPy(a),nb=normPy(b);return Math.max(0,1-lev(na,nb)/Math.max(na.length,nb.length,1));}
const SIM={q:["j","k"],j:["q"],zh:["z"],ch:["c"],sh:["s"],l:["n"],n:["l"],b:["p"],p:["b"],d:["t"],t:["d"],g:["k"],k:["g"],x:["s"],z:["zh"],c:["ch"],r:["l"]};
const AF=["a","o","e","i","u","ai","ei","ao","ou","an","en","ang","eng","ong","ia","ie","iao","iu","ian","in","iang","ing","ua","uo","ui","uan","un","ue"];
function genDist(cor,cd){const inits=["b","p","m","f","d","t","n","l","g","k","h","j","q","x","r","z","c","s","y","w"];const o=new Set([cor]);const ci=cd?.i||"",cf=cd?.f||"";if(ci&&SIM[ci])for(const si of SIM[ci])o.add(si+cf);if(cf.length>=2)o.add(ci+cf.slice(0,-1));let t=0;while(o.size<3&&t<30){o.add(inits[Math.floor(Math.random()*inits.length)]+AF[Math.floor(Math.random()*AF.length)]);t++;}return[...o].slice(0,3).sort(()=>Math.random()-0.5);}
function speak(t){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="zh-CN";u.rate=0.55;window.speechSynthesis.speak(u);}
function sS(n){return"⭐".repeat(n)+"☆".repeat(Math.max(0,3-n));}

// ─── State ──────────────────────────────────────────────────────
function mkState(){return{chars:CHARS.map((_,i)=>({idx:i,st:"unknown",fam:0,wc:0,sc:0})),streak:0,lci:null,ts:0,pm:true,ua:[],dt:{r:{d:0,t:8},p:{d:0,t:4},w:{d:0,t:3},date:new Date().toDateString()},tp:0,tw:0};}

// ─── App ────────────────────────────────────────────────────────
export default function App(){
  const[state,setState]=useState(mkState);
  const[page,setPage]=useState("home");
  const[ctx,setCtx]=useState(null);
  const[toast,setToast]=useState(null);
  const[overrides,setOverrides]=useState(null); // user-edited book data

  // Rebuild CHARS whenever overrides change
  useEffect(() => {
    CHARS = buildChars(overrides);
    // Resize state.chars if length differs
    setState(s => {
      if (s.chars.length === CHARS.length) return s;
      const oldMap = {};
      s.chars.forEach((c, i) => { if (i < CHARS.length) oldMap[i] = c; });
      const newChars = CHARS.map((_, i) => oldMap[i] || {idx:i,st:"unknown",fam:0,wc:0,sc:0});
      return {...s, chars: newChars};
    });
  }, [overrides]);

  useEffect(()=>{const td=new Date().toDateString();if(state.dt.date!==td)setState(s=>({...s,dt:{r:{d:0,t:8},p:{d:0,t:4},w:{d:0,t:3},date:td}}));},[state.dt.date]);

  const cnt=useCallback(st=>state.chars.filter(c=>c.st===st).length,[state.chars]);
  const cntFor=useCallback((st,idxs)=>state.chars.filter((c,i)=>idxs.includes(i)&&c.st===st).length,[state.chars]);

  const ACHS=[{id:"f5",n:"初出茅庐",d:"认识5个字",e:"🌟",ck:k=>k>=5},{id:"f20",n:"识字能手",d:"认识20个字",e:"📚",ck:k=>k>=20},{id:"f50",n:"识字达人",d:"认识50个字",e:"🏆",ck:k=>k>=50},{id:"f100",n:"百字通",d:"认识100个字",e:"👑",ck:k=>k>=100},{id:"f200",n:"小小学霸",d:"认识200个字",e:"🎖️",ck:k=>k>=200},{id:"f400",n:"识字大师",d:"认识400个字",e:"🌈",ck:k=>k>=400}];

  const chkA=useCallback(ns=>{const k=ns.chars.filter(c=>c.st==="known").length;for(const a of ACHS){if(!ns.ua.includes(a.id)&&a.ck(k)){ns={...ns,ua:[...ns.ua,a.id]};const ac=a;setTimeout(()=>{setToast(ac);setTimeout(()=>setToast(null),3000);},300);}}return ns;},[]);

  const upd=useCallback((idx,res)=>{setState(prev=>{const chars=prev.chars.map((c,i)=>{if(i!==idx)return c;const n={...c,sc:c.sc+1};if(res==="known")n.fam+=2;else if(res==="review")n.fam+=1;else{n.fam-=1;n.wc++;}n.st=n.fam>=4?"known":n.fam>=1?"review":"unknown";return n;});const dt={...prev.dt,r:{...prev.dt.r,d:Math.min(prev.dt.r.d+1,prev.dt.r.t)}};return chkA({...prev,chars,dt,ts:prev.ts+(res==="known"?2:res==="review"?1:0)});});},[chkA]);
  const rP=useCallback(()=>setState(p=>{const dt={...p.dt,p:{...p.dt.p,d:Math.min(p.dt.p.d+1,p.dt.p.t)}};return chkA({...p,dt,tp:(p.tp||0)+1});}),[chkA]);
  const rW=useCallback(()=>setState(p=>{const dt={...p.dt,w:{...p.dt.w,d:Math.min(p.dt.w.d+1,p.dt.w.t)}};return chkA({...p,dt,tw:(p.tw||0)+1});}),[chkA]);

  const startDeck=(indices)=>{const deck=indices.map(i=>({...state.chars[i],di:i})).sort(()=>Math.random()-0.5);setCtx({deck,cur:0,res:{t:0,k:0,r:0,u:0,sc:0}});setPage("study");};
  const startBook=(b)=>{const idxs=CHARS.map((c,i)=>c.b===b?i:-1).filter(i=>i>=0);startDeck(idxs.slice(0,20));};
  const startLesson=(b,l)=>{const idxs=CHARS.map((c,i)=>(c.b===b&&c.l===l)?i:-1).filter(i=>i>=0);startDeck(idxs);};
  const startAll=()=>{const idxs=CHARS.map((_,i)=>i);startDeck(idxs.slice(0,25));};
  const startReview=()=>{const idxs=state.chars.map((c,i)=>c.st!=="known"?i:-1).filter(i=>i>=0).sort((a,b)=>state.chars[a].fam-state.chars[b].fam).slice(0,20);if(idxs.length)startDeck(idxs);};

  const P={state,setState,page,setPage,ctx,setCtx,cnt,cntFor,upd,rP,rW,startBook,startLesson,startAll,startReview,toast,ACHS,overrides,setOverrides};

  return(<div style={S.wrap}><div style={S.app}>
    {toast&&<div style={S.toast}><span style={{fontSize:26}}>{toast.e}</span><div><div style={{fontWeight:700,fontSize:13}}>成就解锁！</div><div style={{fontSize:12,opacity:0.8}}>{toast.n}</div></div></div>}
    {page==="home"&&<HomePage P={P}/>}
    {page==="books"&&<BooksPage P={P}/>}
    {page==="lessons"&&<LessonsPage P={P}/>}
    {page==="study"&&<StudyPage P={P}/>}
    {page==="verify"&&<VerifyPage P={P}/>}
    {page==="write"&&<WritePage P={P}/>}
    {page==="pinyin"&&<PinyinPage P={P}/>}
    {page==="results"&&<ResultsPage P={P}/>}
    {page==="report"&&<ReportPage P={P}/>}
    {page==="ach"&&<AchPage P={P}/>}
    {page==="set"&&<SetPage P={P}/>}
    {page==="edit"&&<EditPage P={P}/>}
  </div></div>);
}

// ─── Home ───────────────────────────────────────────────────────
function HomePage({P}){
  const{state,cnt,startAll,startReview,setPage}=P;
  const dt=state.dt;const ad=dt.r.d>=dt.r.t&&dt.p.d>=dt.p.t&&dt.w.d>=dt.w.t;
  const rc=state.chars.filter(c=>c.st!=="known").length;
  return(<div style={S.pg}>
    <div style={{textAlign:"center",padding:"16px 0 4px"}}><div style={S.logo}>识字乐园</div><div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>第一至五册 · {CHARS.length}个汉字</div></div>
    <div style={S.sr}>
      <SB l="已认识" v={cnt("known")} c="#4ade80" e="✅"/>
      <SB l="待复习" v={cnt("review")} c="#fbbf24" e="📖"/>
      <SB l="未认识" v={cnt("unknown")} c="#f87171" e="❓"/>
    </div>
    <div style={S.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={S.ct}>今日任务</span><span style={{fontSize:12,color:"#f97316"}}>🔥{state.streak}天</span></div>
      <TB l="认字" d={dt.r.d} t={dt.r.t} c="#4ade80"/><TB l="拼音" d={dt.p.d} t={dt.p.t} c="#60a5fa"/><TB l="写字" d={dt.w.d} t={dt.w.t} c="#c084fc"/>
      {ad&&<div style={{textAlign:"center",marginTop:4,fontSize:12,color:"#4ade80",fontWeight:600}}>🎉 任务完成！</div>}</div>
    <button style={{...S.btn,background:"linear-gradient(135deg,#60a5fa,#818cf8)"}} onClick={()=>setPage("books")}>📚 选择课本</button>
    <button style={{...S.btn,background:"linear-gradient(135deg,#a78bfa,#c084fc)"}} onClick={startAll}>🎲 全部混合（随机25字）</button>
    {rc>0&&<button style={{...S.btn,background:"linear-gradient(135deg,#fb923c,#f97316)"}} onClick={startReview}>📝 复习错字 ({rc})</button>}
    <div style={S.bnav}><NB e="📊" l="报告" o={()=>setPage("report")}/><NB e="🏅" l="成就" o={()=>setPage("ach")}/><NB e="⚙️" l="设置" o={()=>setPage("set")}/></div>
  </div>);
}
function SB({l,v,c,e}){return(<div style={{...S.bub,borderColor:c}}><span style={{fontSize:16}}>{e}</span><span style={{fontSize:20,fontWeight:800,color:c}}>{v}</span><span style={{fontSize:10,color:"#64748b"}}>{l}</span></div>);}
function TB({l,d,t,c}){return(<div style={{marginBottom:4}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:1}}><span>{l}</span><span>{d}/{t}</span></div><div style={{height:5,borderRadius:3,background:"#e2e8f0",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,d/t*100)}%`,background:c,borderRadius:3,transition:"width 0.4s"}}/></div></div>);}
function NB({e,l,o}){return(<button onClick={o} style={S.nbtn}><span style={{fontSize:18}}>{e}</span><span style={{fontSize:9}}>{l}</span></button>);}
function Bk({o}){return <button onClick={o} style={S.bk}>← 返回</button>;}

// ─── Books ──────────────────────────────────────────────────────
function BookCard({b, P}) {
  const emojis = ["📕","📗","📘","📙","📓"];
  const bookData = getBookData(b, P.overrides);
  // Count total from source data (matches what's actually in the lessons)
  let total = 0;
  for (const l of Object.keys(bookData.lessons)) {
    total += bookData.lessons[l].chars.length;
  }
  const idxs = CHARS.reduce((acc, c, i) => { if (c.b === b) acc.push(i); return acc; }, []);
  const known = P.state.chars.filter((c, i) => idxs.includes(i) && c.st === "known").length;
  const pct = total > 0 ? (known / total * 100) : 0;
  return (
    <button onClick={() => { P.setCtx({selBook: b}); P.setPage("lessons"); }} style={S.lc}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:24}}>{emojis[b - 1]}</span>
        <div>
          <div style={{fontWeight:700,fontSize:14}}>{bookData.name}</div>
          <div style={{fontSize:11,color:"#94a3b8"}}>{total}字 · 已认识{known}</div>
          <div style={{height:4,width:80,borderRadius:2,background:"#e2e8f0",marginTop:3}}>
            <div style={{height:"100%",width: pct + "%",background:"#4ade80",borderRadius:2}} />
          </div>
        </div>
      </div>
      <span style={{fontSize:16,color:"#94a3b8"}}>{"›"}</span>
    </button>
  );
}

function BooksPage({P}) {
  return (
    <div style={S.pg}>
      <Bk o={() => P.setPage("home")} />
      <div style={S.pt}>选择课本</div>
      {BOOKS.map(b => <BookCard key={b} b={b} P={P} />)}
    </div>
  );
}

// ─── Lessons ────────────────────────────────────────────────────
function LessonCard({b, l, info, P}) {
  // Count characters directly from the lesson data (matches what user typed)
  const total = info.chars.length;
  const idxs = CHARS.reduce((acc, c, i) => { if (c.b === b && c.l === l) acc.push(i); return acc; }, []);
  const known = P.state.chars.filter((c, i) => idxs.includes(i) && c.st === "known").length;
  return (
    <button onClick={() => P.startLesson(b, l)} style={S.lc}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:28,height:28,borderRadius:14,background:"#e0e7ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#6366f1"}}>{l}</span>
        <div>
          <div style={{fontWeight:600,fontSize:13}}>{"第" + l + "课 " + info.name}</div>
          <div style={{fontSize:11,color:"#94a3b8"}}>{total + "字 · " + known + "/" + total}</div>
        </div>
      </div>
      <span style={{fontSize:15,color:"#94a3b8"}}>{"›"}</span>
    </button>
  );
}

function LessonsPage({P}) {
  const b = P.ctx && P.ctx.selBook ? P.ctx.selBook : 1;
  const bookData = getBookData(b, P.overrides);
  const lessonNums = Object.keys(bookData.lessons).map(Number).sort((a, c) => a - c);
  return (
    <div style={S.pg}>
      <Bk o={() => P.setPage("books")} />
      <div style={S.pt}>{bookData.name}</div>
      <button onClick={() => P.startBook(b)} style={{...S.lc,background:"linear-gradient(135deg,rgba(96,165,250,0.12),rgba(129,140,248,0.12))",border:"2px solid #818cf8"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22}}>{"🎲"}</span>
          <div>
            <div style={{fontWeight:700,fontSize:13}}>全册混合</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>随机20字</div>
          </div>
        </div>
        <span style={{fontSize:16,color:"#818cf8"}}>{"›"}</span>
      </button>
      <button onClick={() => { P.setCtx({selBook: b}); P.setPage("edit"); }} style={{...S.lc,background:"linear-gradient(135deg,rgba(251,146,60,0.12),rgba(249,115,22,0.12))",border:"2px solid #fb923c"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22}}>{"✏️"}</span>
          <div>
            <div style={{fontWeight:700,fontSize:13}}>编辑课文</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>手动修改课程和汉字</div>
          </div>
        </div>
        <span style={{fontSize:16,color:"#fb923c"}}>{"›"}</span>
      </button>
      {lessonNums.map(l => <LessonCard key={l} b={b} l={l} info={bookData.lessons[l]} P={P} />)}
    </div>
  );
}

// ─── Study ──────────────────────────────────────────────────────
function StudyPage({P}){
  const{ctx,setCtx,upd,state,setState,setPage}=P;
  const[fb,setFb]=useState(null);
  if(!ctx||!ctx.deck||ctx.cur>=ctx.deck.length){setPage("results");return null;}
  const cs=ctx.deck[ctx.cur];const cd=CHARS[cs.di];
  const ans=(res)=>{upd(cs.di,res);const r={...ctx.res};r.t++;if(res==="known"){r.k++;r.sc+=2;}else if(res==="review"){r.r++;r.sc+=1;}else r.u++;
    setFb(res==="known"?{t:"太棒了！👏",c:"#4ade80"}:res==="review"?{t:"再练练～",c:"#fbbf24"}:{t:"没关系！💪",c:"#f87171"});
    setTimeout(()=>{setFb(null);setCtx({...ctx,res:r,cur:ctx.cur+1});},450);};
  return(<div style={S.pg}><Bk o={()=>setPage("home")}/>
    <div style={{textAlign:"center",fontSize:12,color:"#94a3b8"}}>{ctx.cur+1}/{ctx.deck.length}</div>
    <div style={{textAlign:"center"}}><div style={S.bc}>{cd.c}</div>
      <button onClick={()=>speak(cd.c)} style={S.sp}>🔊 听读音</button>
      {state.pm&&<div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>拼音：{cd.p} · {DATA[cd.b].name}第{cd.l}课</div>}
      {cd.w.length>0&&<div style={{fontSize:13,color:"#60a5fa",marginTop:2}}>组词：{cd.w.join("、")}</div>}</div>
    {fb&&<div style={{textAlign:"center",fontSize:16,fontWeight:700,color:fb.c,margin:"2px 0"}}>{fb.t}</div>}
    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
      <button style={{...S.ab,background:"#dcfce7",color:"#15803d"}} onClick={()=>ans("known")}>😊 认识</button>
      <button style={{...S.ab,background:"#fef9c3",color:"#a16207"}} onClick={()=>ans("review")}>🤔 不确定</button>
      <button style={{...S.ab,background:"#fee2e2",color:"#b91c1c"}} onClick={()=>ans("unknown")}>😕 不认识</button></div>
    <div style={{display:"flex",gap:5,marginTop:6}}>
      <button style={S.mb} onClick={()=>{setCtx({...ctx,_v:cs});setPage("verify");}}>🎯 验证</button>
      <button style={S.mb} onClick={()=>{setCtx({...ctx,_w:cs});setPage("write");}}>✍️ 写字</button>
      <button style={S.mb} onClick={()=>{setCtx({...ctx,_p:cs});setPage("pinyin");}}>📝 拼音</button></div>
  </div>);
}

// ─── Verify ─────────────────────────────────────────────────────
function VerifyOption({o, cd, done, sel, pick}) {
  var bg = "#f1f5f9";
  if (done && o === cd.p) bg = "#dcfce7";
  if (done && o !== cd.p && o === sel) bg = "#fee2e2";
  return <button onClick={() => pick(o)} style={{...S.ab,background:bg,fontFamily:"monospace",letterSpacing:2}}>{o}</button>;
}

function VerifyPage({P}){const cs=P.ctx?._v;const cd=cs?CHARS[cs.di]:null;const[opts]=useState(()=>cd?genDist(cd.p,cd):[]);const[done,setDone]=useState(false);const[sel,setSel]=useState(null);
  if(!cd){P.setPage("study");return null;}
  const pick=o=>{if(done)return;setSel(o);setDone(true);P.upd(cs.di,o===cd.p?"known":"unknown");setTimeout(()=>P.setPage("study"),900);};
  return(<div style={S.pg}><div style={S.pt}>验证</div><div style={{textAlign:"center"}}><div style={S.bc}>{cd.c}</div><div style={{fontSize:13,color:"#64748b",marginTop:3}}>选正确拼音</div></div>
    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>{opts.map(o => <VerifyOption key={o} o={o} cd={cd} done={done} sel={sel} pick={pick} />)}</div>
    {done&&<div style={{textAlign:"center",marginTop:8,fontSize:15,fontWeight:700,color:sel===cd.p?"#4ade80":"#f87171"}}>{sel===cd.p?"答对啦！🎉":"正确："+cd.p}</div>}</div>);
}

// ─── Write ──────────────────────────────────────────────────────
function WritePage({P}){const cs=P.ctx?._w;const cd=cs?CHARS[cs.di]:null;const ref=useRef(null);const[dr,setDr]=useState(false);const[st,setSt]=useState([]);const[fb,setFb]=useState("");
  if(!cd){P.setPage("study");return null;}
  const gp=e=>{const r=ref.current.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};};
  useEffect(()=>{const c=ref.current;if(!c)return;const x=c.getContext("2d");x.clearRect(0,0,220,220);x.font="160px serif";x.fillStyle="rgba(0,0,0,0.06)";x.textAlign="center";x.textBaseline="middle";x.fillText(cd.c,110,115);x.strokeStyle="rgba(0,0,0,0.06)";x.setLineDash([4,4]);x.beginPath();x.moveTo(110,0);x.lineTo(110,220);x.moveTo(0,110);x.lineTo(220,110);x.stroke();x.setLineDash([]);x.strokeStyle="#1e293b";x.lineWidth=3.5;x.lineCap="round";x.lineJoin="round";for(const s of st){if(s.length<2)continue;x.beginPath();x.moveTo(s[0].x,s[0].y);for(let i=1;i<s.length;i++)x.lineTo(s[i].x,s[i].y);x.stroke();}},[st,cd]);
  const fin=()=>{const all=st.flat();if(all.length<10){setFb("写得太少了～");return;}setFb("写得不错！👏");P.rW();};
  return(<div style={S.pg}><Bk o={()=>P.setPage("study")}/><div style={S.pt}>写「{cd.c}」</div>
    <button onClick={()=>speak(cd.c)} style={{...S.sp,margin:"0 auto 4px",display:"flex"}}>🔊</button>
    <div style={{display:"flex",justifyContent:"center"}}><canvas ref={ref} width={220} height={220}
      onMouseDown={e=>{e.preventDefault();setDr(true);setSt(p=>[...p,[gp(e)]]);}} onMouseMove={e=>{if(!dr)return;e.preventDefault();setSt(p=>{const n=[...p];n[n.length-1]=[...n[n.length-1],gp(e)];return n;});}} onMouseUp={()=>setDr(false)} onMouseLeave={()=>setDr(false)}
      onTouchStart={e=>{e.preventDefault();setDr(true);setSt(p=>[...p,[gp(e)]]);}} onTouchMove={e=>{if(!dr)return;e.preventDefault();setSt(p=>{const n=[...p];n[n.length-1]=[...n[n.length-1],gp(e)];return n;});}} onTouchEnd={()=>setDr(false)}
      style={{border:"2px solid #e2e8f0",borderRadius:10,background:"#fff",touchAction:"none",cursor:"crosshair"}}/></div>
    {fb&&<div style={{textAlign:"center",marginTop:4,fontSize:13,fontWeight:600,color:fb.includes("不错")?"#4ade80":"#fb923c"}}>{fb}</div>}
    <div style={{display:"flex",gap:6,marginTop:4}}><button style={{...S.btn,flex:1,background:"#fee2e2",color:"#b91c1c"}} onClick={()=>{setSt([]);setFb("");}}>清除</button><button style={{...S.btn,flex:1,background:"#dcfce7",color:"#15803d"}} onClick={fin}>完成</button></div></div>);
}

// ─── Pinyin ─────────────────────────────────────────────────────
function PinyinPage({P}){const cs=P.ctx?._p;const cd=cs?CHARS[cs.di]:null;const[iv,sI]=useState("");const[fv,sF]=useState("");const[fb,sFb]=useState(null);const[h,sH]=useState(0);const[dn,sD]=useState(false);
  if(!cd){P.setPage("study");return null;}
  const sub=()=>{const sim=pySim(iv+fv,cd.p);P.rP();if(sim>=0.85){sFb({t:"答对啦！🎉",c:"#4ade80"});P.upd(cs.di,"known");}else if(sim>=0.55){sFb({t:"很接近！",c:"#fbbf24"});sH(x=>x+1);P.upd(cs.di,"review");}else{sFb({t:"再试试",c:"#f87171"});sH(x=>x+1);P.upd(cs.di,"unknown");}sD(true);};
  return(<div style={S.pg}><Bk o={()=>P.setPage("study")}/><div style={S.pt}>拼音练习</div>
    <div style={{textAlign:"center"}}><div style={{fontSize:56,fontWeight:800}}>{cd.c}</div><button onClick={()=>speak(cd.c)} style={S.sp}>🔊</button></div>
    <div style={S.card}><div style={{fontSize:13,fontWeight:600,marginBottom:6,textAlign:"center"}}>写"{cd.c}"的拼音</div>
      <div style={{display:"flex",gap:6,justifyContent:"center",alignItems:"flex-end"}}>
        <div><div style={{fontSize:10,color:"#64748b",textAlign:"center"}}>声母</div><input value={iv} onChange={e=>sI(e.target.value.toLowerCase().replace(/[^a-z]/g,""))} style={S.pi} maxLength={2} disabled={dn}/></div>
        <span style={{fontSize:18,color:"#94a3b8",paddingBottom:3}}>+</span>
        <div><div style={{fontSize:10,color:"#64748b",textAlign:"center"}}>韵母</div><input value={fv} onChange={e=>sF(e.target.value.toLowerCase().replace(/[^a-zv]/g,""))} style={{...S.pi,width:80}} maxLength={5} disabled={dn}/></div></div>
      {h>=1&&<div style={{textAlign:"center",marginTop:4,fontSize:11,color:"#fb923c"}}>声母：{cd.i||"无"}</div>}
      {h>=2&&<div style={{textAlign:"center",fontSize:11,color:"#60a5fa"}}>韵母：{cd.f}</div>}</div>
    {fb&&<div style={{textAlign:"center",fontSize:15,fontWeight:700,color:fb.c,marginTop:4}}>{fb.t}</div>}
    {dn&&<div style={{textAlign:"center",fontSize:11,color:"#94a3b8"}}>正确：{cd.p}</div>}
    <div style={{display:"flex",gap:6,marginTop:8}}>{!dn?<button style={{...S.btn,flex:1,background:"linear-gradient(135deg,#60a5fa,#818cf8)"}} onClick={sub}>提交</button>
      :<><button style={{...S.btn,flex:1,background:"#e2e8f0",color:"#475569"}} onClick={()=>{sI("");sF("");sFb(null);sD(false);}}>再试</button><button style={{...S.btn,flex:1,background:"linear-gradient(135deg,#60a5fa,#818cf8)"}} onClick={()=>P.setPage("study")}>继续</button></>}</div></div>);
}

// ─── Results ────────────────────────────────────────────────────
function ResultsPage({P}){const r=P.ctx?.res||{t:0,k:0,r:0,u:0,sc:0};const pct=r.t>0?Math.round(r.k/r.t*100):0;const st=pct>90?3:pct>70?2:pct>50?1:0;
  return(<div style={S.pg}><div style={S.pt}>本轮结果</div><div style={{textAlign:"center",fontSize:28,margin:"4px 0"}}>{sS(st)}</div>
    <div style={{textAlign:"center",fontSize:13,color:"#475569",fontWeight:600,marginBottom:8}}>{st===3?"太棒了！🌟":st>=2?"不错！💪":st>=1?"加油！😊":"继续努力！🤗"}</div>
    <div style={S.card}><RR l="总题数" v={r.t}/><RR l="认识" v={r.k} c="#4ade80"/><RR l="不确定" v={r.r} c="#fbbf24"/><RR l="不认识" v={r.u} c="#f87171"/><RR l="得分" v={r.sc} c="#818cf8"/><RR l="正确率" v={`${pct}%`}/></div>
    <button style={{...S.btn,background:"linear-gradient(135deg,#60a5fa,#818cf8)",marginTop:8}} onClick={()=>P.setPage("home")}>返回首页</button></div>);
}
function RR({l,v,c}){return <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #f1f5f9"}}><span style={{color:"#64748b"}}>{l}</span><span style={{fontWeight:700,color:c||"#1e293b"}}>{v}</span></div>;}

// ─── Report ─────────────────────────────────────────────────────
function BookStatRow({b, state}) {
  var total = 0, known = 0;
  for (var i = 0; i < CHARS.length; i++) {
    if (CHARS[i].b === b) { total++; if (state.chars[i].st === "known") known++; }
  }
  return <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:12}}>{DATA[b].name}</span><span style={{fontSize:12,color:"#4ade80"}}>{known}/{total}</span></div>;
}

function WrongCharRow({c}) {
  return <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid #f1f5f9"}}><span style={{fontSize:16}}>{CHARS[c.idx].c}</span><span style={{fontSize:11,color:"#94a3b8"}}>{CHARS[c.idx].p}</span><span style={{color:"#f87171",fontSize:11}}>{"错" + c.wc + "次"}</span></div>;
}

function ReportPage({P}) {
  var cnt = P.cnt;
  var state = P.state;
  var wr = state.chars.filter(function(c){ return c.wc > 0; }).sort(function(a,b){ return b.wc - a.wc; }).slice(0, 10);
  return (
    <div style={S.pg}>
      <Bk o={() => P.setPage("home")} />
      <div style={S.pt}>学习报告</div>
      <div style={S.card}>
        <div style={S.ct}>总览</div>
        <RR l="总字数" v={CHARS.length} />
        <RR l="已认识" v={cnt("known")} c="#4ade80" />
        <RR l="待复习" v={cnt("review")} c="#fbbf24" />
        <RR l="未认识" v={cnt("unknown")} c="#f87171" />
        <RR l="总得分" v={state.ts} c="#818cf8" />
      </div>
      <div style={S.card}>
        <div style={S.ct}>各册进度</div>
        {BOOKS.map(b => <BookStatRow key={b} b={b} state={state} />)}
      </div>
      {wr.length > 0 && <div style={S.card}><div style={S.ct}>常错字</div>{wr.map((c, i) => <WrongCharRow key={i} c={c} />)}</div>}
    </div>
  );
}

// ─── Achievements ───────────────────────────────────────────────
function AchItem({a, unlocked}) {
  return (
    <div style={{...S.card, opacity: unlocked ? 1 : 0.35, display:"flex", alignItems:"center", gap:8, marginBottom:6}}>
      <span style={{fontSize:24}}>{a.e}</span>
      <div>
        <div style={{fontWeight:700,fontSize:12}}>{a.n}</div>
        <div style={{fontSize:11,color:"#94a3b8"}}>{a.d}</div>
      </div>
      {unlocked && <span style={{marginLeft:"auto",color:"#4ade80",fontWeight:700}}>{"✓"}</span>}
    </div>
  );
}

function AchPage({P}) {
  return (
    <div style={S.pg}>
      <Bk o={() => P.setPage("home")} />
      <div style={S.pt}>成就</div>
      {P.ACHS.map(a => <AchItem key={a.id} a={a} unlocked={P.state.ua.includes(a.id)} />)}
    </div>
  );
}

// ─── Settings ───────────────────────────────────────────────────
function SetPage({P}){return(<div style={S.pg}><Bk o={()=>P.setPage("home")}/><div style={S.pt}>设置</div>
  <div style={S.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,fontSize:13}}>家长模式</span>
    <button onClick={()=>P.setState(s=>({...s,pm:!s.pm}))} style={{...S.tg,background:P.state.pm?"#60a5fa":"#cbd5e1"}}><div style={{...S.td,transform:P.state.pm?"translateX(22px)":"translateX(2px)"}}/></button></div>
    <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{P.state.pm?"显示拼音和课号":"孩子模式"}</div></div>
  <div style={S.card}><button onClick={()=>{if(confirm("重置全部数据？")){P.setState(mkState());P.setPage("home");}}} style={{...S.btn,background:"#fee2e2",color:"#b91c1c",fontSize:12}}>重置数据</button></div>
  <div style={S.card}><div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}>识字乐园 · 第一至五册<br/>{CHARS.length}个汉字 · {BOOKS.length}本书</div></div></div>);}

// ─── Edit Page ──────────────────────────────────────────────────
function EditPage({P}) {
  const b = P.ctx && P.ctx.selBook ? P.ctx.selBook : 1;
  const currentData = getBookData(b, P.overrides);

  // Build working draft from current data
  const [bookName, setBookName] = useState(currentData.name);
  const [lessons, setLessons] = useState(() => {
    const result = {};
    for (const l of Object.keys(currentData.lessons)) {
      result[l] = {
        name: currentData.lessons[l].name,
        charsText: currentData.lessons[l].chars.map(c => c[0]).join(""),
      };
    }
    return result;
  });
  const [selectedLesson, setSelectedLesson] = useState(1);

  const lessonNums = Object.keys(lessons).map(Number).sort((a,c) => a-c);

  const updateLessonName = (l, name) => {
    setLessons(prev => ({...prev, [l]: {...prev[l], name}}));
  };
  const updateLessonChars = (l, charsText) => {
    setLessons(prev => ({...prev, [l]: {...prev[l], charsText}}));
  };
  const addLesson = () => {
    const next = lessonNums.length ? Math.max(...lessonNums) + 1 : 1;
    setLessons(prev => ({...prev, [next]: {name: "新课", charsText: ""}}));
    setSelectedLesson(next);
  };
  const deleteLesson = (l) => {
    if (!confirm("删除第 " + l + " 课？")) return;
    setLessons(prev => {
      const next = {...prev};
      delete next[l];
      return next;
    });
  };

  const save = () => {
    // Convert back to DATA format
    const newLessons = {};
    for (const l of Object.keys(lessons)) {
      const charsText = lessons[l].charsText.replace(/\s/g, "");
      const chars = [];
      for (const ch of charsText) {
        // Lookup pinyin from known dictionary, default to blank
        const known = CHAR_PINYIN[ch];
        if (known) {
          chars.push([ch, known.p, ch+"子", "学"+ch, known.i, known.f]);
        } else {
          chars.push([ch, "?", ch, ch, "", ""]);
        }
      }
      newLessons[l] = { name: lessons[l].name, chars };
    }
    const newBookData = { name: bookName, lessons: newLessons };
    const newOverrides = {...(P.overrides || {}), [b]: newBookData};
    P.setOverrides(newOverrides);
    alert("已保存！");
    P.setPage("lessons");
  };

  const reset = () => {
    if (!confirm("恢复原始课程数据？")) return;
    const newOverrides = {...(P.overrides || {})};
    delete newOverrides[b];
    P.setOverrides(Object.keys(newOverrides).length ? newOverrides : null);
    P.setPage("lessons");
  };

  const curL = lessons[selectedLesson];

  return (
    <div style={S.pg}>
      <Bk o={() => P.setPage("lessons")} />
      <div style={S.pt}>编辑课本</div>

      <div style={S.card}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>课本名称</div>
        <input value={bookName} onChange={e => setBookName(e.target.value)}
          style={{width:"100%",padding:8,borderRadius:8,border:"2px solid #e2e8f0",fontSize:14,outline:"none",boxSizing:"border-box"}} />
      </div>

      <div style={S.card}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>选择课程</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {lessonNums.map(l => (
            <button key={l} onClick={() => setSelectedLesson(l)}
              style={{padding:"5px 10px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,
                background: selectedLesson === l ? "#60a5fa" : "#e2e8f0",
                color: selectedLesson === l ? "#fff" : "#475569", cursor:"pointer"}}>
              第{l}课
            </button>
          ))}
          <button onClick={addLesson} style={{padding:"5px 10px",borderRadius:8,border:"2px dashed #94a3b8",fontSize:12,fontWeight:600,background:"transparent",color:"#64748b",cursor:"pointer"}}>+ 新增</button>
        </div>
      </div>

      {curL && (
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:13,fontWeight:700}}>{"第 " + selectedLesson + " 课"}</span>
            <button onClick={() => deleteLesson(selectedLesson)} style={{padding:"3px 8px",borderRadius:6,border:"none",background:"#fee2e2",color:"#b91c1c",fontSize:11,cursor:"pointer"}}>删除本课</button>
          </div>

          <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>课文标题</div>
          <input value={curL.name} onChange={e => updateLessonName(selectedLesson, e.target.value)}
            style={{width:"100%",padding:8,borderRadius:8,border:"2px solid #e2e8f0",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:8}} />

          <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>汉字（直接输入，不需空格）</div>
          <textarea value={curL.charsText} onChange={e => updateLessonChars(selectedLesson, e.target.value)}
            placeholder="例：超市购单品裙挑选..."
            style={{width:"100%",padding:8,borderRadius:8,border:"2px solid #e2e8f0",fontSize:18,outline:"none",boxSizing:"border-box",minHeight:80,fontFamily:"inherit",resize:"vertical"}} />
          <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>{"已输入 " + [...curL.charsText.replace(/\s/g,"")].length + " 个字"}</div>
        </div>
      )}

      <div style={S.card}>
        <div style={{fontSize:11,color:"#64748b",lineHeight:1.5,marginBottom:6}}>
          💡 拼音会自动识别（从已有字库）。不认识的字会标记为 ?，可以先保存后稍后补充。
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={save} style={{...S.btn,flex:1,background:"linear-gradient(135deg,#4ade80,#22c55e)",fontSize:14}}>💾 保存</button>
          <button onClick={reset} style={{...S.btn,flex:1,background:"#fee2e2",color:"#b91c1c",fontSize:13}}>恢复原版</button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
const S={
  wrap:{minHeight:"100vh",background:"linear-gradient(160deg,#fef3c7 0%,#fce7f3 30%,#e0e7ff 60%,#d1fae5 100%)",display:"flex",justifyContent:"center",padding:8,fontFamily:"'Noto Sans SC','PingFang SC','Microsoft YaHei',-apple-system,sans-serif"},
  app:{width:"100%",maxWidth:400,position:"relative"},
  pg:{display:"flex",flexDirection:"column",gap:7,paddingBottom:16},
  logo:{fontSize:26,fontWeight:900,background:"linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:3},
  sr:{display:"flex",gap:6},
  bub:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0,padding:"6px 3px",borderRadius:10,background:"rgba(255,255,255,0.7)",border:"2px solid"},
  card:{background:"rgba(255,255,255,0.75)",backdropFilter:"blur(8px)",borderRadius:10,padding:10,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"},
  ct:{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:4},
  btn:{width:"100%",padding:10,borderRadius:10,border:"none",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"},
  ab:{width:"100%",padding:10,borderRadius:10,border:"none",fontSize:14,fontWeight:700,cursor:"pointer"},
  mb:{flex:1,padding:6,borderRadius:8,border:"none",fontSize:11,fontWeight:600,background:"rgba(255,255,255,0.7)",cursor:"pointer",color:"#475569"},
  bc:{fontSize:90,fontWeight:900,lineHeight:1.1,color:"#1e293b"},
  sp:{display:"inline-flex",alignItems:"center",gap:2,padding:"4px 10px",borderRadius:14,border:"none",background:"#dcfce7",color:"#15803d",fontSize:11,fontWeight:600,cursor:"pointer"},
  bnav:{display:"flex",gap:4,justifyContent:"center",marginTop:3},
  nbtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:0,padding:"6px 14px",borderRadius:8,border:"none",background:"rgba(255,255,255,0.6)",cursor:"pointer",color:"#475569",fontWeight:600},
  lc:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:10,borderRadius:10,border:"none",background:"rgba(255,255,255,0.7)",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.03)",marginBottom:5,textAlign:"left"},
  bk:{alignSelf:"flex-start",padding:"3px 8px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.5)",fontSize:11,color:"#64748b",cursor:"pointer",fontWeight:600},
  pt:{fontSize:18,fontWeight:800,textAlign:"center",color:"#1e293b",margin:"1px 0 3px"},
  pi:{width:45,padding:6,borderRadius:7,border:"2px solid #e2e8f0",fontSize:16,textAlign:"center",fontFamily:"monospace",outline:"none",background:"#fff"},
  tg:{width:46,height:24,borderRadius:12,border:"none",cursor:"pointer",position:"relative",transition:"background 0.3s"},
  td:{width:20,height:20,borderRadius:10,background:"#fff",position:"absolute",top:2,transition:"transform 0.3s",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"},
  toast:{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",borderRadius:10,padding:"6px 12px",display:"flex",alignItems:"center",gap:6,boxShadow:"0 6px 24px rgba(0,0,0,0.12)",zIndex:1000,maxWidth:280},
};
