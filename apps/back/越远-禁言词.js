import { segment } from 'oicq'
//改编自文字狱，有多级屏蔽词，直接安装就好了，发送禁言词帮助获取帮助
//1.2更新于2022.8.6，删除冗余代码，增加状态和禁言时间
export const rule = {
  // 文本监测
  Shutdown: {
    reg: '',
    priority: 0,
    describe: "文本监测",
    // 私有指令，不会自动生成到 #帮助 视图中
    isPrivate: true,
  }
}
let modle = 1;//监测模式，1：全局模式，0：定向监测某群模式
let arr = [];//监测群号名单
//以下为预置禁言词语
let ShutdownList = ["睡觉了", "色图", "智障", "傻逼", "涩图", "垃圾",
  "行不行", "搬运", "在哪", "什么群", "手把手", "怎么配置环境", "怎么找不到", "到底", "能不能", "放哪", '打起来']; //文本消息中含有的关键词，记2分，出现就禁言
let txts1 = [""];//记一分，把之前的二字词语拆成两个
let txts_ = ["国家队", "角色", "雷国"];//记负一分，这里添加加一些词语来平衡，防止误封。
let txts0 = ['不'];//使得记分变负分，这个里面添加使得句子反义的词。
let white = [];//免死金牌(大嘘)
let time = 1;//默认禁言分钟数
let Shutdownstatus = "开启";//禁言状态，既是否禁言
let log = [];//日志
//禁言设置程序

