import plugin from '../../../lib/plugins/plugin.js'
import fs from "fs";
import cfg from '../../../lib/config/config.js'
//项目路径
//如果报错请删除Yunzai/data/目录中lin文件夹
const dirpath = "data/lin/";//文件夹路径
var filename = `battle`;//文件名
if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
	filename = filename + ".json";//添加.json
}
const require = createRequire(import.meta.url);
const { exec, execSync } = require("child_process");

const _path = process.cwd();
//配置一些有意思的参数

export class help extends plugin {
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
		//let msg1 = "lin插件包开始自动更新,不需要该功能可以手动注释"
		for (let i of cfg.masterQQ) { //这里定义发送给所有主人
			let userId = i
			//Bot.pickUser(userId).sendMsg(msg1)
		}
		var ls = exec(command, { cwd: `${_path}/plugins/lin/` }, async function (error, stdout, stderr) {
			let isChanges = error.toString().includes("Your local changes to the following files would be overwritten by merge") ? true : false;

			let isNetwork = error.toString().includes("fatal: unable to access") ? true : false;

			if (isChanges) {
				let msg2 = "发现新版本！自动更新失败！\nError code: " +
					error.code +
					"\n" +
					error.stack +
					"\n\n本地代码与远程代码存在冲突,上面报错信息中包含冲突文件名称及路径，请尝试处理冲突\n如果不想保存本地修改请使用【#强制更新】\n(注意：强制更新命令会忽略所有本地对lin插件本身文件的修改，本地修改均不会保存，请注意备份)"
				for (let i of cfg.masterQQ) { //这里定义发送给所有主人
					let userId = i
					Bot.pickUser(userId).sendMsg(msg2)
				}
			}
		});
		return
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async gamerules(e) {
		e.reply(`#游戏规则挑战成功：\n自己战斗力-3，对方战斗力不变\n挑战失败：\n自己战斗力-1，对方战斗力-2\n战斗力每日自动-1\n战斗力越高胜率越大，禁言时间越长\n战斗力依赖系数在duel.js中`)
		return
	}
}