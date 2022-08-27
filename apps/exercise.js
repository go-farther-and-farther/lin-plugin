import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import fs from "fs";
import schedule from "node-schedule";
//项目路径
let exerciseCD = {};
//如果报错请删除Yunzai/data/目录中lin文件夹
const dirpath = "data/lin/";//文件夹路径
var filename = `battle`;//文件名
if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
	filename = filename + ".json";//添加.json
}
let Template = {//创建该用户
	"energy": 0,
	"level": 0,
	"levels": '无境界',
	"Privilege": 0,
};
//配置一些有意思的参数
let Cooling_time2 = 300 //命令间隔时间，单位分钟，这是锻炼的冷却时间#初始为300分钟
export class exercise extends plugin {//锻炼
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
					reg: "^#(发起|开始)?(锻炼|早睡)(.*)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'exercise'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async exercise(e) {
		console.log("用户命令：", e.msg);
		let user_id = e.user_id;
		if (exerciseCD[e.user_id]) { //判定是否在冷却中
			e.reply(`你刚刚进行了一次锻炼，请耐心一点，等待${Cooling_time2}分钟后再次锻炼吧！`);
			return;
		}
		if (filename.indexOf(".json") === -1) {//如果文件名不包含.json
			filename = filename + ".json";//添加.json
		}
		if (!fs.existsSync(dirpath)) {//如果文件夹不存在
			fs.mkdirSync(dirpath);//创建文件夹
		}
		if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
			}));
		}
		const json = JSON.parse(fs.readFileSync(dirpath + "/" + filename));//读取文件
		if (!json.hasOwnProperty(e.user_id)) {//如果json中不存在该用户
			json[e.user_id] = Template
		}
		exerciseCD[e.user_id] = true;
		exerciseCD[e.user_id] = setTimeout(() => {//冷却时间
			if (exerciseCD[e.user_id]) {
				delete exerciseCD[e.user_id];
			}
		}, Cooling_time2 * 1000 * 60);
		const date = new Date();
		let energy_ = 0
		let hours = date.getHours()
		if (hours >= 6 && hours <= 8) {
			energy_ = Math.round(3 + 2 * Math.random())
			e.reply([segment.at(e.user_id),
			`\n🎉恭喜你获得了${energy_}点战斗力,一日之计在于晨，清晨锻炼效果更好哦！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		} else if (hours >= 8 && hours <= 20) {
			energy_ = Math.round(1 + 2 * Math.random())
			e.reply([segment.at(e.user_id),
			`\n🎉恭喜你获得了${energy_}点战斗力！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		} else if (hours >= 20 && hours <= 22 && e.msg.includes('早睡')) {
			e.group.muteMember(user_id, 60 * 60 * 8); //禁言
			energy_ = Math.round(3 + 3 * Math.random())
			e.reply([segment.at(e.user_id),
			`\n🎉早睡早起好习惯，恭喜你获得了${energy_}点战斗力！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		} else {
			energy_ = 1
			e.reply([segment.at(e.user_id),
			`\n由于睡太晚，你只获得了${energy_}点战斗力！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		}
		json[user_id].energy += energy_
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
		return true;
	}
}
schedule.scheduleJob('0 0 4 * * *', function () {//每日战斗力-1
	if (!fs.existsSync(dirpath)) {//如果文件夹不存在
		fs.mkdirSync(dirpath);//创建文件夹
	}
	if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
		}));
	}
	var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename));//读取文件
	for (let key in json) {//遍历json
		if (json[key].energy < 1) {
			json[key].energy = 0
		}
		if (json[key].energy >= 1) {
			json[key].energy--
		}
		if (json[key].energy < 15) {
			json[key].level = 0
			json[key].levels = '无境界'
		}
		else if (json[key].energy < 30) {
			json[key].level = 1
			json[key].levels = '小乘境初期'
		}
		else if (json[key].energy < 45) {
			json[key].level = 2
			json[key].levels = '小乘境中期'
		}
		else if (json[key].energy < 55) {
			json[key].level = 3
			json[key].levels = '小乘境后期'
		}
		else if (json[key].energy < 60) {
			json[key].level = 3
			json[key].levels = '小乘境巅峰'
		}
		else if (json[key].energy < 80) {
			json[key].level = 4
			json[key].levels = '大乘境初期'
		}
		else if (json[key].energy < 100) {
			json[key].level = 5
			json[key].levels = '大乘境中期'
		}
		else if (json[key].energy < 110) {
			json[key].level = 6
			json[key].levels = '大乘境后期'
		}
		else if (json[key].energy < 120) {
			json[key].level = 6
			json[key].levels = '大乘境巅峰'
		}
		else if (json[key].energy < 145) {
			json[key].level = 7
			json[key].levels = '宗师境初期'
		}
		else if (json[key].energy < 170) {
			json[key].level = 8
			json[key].levels = '宗师境中期'
		}
		else if (json[key].energy < 190) {
			json[key].level = 9
			json[key].levels = '宗师境后期'
		}
		else if (json[key].energy < 200) {
			json[key].level = 9
			json[key].levels = '宗师境巅峰'
		}
		else if (json[key].energy < 240) {
			json[key].level = 10
			json[key].levels = '至臻境初期'
		}
		else if (json[key].energy < 280) {
			json[key].level = 11
			json[key].levels = '至臻境中期'
		}
		else if (json[key].energy < 300) {
			json[key].level = 12
			json[key].levels = '至臻境后期'
		}
		else if (json[key].energy < 320) {
			json[key].level = 12
			json[key].levels = '至臻境巅峰'
		}
		else {
			json[key].level = 13
			json[key].levels = '返璞归真'
		}
	}
	fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
}
);
let time_ = String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 16) + 6) + ' * * *'////////////////////////////////////////////1.4更新
schedule.scheduleJob(time_, function () {
	let id = [];//这个是点赞名单,空则全部点赞
	let blacklist = [];//这个是不发送提示消息的黑名单，有的人怕被骚扰。
	let blacklist_id = [];//这个是黑名单id
	let delayed = 60000 + Math.floor(Math.random() * 60000);//这个是间隔时间///////////////////////////////////1.4更新
	let url = `https://api.iyk0.com/ecy/api.php`;//这个是接口,获取图片的。
	let words = ['今天派蒙给你点赞啦！', "你的喜欢是对我最大的支持！", "今天我帮你点赞了哦！"]
	var alllist = Bot.fl
	idlist = [];
	for (var key of alllist) {
		idlist.push(key[0])
		console.log(idlist)
	}
	//判断白名单模式还是全局模式
	if (id.length == 0) {
		console.log("判断id列表为空，已开启全局模式，即将点赞的列表为：", idlist)
	} else {
		var idlist = id;
		console.log("判断id列表不为空，已开启白名单模式，即将点赞的列表为：", idlist)
	}
	for (let i = 0; i < idlist.length; i++) {
		setTimeout(() => {
			console.log(`本次为第${i}次点赞，`, idlist[i], `正在点赞中...`)
			if (!blacklist_id.includes(idlist[i])) {
				//判断是否在黑名单中
				Bot.pickFriend(idlist[i]).thumbUp(10);
				console.log(`点赞成功`)
				let l = Math.floor(Math.random() * 100)
				if (!blacklist.includes(id[i]) || l < 20) {//这里是消息的触发概率
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
);