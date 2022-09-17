import plugin from '../../lib/plugins/plugin.js'
import fetch from "node-fetch";
//感谢前边所有版本的青云客作者
//@苏苏@dmhfd(1695037643);
//项目路径
var BotName = "空之荧";//你家机器人叫这个，记得改了
var gailv = 0.2;//概率20%，这个是初始概率，重启后就是这个概率
var gailv_ = 0.1;//每次条件的概率
const onlyReplyAt = true //群聊是否只关注@信息
//简单应用示例
//1.定义命令规则
export class qykai extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: '青云客ai',
			/** 功能描述 */
			dsc: 'ai',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 12000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: '',
					/** 执行方法 */
					fnc: 'qyk'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async qyk(e) {
		if (!e.msg || e.msg.charAt(0) == '#') return;
		//e.msg 用户的命令消息
		console.log("用户命令：", e.msg);
		//控制ai回复概率的模块
		let j = Math.random();
		if (e.msg.includes('太安静')) {
			//如果概率等于1
			if (gailv > 0.99) {
				//提示不能修改了
				gailv = 1
				e.reply("很吵了，不能修改了");
				return true;
			}
			gailv = gailv + gailv_;
			let gailvs = gailv * 100;
			//保留整数
			gailvs = gailvs.toFixed(0);
			e.reply(`可以说“太吵了”，“太安静了”调节\n目前青云客ai触发概率：${gailvs}%`)
			return true;
		}
		if (e.msg.includes('太吵')) {
			//如果概率等于0
			if (gailv < 0.01) {
				//提示不能修改了
				gailv = 0
				e.reply("很安静了，不能修改了");
				return true;
			}
			gailv = gailv - gailv_;
			let gailvs = gailv * 100;
			//保留整数
			gailvs = gailvs.toFixed(0);
			e.reply(`可以输入“太吵了”、“太安静了”或者进入文件修改是否只关注@信息来调节\n目前青云客ai触发概率：${gailvs}%，是否只关注@信息：${onlyReplyAt}`)
			return true;
		}
		if (j >= gailv)//ai的触发率
		{
			console.log("退出青云客ai");
			return true;
		}
		if (e.msg.includes(BotName) || (e.at && e.at == BotConfig.account.qq) || e.isPrivate || !onlyReplyAt) {
			console.log("青云客消息：", e.msg);
			let Msg = e.msg.replace(BotName, "菲菲");
			let url = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${Msg}`;
			let response = await fetch(url);
			let res = await response.json();
			if (res) {
				if (res.result == 0) {
					res.content = res.content.replace(/菲菲/g, BotName);
					e.reply(res.content);
				}
			}
			return true;
		}
		else return;
	}
}

