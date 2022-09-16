import plugin from '../../../lib/plugins/plugin.js'
import schedule from "node-schedule";
import command from '../command/command.js'
var everyone = await command.getConfig("thumbUp_cfg", "everyone") //是否全局点赞
var reply_something = await command.getConfig("thumbUp_cfg", "reply_something") //是否有点赞提示
var delayed = await command.getConfig("thumbUp_cfg", "time") * 1000;//这个是间隔时间
var huifu = await command.getConfig("thumbUp_cfg", "huifu");//这个是点赞完成后推送消息的概率
var url = await command.getConfig("thumbUp_cfg", "url");;//这个是接口,获取图片的。
let id = [];//这个是点赞名单,空则全部点赞
let blacklist = [];//这个是不发送提示消息的黑名单，有的人怕被骚扰。
let blacklist_id = [];//这个是黑名单id
let words = ['早上好！', "你的喜欢是对我最大的支持！", "早上好哦！"]//这个是点赞完之后说的话
var alllist = Bot.fl//获取全部好友名单
idlist = [];
for (var key of alllist) {
	idlist.push(key[0])
}
//判断白名单模式还是全局模式，想要名单为空并且配置开启全局点赞
if (!(id.length == 0 && everyone == 1)) {
	var idlist = id;
}
export class thumbUp extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: '点赞',
			/** 功能描述 */
			dsc: '发送点赞或者到点点赞',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#(发起|开始)?(点赞|打卡)(.*)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'thumbUp'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async thumbUp(e) {
		e.reply(`开始任务！`)
		console.log(`开始点赞，点赞名单：`, idlist[i], `正在点赞中...`)
		for (let i = 0; i < idlist.length; i++) {
			setTimeout(() => {
				console.log(`本次为第${i}次点赞，正在点赞中...`)
				if (!blacklist_id.includes(idlist[i])) {
					//判断是否在黑名单中，在则跳过
					Bot.pickFriend(idlist[i]).thumbUp(10);//点赞10次，默认没有svip
					let l = Math.round(Math.random() * 100)//获取一个0~100的随机数
					if (!blacklist.includes(id[i]) && l < huifu && reply_something == 1) {//这里是消息的触发概率
						let msg = []
						if (url == ``) {
							msg = [
								words[Math.floor(Math.random() * words.length)],
							];
						}
						else {
							msg = [
								words[Math.floor(Math.random() * words.length)],
								segment.image(url),
							];
						}
						Bot.pickUser(idlist[i]).sendMsg(msg)
					}
				}
			}, delayed * i);//设置延时
		}
	}
}
let time_ = String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 2) + 6) + ' * * *'
//这个是获取一个6~7点的时间，到了时间则执行任务
schedule.scheduleJob(time_, function () {
	console.log(`开始点赞，点赞名单：`, idlist[i], `正在点赞中...`)
	for (let i = 0; i < idlist.length; i++) {
		setTimeout(() => {
			console.log(`本次为第${i}次点赞，正在点赞中...`)
			if (!blacklist_id.includes(idlist[i])) {
				//判断是否在黑名单中，在则跳过
				Bot.pickFriend(idlist[i]).thumbUp(10);//点赞10次，默认没有svip
				let l = Math.round(Math.random() * 100)//获取一个0~100的随机数
				if (!blacklist.includes(id[i]) && l < huifu && reply_something == 1) {//这里是消息的触发概率
					let msg = []
					if (url == ``) {
						msg = [
							words[Math.floor(Math.random() * words.length)],
						];
					}
					else {
						msg = [
							words[Math.floor(Math.random() * words.length)],
							segment.image(url),
						];
					}
					Bot.pickUser(idlist[i]).sendMsg(msg)
				}
			}
		}, delayed * i);//设置延时
	}
}
);