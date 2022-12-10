import plugin from '../../../lib/plugins/plugin.js'
//import fetch from 'node-fetch'
import command from '../components/command.js'
import fs from 'fs';
import lin_data from '../components/lin_data.js'
var a = {}
var i = {}
const dirpath = "plugins/lin-plugin/data";//文件夹路径
const filename = `Auto.json`;//文件名
/*纯小白，大佬勿喷，有问题找大佬。没问题找我2113752439
此插件可实现群聊中机器人跟着+1的功能，目前仅支持文字内容
因为我不会写*/
/*1.0.0 纯文字+1，开关功能实现
  1.0.1 增加状态提示，
  2.0.0 越追越远重写
*/
export class Auto extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '复读只因',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '',
          /** 执行方法 */
          fnc: 'cs',
          log: false
        }
      ]
    })
  }

  /**
   * #一言
   * @param e oicq传递的事件参数e
   */
  async cs(e) {
    /** e.msg 用户的命令消息 */
    //logger.info('[用户命令]', e.msg)
    //是否为文本消息和指令
    if (!e.msg) return false;
    //e.msg 用户的命令消息
    console.log("用户命令：", e.msg);
    if (e.isGroup) {
      var id = e.group_id
    }
    else if (e.isPrivate) {
      var id = e.user_id
    }
    let json = await lin_data.getAuto(id)
    //从json中读取需要的数据
    var open = json[id].open
    var open2 = json[id].open2
    var num = json[id].num

    if (e.isMaster || e.member.is_owner || e.member.is_admin) {
      let change = false
      if (e.msg == "关闭复读" || e.msg == "关闭复读") {
        open = false
        change = true
      }
      else if (e.msg == "关闭打断" || e.msg == "关闭打断") {
        open2 = false
        change = true
      }
      else if (e.msg == "开启复读" || e.msg == "开启复读") {
        open = true
        open2 = false
        change = true
      }
      else if (e.msg == "开启打断" || e.msg == "开启打断") {
        open2 = true
        open = false
        change = true
      }
      else if (e.msg.includes('设置复读条件') || e.msg.includes('设置打断条件')) {
        if (!open) {
          e.reply("自动复读已关闭,请先开启,不然设置了我复读不了啊(～￣▽￣)～")
        }
        var msgsz = e.msg.replace(/(设置复读条件|设置打断条件|#)/g, "").replace(/[\n|\r]/g, "，").trim()
        if (isNaN(msgsz)) {
          e.reply(`${msgsz}不是有效值,请输入正确的数值`)
        }
        else {
          if (msgsz < 2) {
            e.reply("数值不在有效范围内,请输入2及以上的整数")
          }
          else {
            let sz = Math.round(msgsz)
            num = sz
            change = true
          }
        }
      }
      else if (e.msg.includes("复读状态")) change = true
      if (change) {
        change = false
        let msg = `：${id},\n自动复读开启：${open},\n自动打断施法：${open2},\n触发条件：${num}次以后。`
        if (e.isPrivate) {
          msg = '你的QQ是' + msg
          e.reply(msg)
        }
        if (e.isGroup) {
          msg = '所在群聊是' + msg
          e.reply(msg)
        }
      }
      json[id].num = num
      json[id].open = open
      json[id].open2 = open2
      fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
      //return false
    }
    if (open || open2) {
      if (!a[id]) {//第一次运行,a=0时候
        a[id] = e.msg;
        i[id] = 1;
        return false;
      }
      else {
        if (a[id] == e.msg) { i[id]++ }
        else {//不等于的时候，a被刷新
          a[id] = e.msg
          i[id] = 1
        }
        if (i[id] >= num) {//重复次数足够多，复读并刷新i
          if (open) { e.reply(a[id]) }
          else if (open2) { e.reply(`打断施法，不要再发“${a[id]}”了！`) }
          i[id] = 1
        }
      }
    }
    return false;
  }
}

