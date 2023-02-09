import plugin from '../../../lib/plugins/plugin.js'
var runChatList = [];
const BotName = global.Bot.nickname;
export class run extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '测试',
      /** 功能描述 */
      dsc: '#测试',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 0,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '#在吗',
          /** 执行方法 */
          fnc: 'test'
        }
      ]
    })
  }
  /**
   * 
   * @param e oicq传递的事件参数e
   */
  async test(e) {
    //e.reply(Bot.uin)
    if (e.user_id.sex == 'male')
      e.reply('不理男孩子')
    if (e.user_id.sex == 'female')
      e.reply('小姐姐好')
  }
}
