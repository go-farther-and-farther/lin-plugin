import plugin from '../../../lib/plugins/plugin.js'
import schedule from "node-schedule";
import moment from "moment"
import command from '../components/command.js'
import yzcfg from '../../../lib/config/config.js'
import common from '../../../lib/common/common.js'
var thumbUptime = 12//自动点赞开始时间
var thumuppen = await command.getConfig("thumbUp_cfg", "thumuppen")
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
		thumbUp_start('hand');
	}
}
//每小时执行任务
schedule.scheduleJob('0 0 * * * *', async () => {
	let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
	let hour = new Date(time).getHours()
	if (hour == thumbUptime && thumuppen)
		thumbUp_start('auto');
}
);

async function thumbUp_start(key) {
	let friendmap = Bot.fl
	var arr = []
	for (let friend of friendmap) {
		arr.push(friend[0])
	}
	arr = arr.filter(item => item != Bot.uin)
	if (key == 'auto'){
        for(let mat of yzcfg.masterQQ){
            await common.relpyPrivate(mat, `lin-plugin自动点赞任务开始\n本次点赞好友共${arr.length}位\n自动点赞为防止风险,间隔较长,预计${arr.length * 2}分钟完成\n自动开关请前往本插件config/lin.config.yaml中修改`)
        }
    	var s = 1000
		for (let i = 0; i < arr.length - 1; i++) {
			let a = Math.round(Math.random() * 5 + 1) * 60000
			let sj = s
		    s += a
			setTimeout(() => {
			    console.log(`本次为开始后${sj}毫秒,自动第${i+1}次点赞.点赞对象${arr[i]},下次点赞是${a}毫秒后`)
			    Bot.pickFriend(arr[i]).thumbUp(10);//点赞10次，默认没有svip
				if(i == arr.length-2)
				for(let mat of yzcfg.masterQQ){
					common.relpyPrivate(mat, `lin-plugin自动点赞任务完成`)
				}
			}, sj);//随机延时,一到五分钟
		}
	}
	if (key == 'hand'){
        for(let mat of yzcfg.masterQQ){
            await common.relpyPrivate(mat, `lin-plugin点赞开始,本次点赞好友共${arr.length}位,预计${arr.length * 10}秒完成`)
        }
     	for (let i = 0; i < arr.length - 1; i++) {
			setTimeout(() => {
				console.log(`本次为手动第${i+1}次点赞.点赞对象${arr[i]}`)
				Bot.pickFriend(arr[i]).thumbUp(10);//点赞10次，默认没有svip
				if(i == arr.length-2)
				for(let mat of yzcfg.masterQQ){
					common.relpyPrivate(mat, `lin-plugin点赞任务完成`)
				}
			}, i * 10000);//10秒延时
		}
	}
}