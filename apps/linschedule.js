import plugin from '../../../lib/plugins/plugin.js'
import schedule from "node-schedule";
import command from '../components/command.js'
import cfg from '../../../lib/config/config.js'
var thumbUptime = 21//Number(await command.getConfig("thumbUp_cfg", "time"));//这个是开始时间
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
		thumbUp_start('hand');
	}
}
//每小时执行任务
schedule.scheduleJob('0 0 * * * *', async () => {
	let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
	let hour = new Date(time).getHours()
	if (hour == thumbUptime)
		thumbUp_start('auto');
}
);

async function thumbUp_start(key) {
	console.log(`开始给所有好友点赞点赞,正在点赞中...`)
	let friendmap = Bot.fl
	var arr = []
	for (let friend of friendmap) {
		arr.push(friend[0])
	}
	arr = arr.filter(item => item != Bot.uin)
	if (key == 'auto'){
    	var s = 1000
		for (let i = 0; i < arr.length - 1; i++) {
			let a = Math.round(Math.random() * 5 + 1) * 600000
			let sj = s
		    s += a
			setTimeout(() => {
			    console.log(`本次为开始后${sj}毫秒,自动第${i}次点赞.点赞对象${arr[i]},下次点赞是${a}毫秒后`)
			    Bot.pickFriend(arr[i]).thumbUp(10);//点赞10次，默认没有svip
			}, sj);//随机延时,十到六十分钟
		}
	}
	if (key == 'hand')
		for (let i = 0; i < arr.length - 1; i++) {
			setTimeout(() => {
				console.log(`本次为手动第${i}次点赞.点赞对象${arr[i]}`)
				Bot.pickFriend(arr[i]).thumbUp(10);//点赞10次，默认没有svip
			}, i * 10000);//10秒延时
		}
}