import plugin from '../../../lib/plugins/plugin.js'
import fs from "fs";
//项目路径
//如果报错请删除Yunzai/data/目录中lin文件夹
const dirpath = "data/lin/";//文件夹路径
var filename = `battle`;//文件名
if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
	filename = filename + ".json";//添加.json
}
//配置一些有意思的参数

export class seelevel extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: 'lin帮助',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#(lin|麟)(规则|帮助)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'rules'
				},
				{
					/** 命令正则匹配 */
					reg: "^#(决斗|游戏)(规则|帮助)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'gamerules'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async rules(e) {
		e.reply(`决斗指令：#御前决斗@...\n#(锻炼|早睡)\n#我的境界\n#(设置|移除)半步管理员@...\n#(游戏|决斗)规则`)
		return
	}
	async gamerules(e) {
		e.reply(`#游戏规则挑战成功：\n自己战斗力-3，对方战斗力不变\n挑战失败：\n自己战斗力-1，对方战斗力-2\n战斗力每日自动-1\n战斗力越高胜率越大，禁言时间越长\n战斗力依赖系数在duel.js中`)
		return
	}
}