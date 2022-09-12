import plugin from '../../../lib/plugins/plugin.js'
import schedule from "node-schedule";
import command from '../command/command.js';
var everyone = await command.getConfig("thumbUp_cfg", "everyone"); //是否全局点赞
var reply = await command.getConfig("thumbUp_cfg", "reply"); //是否有点赞提示
var delayed = await command.getConfig("thumbUp_cfg", "time"); //这个是间隔时间
let id = [];//这个是点赞名单,空则全部点赞
let blacklist = [];//这个是不发送提示消息的黑名单，有的人怕被骚扰。
let blacklist_id = [];//这个是黑名单id
let url = `https://api.iyk0.com/ecy/api.php`;//这个是接口,获取图片的。
let words = ['早上好！', "你的喜欢是对我最大的支持！", "早上好哦！"]
var alllist = Bot.fl
idlist = [];
for (var key of alllist) {
	idlist.push(key[0])
}//获取所有好友名单放入idlist
//判断白名单模式还是全局模式
if (!(id.length == 0 && everyone)) {
	var idlist = id;
}
export class thumbUp extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: '锻炼',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#(发起|开始)?(点赞|打卡)(.*)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'thumbUp_'
				}
			]
		})
	}
	thumbUp = function () {
		for (let i = 0; i < idlist.length; i++) {
			setTimeout(() => {
				console.log(`本次为第${i}次点赞，`, idlist[i], `正在点赞中...`)
				if (!blacklist_id.includes(idlist[i])) {
					//判断是否在黑名单中
					Bot.pickFriend(idlist[i]).thumbUp(10);
					console.log(`点赞成功`)
					let l = Math.floor(Math.random() * 100)
					if ((!blacklist.includes(id[i]) || l < 20) && reply) {//这里是消息的触发概率
						let msg = [
							words[Math.floor(Math.random() * words.length)],
							//segment.image(url),
						];
						Bot.pickUser(idlist[i]).sendMsg(msg)
					}
				}
			}, delayed * i);//设置延时
		}
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async thumbUp_(e) {
		e.reply(`开始任务！`)
		thumbUp()
		return
	}
}
let time_ = String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 2) + 6) + ' * * *'
schedule.scheduleJob(time_, function () {
	thumbUp()
}
);