import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
var kg = 0
let a = 0
let b = 0
let i = 0
/*纯小白，大佬勿喷，有问题找大佬。没问题找我2113752439
此插件可实现群聊中机器人跟着+1的功能，目前仅支持文字内容
因为我不会写*/
/*1.0.0 纯文字+1，开关功能实现
  1.0.1 增加状态提示，
*/
export class example extends plugin {
  constructor () {
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
          fnc: 'cs'
        }
      ]
    })
  }

  /**
   * #一言
   * @param e oicq传递的事件参数e
   */
  async cs (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
   if(e.msg == "开始复读" || e.msg == "结束复读" || e.msg == "复读状态"){
     if(!e.isGroup){
        e.reply("仅群聊可用")
        return
      }
      else if(e.isMaster || e.member.is_owner || e.member.is_admin){
        if(e.msg.includes("开") && kg == 0){
          kg = 1
          e.reply("已开启复读只因模式，现在我会随时+1了！!")
        }
        else if(e.msg.includes("开")){
          e.reply("已经开了！")
        }
        if(e.msg.includes("结") && kg == 1){
          kg = 0
          e.reply("已关闭复读只因模式，现在我不会主动+1了!")
        }
        else if(e.msg.includes("结")){
          e.reply("已经关了！")
        }
      }
      else{
        e.reply("你没有权限")
        return
      }
      if(e.msg.includes("状")){
        e.reply(`当前复读状态为${kg}，0为关1为开`)
      }
      return true;
    }
    else if(kg == 1 && e.isGroup){
      if(!i) {a = e.msg; i++
      return
      }
      else{b = e.msg;}
      if(a == b) {
        e.reply(a)
        a = 0
        b = 0
        i = 0
      }
      else{i = 0}
    }
    return false;
  }
}
