
import fs from 'fs'
import lodash from 'lodash'
import { segment } from "oicq";
import puppeteer from '../../../../lib/puppeteer/puppeteer.js'
import cfg from '../../../../lib/config/config.js'
import { Cfg, Common, Data, Version, Plugin_Name, Plugin_Path } from '../../components/index.js'
// import Theme from './help/theme.js'

export class lin_help extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '麟插件_帮助',
      /** 功能描述 */
      dsc: '',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 2000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#(lin|麟)(规则|帮助|版本)$',
          /** 执行方法 */
          fnc: 'message'
        },{
          /** 命令正则匹配 */
          reg: '^#(ai|智能回复)(规则|帮助|版本)$',
          /** 执行方法 */
          fnc: 'message2'
        }
      ]
    });
  }

  async message() {
    return await help(this.e,"help");
  }
  async message2() {
    return await help(this.e,"aihelp");
  }

}

async function help(e,key) {
  let custom = {}
  let help = {}

  let { diyCfg, sysCfg } = await Data.importCfg(key)

  custom = help

  let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
  let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList
  let helpGroup = []

  lodash.forEach(helpList, (group) => {
    if (group.auth && group.auth === 'master' && !e.isMaster) {
      return true
    }

    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })

    helpGroup.push(group)
  })
  let bg = await rodom()
  let colCount = 3;
  return await Common.render('help/index', {
    helpCfg: helpConfig,
    helpGroup,
    bg,
    colCount,
    // element: 'default'
  }, {
    e,
    scale: 2.0
  })
}

const rodom = async function () {
  var image = fs.readdirSync(`./plugins/lin-plugin/resources/help/imgs/`);
  var list_img = [];
  for (let val of image) {
    list_img.push(val)
  }
  var imgs = list_img.length == 1 ? list_img[0] : list_img[lodash.random(0, list_img.length - 1)];
  return imgs;
}