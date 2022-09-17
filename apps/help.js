import plugin from '../../../lib/plugins/plugin.js'
import { createRequire } from "module";
import puppeteer from "../../..//lib/puppeteer/puppeteer.js";
import command from '../command/command.js'
var msg = await command.getresources("help", "help");
var msg2 = await command.getresources("help", "help2");
const require = createRequire(import.meta.url);
const { exec, execSync } = require("child_process");

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
					reg: "^#(lin|麟|决斗|游戏)(规则|帮助)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'rules'
				}
			]
		})
	}

	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async rules(e) {
        if(e.msg.includes('决斗')||e.msg.includes('游戏'))
        msg = msg2
		let data1 = {}
		let ml = process.cwd()
		console.log(ml)
		data1 = {
			tplFile: './plugins/lin/resources/html2/2.html',
			cs: msg,
			dz: ml
		}
		let img = await puppeteer.screenshot("123", {
			...data1,
		});
		e.reply(img)
	}
}