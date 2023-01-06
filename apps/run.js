import plugin from '../../../lib/plugins/plugin.js'
import lin_data from '../components/lin_data.js';
const BotName = global.Bot.nickname;
var Template = {//创建该用户
  "shield": [],//普通屏蔽
  "shield2": []//被管理员屏蔽了
};
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
      var id2 = e.user_id
    }
    else if (e.isPrivate) {
      var id = e.user_id
    }
    var json = {}
    var json2 = {}
    json = await lin_data.getdata(id, json, false)
    if (e.atme && e.msg == "#跑路列表") {//如果消息内容是跑路列表指令
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
    json2 = await lin_data.getuser(id, json2, 'run', Template, false)//只在群聊有效
    if (!e.msg) return false;
    if (e.atme && e.msg == "#回避" || (e.msg.includes('回避') && (e.msg.includes(BotName) || e.msg.inclues('全部')))) {
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
    else if (e.atme && e.msg == "#回来" || (e.msg.includes('回来') && (e.msg.includes(BotName) || e.msg.inclues('全部')))) {//如果消息内容是回来指令
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
    else if (e.atme && e.msg == "#跑路" || (e.msg.includes('跑路') && (e.msg.includes(BotName) || e.msg.inclues('全部')))) {//如果消息内容是跑路指令
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
    else if (e.atme && e.msg == "#别理我" || e.atme && e.msg == "#屏蔽我" || (e.msg.includes('屏蔽我') && (e.msg.includes(BotName) || e.msg.inclues('全部')))) {//如果消息内容是跑路指令
      if (json2[e.group_id].shield.indexOf(id2) == -1) {//如果不在跑路列表中
        json2[e.group_id].shield.push(id2)
        json2 = await lin_data.getuser(id, json2, 'run', Template, true)//只在群聊有效
        e.reply(`本群你（${id2}）已经被屏蔽了，不理你了！`);//回复消息
        return true;//拦截指令
      } else {//如果在跑路列表中
        e.reply(`本群你已经被屏蔽了，你还想再让我屏蔽你一次吗？`);//回复消息
        return true;//拦截指令
      }
    }
    else if (e.atme && e.msg == "#理我" || e.atme && e.msg == "#别屏蔽我") {//如果消息内容是跑路指令
      if (json2[e.group_id].shield.indexOf(id2) == -1) {//如果不在屏蔽列表中
        e.reply(`本群你没有被屏蔽了，你还想让我屏蔽你一次吗？`);//回复消息
        return true;//拦截指令
      } else {//如果在跑路列表中
        json2[e.group_id].shield = json2[e.group_id].shield.filter(item => item != e.user_id)
        json2 = await lin_data.getuser(id, json2, 'run', Template, true)//只在群聊有效
        e.reply(`本群你已经被解除屏蔽了！`);//回复消息
        return true;//拦截指令
      }
    }
    else if (e.at && (e.msg.includes('#屏蔽此人')) || (e.msg.includes('屏蔽此人') && (e.msg.includes(BotName) || e.msg.inclues('全部')))) {//如果消息内容是跑路指令
      if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {//如果是群主或管理员
        if (json2[e.group_id].shield2.indexOf(e.at) == -1) {//如果不在跑路列表中
          json2[e.group_id].shield2.push(e.at)
          json2 = await lin_data.getuser(id, json2, 'run', Template, true)//只在群聊有效
          e.reply(`本群你（${e.at}）已经被屏蔽了，不理你了！`);//回复消息
          return true;//拦截指令
        } else {//如果在跑路列表中
          e.reply(`本群你已经被屏蔽了，你还想再让我屏蔽你一次吗？`);//回复消息
          return true;//拦截指令
        }
      }
      else {//如果不是群主或管理员
        e.reply(`只有群主或管理员才能让我屏蔽别人！`);//回复消息
        return true;//拦截指令
      }
    }
    else if (e.at && (e.msg.includes('#解除此人屏蔽'))) {//如果消息内容是跑路指令
      if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {//如果是群主或管理员
        if (json2[e.group_id].shield2.indexOf(e.at) == -1) {//如果不在跑路列表中
          e.reply(`本群${e.at}已经被屏蔽了，不理ta了！`);//回复消息
          return true;//拦截指令
        } else {//如果在跑路列表中
          json2[e.group_id].shield2 = json2[e.group_id].shield2.filter(item => item != e.at)
          json2 = await lin_data.getuser(id, json2, 'run', Template, true)//只在群聊有效
          e.reply(`本群${e.at}已经被解除屏蔽了！`);//回复消息
          return true;//拦截指令
        }
      }
      else {//如果不是群主或管理员
        e.reply(`只有群主或管理员才能让我屏蔽别人！`);//回复消息
        return true;//拦截指令
      }
    }
    if (e.atme && e.msg == "#屏蔽列表" || (e.msg.includes('屏蔽列表') && (e.msg.includes(BotName) || e.msg.inclues('全部')))) {//如果消息内容是跑路指令
      if (e.sender.role == "owner" || e.sender.role == "admin" || e.isMaster) {//如果是群主或管理员
        if (json2[e.group_id].shield2.length > 0 || json2[e.group_id].shield.length > 0) {//如果不在跑路列表中
          let msg = ''

          if (json2[e.group_id].shield2.length > 0) {
            msg = msg + '自己选择屏蔽的人：'
            for (let i of json2[e.group_id].shield)
              msg = msg + `\n${i}`
          }
          if (json2[e.group_id].shield2.length > 0) {
            msg = msg + `\n被管理员屏蔽的人:`
            for (let i of json2[e.group_id].shield2)
              msg = msg + `\n${i}`
          }
          e.reply(msg);//回复消息
          return true;//拦截指令
        } else {//如果在跑路列表中
          e.reply(`本群没有被屏蔽的人！`);//回复消息
          return true;//拦截指令
        }
      }
      else {//如果不是群主或管理员
        e.reply(`只有群主或管理员才能让我屏蔽别人！`);//回复消息
        return true;//拦截指令
      }
    }
    else {
      //如果该群聊在跑路列表中
      if (json[id].run || (json2[e.group_id].shield.indexOf(id2) != -1) || (json2[e.group_id].shield2.indexOf(id2) != -1)) {
        return true;//拦截指令
      } else {
        return false;//放行指令
      }
    }
  }
}