export async function Shutdown(e) {
  if (!e.msg) { return; }
  if (!e.isGroup) { return; }
  //面板修改代码----------------------------------------------------------------------------------------------------
  if (e.msg.includes("禁言")) {
    if (e.msg.includes("禁言词帮助") || e.msg.includes("禁言帮助")) {//如果消息内容是删除禁言词列表指令
      e.reply("版本号：1.2正式2022.8.7\nYunzai-Bot相关问题答疑群：719834329\n禁言词规则：出现禁言词加相应分数，出现补偿词减1分\n禁言时间：" + time.toString() + "\n禁言状态：" + Shutdownstatus + "\n指令1：#设置|添加|删除|移除禁言词\n指令2：#设置|添加|移除|删除|补偿词\n指令3：#设置禁言时间5分钟\n指令4：#设置禁言状态开启|关闭\n指令5：#禁言记录|日志\n指令6：#禁言词列表")
      return true;//拦截指令
    }
    if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {//如果是群主或管理员
      //禁言日志---------------------------------------------------------
      if (e.msg.includes("#禁言记录") || e.msg.includes("#禁言日志")) {//如果消息内容是添加禁言词指令
        if (log.length == 0) {//如果关机列表为空
          e.reply("当前没有被禁言的憨憨哦！");//回复消息
          return true;//拦截指令
        } else {
          e.reply(log);
          return true;//拦截指令
        }
      }
      //禁言词列表-------------------------------------------------------
      else if (e.msg.includes("#禁言词列表")) {//如果消息内容是添加禁言词指令
        e.reply("2分禁言词列表:\n" + ShutdownList + "\n1分禁言词列表:\n" + txts1 + `\n补偿词列表:\n` + txts_);
        return true;//拦截指令
      }
      //设置禁言时间-----------------------------------------------------
      else if (e.msg.includes("#设置禁言时间")) {//如果消息内容是添加禁言词指令
        let Shutdowntime = e.msg.replace("#设置禁言时间", '')
        Shutdowntime = Shutdowntime.replace("分钟", '')
        let Shutdowntime1 = Number(Shutdowntime)
        if (!isNaN(Shutdowntime1)) {
          time = Shutdowntime1
          e.reply("设置禁言时间" + Shutdowntime + "分钟成功!")
          return true;//拦截指令
        } else {
          e.reply("设置禁时间失败，请按照“#设置禁言时间5分钟”格式输入")
          return true;//拦截指令
        }
      }
      //设置禁言状态-------------------------------------------------------
      else if (e.msg.includes("#设置禁言状态")) {//如果消息内容是添加禁言词指令
        let Shutdownword = e.msg.replace("#设置禁言状态", '')
        if (Shutdownword == "开启" || Shutdownword == "关闭") {
          e.reply("设置禁状态" + Shutdownword + "成功!")
          Shutdownstatus = Shutdownword
          return true;//拦截指令
        } else {
          e.reply("设置禁状态失败，请按照“#设置禁言状态开启|关闭”格式输入")
          return true;//拦截指令
        }
      }
      //设置和删除禁言词部分-------------------------------------------------------
      else if (e.msg.includes("#添加禁言词") || e.msg.includes("#设置禁言词")) {//如果消息内容是添加禁言词指令
        let Shutdownword = e.msg.replace("#设置禁言词", '')
        Shutdownword = Shutdownword.replace("#添加禁言词", '')
        ShutdownList.push(Shutdownword);//添加到到禁言词列表
        e.reply("设置禁言词成功!")
        return true;//拦截指令
      }
      else if (e.msg.includes("#删除禁言词") || e.msg.includes("#移除禁言词")) {//如果消息内容是删除禁言词指令
        if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {//如果是群主或管理员
          let Shutdownword = e.msg.replace("#删除禁言词", '')
          Shutdownword = Shutdownword.replace("#移除禁言词", '')
          ShutdownList.splice(ShutdownList.indexOf(Shutdownword), 1);//从禁言词列表中删除
          e.reply("删除禁言词成功!")
          return true;//拦截指令
        }
      }
      //设置和删除补偿词部分-------------------------------------------------------
      else if (e.msg.includes("#设置补偿词") || e.msg.includes("#添加补偿词")) {//如果消息内容是添加补偿词指令
        let Shutdownword = e.msg.replace("#设置补偿词", '')
        Shutdownword = Shutdownword.replace("#添加补偿词", '')
        txts_.push(Shutdownword);//添加到到补偿词列表
        e.reply("设置补偿词成功!")
        return true;//拦截指令
      }
      else if (e.msg.includes("#删除补偿词") || e.msg.includes("#移除补偿词")) {//如果消息内容是删除补偿词指令
        let Shutdownword = e.msg.replace("#设置补偿词", '')
        Shutdownword = Shutdownword.replace("#添加补偿词", '')
        txts_.splice(txts_.indexOf(Shutdownword), 1);//从补偿词列表中删除
        e.reply("删除补偿词成功!");
        return true//拦截指令
      }
    } else {//如果不是群主或管理员
      e.reply("只有群主或管理员才能使用禁言哦！（摸摸头）");//回复消息
      return true;//拦截指令
    }
  }
  //选择监听状态-------------------------------------------------------
  if (modle === 0) {
    if (arr.includes(e.group.group_id)) {
      mute(e)
    }
  }
  else if (modle === 1) {
    mute(e)
  }
}
//积分禁言程序------------------------------------------------------------------
function mute(e) {
  //判断身份-------------------------------------------------------------------
  //机器人自己的身份，不是群主和管理员则退出
  if (!(Bot.pickGroup(e.group_id).is_owner || Bot.pickGroup(e.group_id).is_admin)) {
    return;
  }
  //判断白名单和管理员
  if (white.includes(e.sender.user_id)) {
    return;
  }//如果是白名单
  if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster)
    return true;//拦截指令    
  if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster)
    return true;//拦截指令  
  //开始积分 ------------------------------------------------------------------- 
  var grades = 0
  for (let txt2 of ShutdownList) {//2分区域
    if (e.msg.includes(txt2)) {
      let arr = e.msg.split('');
      var count2 = 0;
      for (var j = 0; j <= arr.length - 1; j++) {
        if (arr[j] == txt2)
          count2++;
      }
      grades = grades + 2 * count2
    }
  }
  for (let txt1 of txts1) {
    if (e.msg.includes(txt1)) {
      let arr = e.msg.split('');
      var count1 = 0;
      for (var i = 0; i <= arr.length - 1; i++) {
        if (arr[i] == txt1)
          count1++;
      }
      grades = grades + count1
    }
  }
  for (let txt_ of txts_) {
    if (e.msg.includes(txt_)) {
      let arr = e.msg.split('');
      var count_ = 0;
      for (var k = 0; k <= arr.length - 1; k++) {
        if (arr[k] == txt_)
          count_++;
        grades = grades - count_
      }
    }
  }
  for (let txt0 of txts0) {
    if (e.msg.includes(txt0)) {
      if (e.msg.includes(txt0)) {
        let arr = e.msg.split('');
        var count = 0;
        for (var k = 0; k <= arr.length - 1; k++) {
          if (arr[k] == txt0)
            count++;
        }
        if (count % 2 == 1 && grades > 0)//当分数大于0时，判断是否需要反转
          grades = grades * (-1)
      }
    }
  }
  //循环结束后通过分数判断是否禁言-------------------------------------------------------------
  if (grades >= 2) {
    e.reply("你的使用了敏感词汇。")
    e.group.muteMember(e.sender.user_id, 2592000)
  }
  //e.group.kickMember(e.sender.user_id)//取消注释则将此人踢出
  let id = e.sender.user_id
  log.push(id); 
  log.push(id);
  return;
}