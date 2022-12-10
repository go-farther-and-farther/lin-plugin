import plugin from '../../../lib/plugins/plugin.js'
import schedule from "node-schedule";
import command from '../components/command.js'
import lin_data from '../components/lin_data.js';
import cfg from '../../../lib/config/config.js'
var delayed = await command.getConfig("thumbUp_cfg", "time") * 100;//这个是间隔时间
var Template = {//创建该用户
	"thumbUp": false
};
var url = '';//这个是接口,获取图片的。
let words = ['早上好！', "你的喜欢是对我最大的支持！", "早上好哦！"]//这个是点赞完之后说的话
var uin = Bot.uin
var alllist = Bot.fl//获取全部好友名单

let idlist = [];
for (var key of alllist) {
	idlist.push(key[0])
}
let thumbUp_time = String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 2) + 6) + ' * * *'
//判断白名单模式还是全局模式，想要名单为空并且配置开启全局点赞

var json = []
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
		e.reply('开始了哦！')
		thumbUp_start();
		e.reply('完成了哦！')
	}
	async thumbUplist(e) {
		id = uin
		json = await lin_data.getdata(uin, json, false)
		if (e.isMaster) {//如果是主人
			let thumbUpnum = 0
			let msg = `会给以下好友点赞啦！\n`
			let list = Object.keys(json)//获取群号
			for (let i of list) {
				if (json[i].thumbUp) {
					msg = msg + `${i}\n`
				}
				thumbUpnum++
			}
			if (thumbUpnum == 0) {//如果跑路列表为空
				e.reply("当前没有要点赞的好友哦！");//回复消息
				return true;//拦截指令
			} else {//如果跑路列表不为空
				e.reply(msg);//回复消息
				return true;//拦截指令
			}
		} else {//如果不是主人
			e.reply("只有主人才能查看点赞列表哦！");//回复消息
			return true;//拦截指令
		}

	}
}
//这个是获取一个6~7点的时间，到了时间则执行任务
schedule.scheduleJob(thumbUp_time, function () {
	thumbUp_start();
}
);
async function thumbUp_start() {
	console.log(`开始点赞,正在点赞中...`)
	let json = [];
	json = await lin_data.getdata(uin, json, false)
	for (let j of cfg.masterQQ) {
		if (!json.hasOwnProperty(j)) {//如果json中不存在该用户
			json[j] = Template
		}
		json[j].thumbUp = true
	}
	for (var i = 0; i < idlist.length; i++) {
		setTimeout(() => {
			console.log(`本次为第${i}次点赞判断中，不一定点赞中...`)
			if (json.hasOwnProperty(idlist[i]) && idlist[i] != Bot.uin) {
				if (json[idlist[i]]) {//判断是否在黑名单中，在则跳过
					//新增了点赞跳过自己，解决了重启的问题
					//Bot.pickFriend(idlist[i]).thumbUp(10);//点赞10次，默认没有svip
				}
			}
		}, delayed * i);//设置延时
	}
	json = await lin_data.getdata(uin, json, true)
}