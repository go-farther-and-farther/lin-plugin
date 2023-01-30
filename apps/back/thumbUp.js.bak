import plugin from '../../../../lib/plugins/plugin.js'
import schedule from "node-schedule";
import command from '../../components/command.js'
import lin_data from '../../components/lin_data.js';
import cfg from '../../../../lib/config/config.js'
var delayed = await command.getConfig("thumbUp_cfg", "time") * 1000;//这个是间隔时间
delayed = 10000
var Template = {//创建该用户
	"thumbUp": false
};
var url = '';//这个是接口,获取图片的。
let words = ['早上好！', "你的喜欢是对我最大的支持！", "早上好哦！"]//这个是点赞完之后说的话

let thumbUp_time = String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 2) + 6) + ' * * *'
//判断白名单模式还是全局模式，想要名单为空并且配置开启全局点赞
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
					reg: "^#开始点赞$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'thumbUp'
				},
				{
					/** 命令正则匹配 */
					reg: "^#点赞列表$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'thumbUplist'
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
	}
	async thumbUplist(e) {
		if (e.isMaster) {//如果是主人
			let list = get_list(e)
			e.reply(list)
			let msg = `会给以下好友点赞啦！\n`
			if (list.length == 0) {
				msg = '没有要点赞的人'
			}
			else {
				for (let name of list) {//看看list里面的人是不是好友
					msg = msg + `${name}\n`
				}
			}
			e.reply(msg)
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
	let idlist = cfg.masterQQ
	for (var i = 0; i < idlist.length; i++) {
		setTimeout(() => {
			console.log(`本次为第${i}次点赞判断中，不一定点赞中...`)
			Bot.pickFriend(idlist[i]).thumbUp(10);//点赞10次，默认没有svip
		}, delayed * i);//设置延时
	}
}

async function get_list(e) {
	var uin = Bot.uin
	//获取全部好友名单
	var alllist = Bot.fl
	let idlist = [];
	for (var key of alllist) {
		idlist.push(key[0])
	}
	//获取json文件
	let json = []
	json = await lin_data.getdata(uin, json, false)
	for (let j of idlist) {//看看主人是不是注册了
		if (!json.hasOwnProperty(j)) {//如果json中不存在该用户
			json[j] = Template
		}
		if (cfg.masterQQ.includes(j)) { json[j].thumbUp = true }
	}
	let idlist2 = []
	for (let i of idlist) {
		if (json[i].thumbUp == true) {
			idlist2.push(i)
		}
	}
	await lin_data.getdata(uin, json, true)//保存一下
	return idlist2;//拦截指令
}