import plugin from '../../../lib/plugins/plugin.js'
import lin_data from '../components/lin_data.js';
const BotName = global.Bot.nickname;
export class run extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '跑路插件',
      /** 功能描述 */
      dsc: '#跑路，bot就不接受消息了',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '',
          /** 执行方法 */
          fnc: 'run',
          log: false
        }
      ]
    })
  }
  /**
   * 
   * @param e oicq传递的事件参数e
   */
  async run(e) {
    if (e.isGroup) {
      var id = e.group_id
    }
    else if (e.isPrivate) {
      var id = e.user_id
    }
    var json = {}
    json = await lin_data.getdata(id, json, false)
    if (e.msg == "#跑路列表") {//如果消息内容是跑路列表指令
      if (e.isMaster) {//如果是主人
        let runnum = 0
        let msg = `在以下群聊跑路啦！\n`
        let list = Object.keys(json)//获取群号
        for (let i of list) {
          if (json[i].run) {
            msg = msg + `${i}\n`
          }
          runnum++
        }
        if (runnum == 0) {//如果跑路列表为空
          e.reply("当前没有跑路的群聊哦！");//回复消息
          return true;//拦截指令
        } else {//如果跑路列表不为空
          e.reply(msg);//回复消息
          return true;//拦截指令
        }
      } else {//如果不是主人
        e.reply("只有主人才能查看跑路列表哦！");//回复消息
        return true;//拦截指令
      }
    }
    if (!e.isGroup) {//如果不是群聊
      return false;//放行指令
    }
    if (!e.msg) return false;
    if (e.msg == "#回避" || (e.msg.includes('回避') && e.msg.includes(BotName))) {
      if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {
        json[id].run = true;//添加到跑路列表
        e.reply(`${BotName}回避一分钟，绝对不会偷看哦！`);//回复消息
        setTimeout(() => {//冷却时间
          if (json[id]) {
            e.reply(`一分钟已经过去了，${BotName}回来了哦！`)
            json[id].run = false;
          }
        }, 1 * 1000 * 60);
      }
      return true;//拦截指令
    }
    else if (e.msg == "#回来" || (e.msg.includes('回来') && e.msg.includes(BotName))) {//如果消息内容是回来指令
      if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {//如果是群主或管理员
        if (!json[id].run) {//如果不在跑路列表中
          e.reply(`本群${BotName}没有跑路，一直到在哦！`);//回复消息
          return true;//拦截指令
        } else {//如果在跑路列表中
          json[id].run = false
          json = await lin_data.getdata(e.group_id, json, true)
          e.reply(`本群${BotName}已经回来了，快来和我玩吧！`);//回复消息
          return true;//拦截指令
        }
      } else {//如果不是群主或管理员
        e.reply(`只有群主或管理员才能让${BotName}回来！`);//回复消息
        return true;//拦截指令
      }
    }
    else if (e.msg == "#跑路" || (e.msg.includes('跑路') && e.msg.includes(BotName))) {//如果消息内容是跑路指令
      if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {//如果是群主或管理员
        if (!json[id].run) {//如果不在跑路列表中
          json[id].run = true;//添加到跑路列表
          json = await lin_data.getdata(e.group_id, json, true)
          e.reply(`本群${BotName}已经跑路了，再见啦！`);//回复消息
          return true;//拦截指令
        } else {//如果在跑路列表中
          e.reply(`本群${BotName}已经跑路了，你还想再让我跑一次吗？`);//回复消息
          return true;//拦截指令
        }
      } else {//如果不是群主或管理员
        e.reply(`只有群主或管理员才能跑路！`);//回复消息
        return true;//拦截指令
      }
    }
    else {
      //如果该群聊在跑路列表中
      if (json[id]) {
        return true;//拦截指令
      } else {
        return false;//放行指令
      }
    }
  }
}
