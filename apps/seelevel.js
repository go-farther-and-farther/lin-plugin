import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import fs from "fs";
import schedule from "node-schedule";
//项目路径
let duelCD = {};
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
let Magnification = 1 //战斗力依赖系数，这个越大，战斗力意义越大
let Cooling_time = 300 //命令间隔时间，单位秒，这是决斗的冷却时间#初始为300秒
let Cooling_time2 = 300 //命令间隔时间，单位分钟，这是锻炼的冷却时间#初始为300分钟

export class seelevel extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: '我的境界',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#我的(境界|战斗力)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'seelevel'
				}, {
					/** 命令正则匹配 */
					reg: "^#决斗(规则|帮助)$", //匹配消息正则，命令正则
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
	async seelevel(e) {
		if (!fs.existsSync(dirpath)) {//如果文件夹不存在
			fs.mkdirSync(dirpath);//创建文件夹
		}
		if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
			}));
		}
		var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename, "utf8"));//读取文件
		if (json[e.user_id].energy < 1) {
			json[e.user_id].energy = 0
		}//当战斗力小于1时，自动归零
		if (json[e.user_id].energy < 15) {
			json[e.user_id].level = 0
			json[e.user_id].levels = '无境界'
		}
		else if (json[e.user_id].energy < 30) {
			json[e.user_id].level = 1
			json[e.user_id].levels = '小乘境初期'
		}
		else if (json[e.user_id].energy < 45) {
			json[e.user_id].level = 2
			json[e.user_id].levels = '小乘境中期'
		}
		else if (json[e.user_id].energy < 55) {
			json[e.user_id].level = 3
			json[e.user_id].levels = '小乘境后期'
		}
		else if (json[e.user_id].energy < 60) {
			json[e.user_id].level = 3
			json[e.user_id].levels = '小乘境巅峰'
		}
		else if (json[e.user_id].energy < 80) {
			json[e.user_id].level = 4
			json[e.user_id].levels = '大乘境初期'
		}
		else if (json[e.user_id].energy < 100) {
			json[e.user_id].level = 5
			json[e.user_id].levels = '大乘境中期'
		}
		else if (json[e.user_id].energy < 110) {
			json[e.user_id].level = 6
			json[e.user_id].levels = '大乘境后期'
		}
		else if (json[e.user_id].energy < 120) {
			json[e.user_id].level = 6
			json[e.user_id].levels = '大乘境巅峰'
		}
		else if (json[e.user_id].energy < 145) {
			json[e.user_id].level = 7
			json[e.user_id].levels = '宗师境初期'
		}
		else if (json[e.user_id].energy < 170) {
			json[e.user_id].level = 8
			json[e.user_id].levels = '宗师境中期'
		}
		else if (json[e.user_id].energy < 190) {
			json[e.user_id].level = 9
			json[e.user_id].levels = '宗师境后期'
		}
		else if (json[e.user_id].energy < 200) {
			json[e.user_id].level = 9
			json[e.user_id].levels = '宗师境巅峰'
		}
		else if (json[e.user_id].energy < 240) {
			json[e.user_id].level = 10
			json[e.user_id].levels = '至臻境初期'
		}
		else if (json[e.user_id].energy < 280) {
			json[e.user_id].level = 11
			json[e.user_id].levels = '至臻境中期'
		}
		else if (json[e.user_id].energy < 300) {
			json[e.user_id].level = 12
			json[e.user_id].levels = '至臻境后期'
		}
		else if (json[e.user_id].energy < 320) {
			json[e.user_id].level = 12
			json[e.user_id].levels = '至臻境巅峰'
		}
		else {
			json[e.user_id].level = 13
			json[e.user_id].levels = '返璞归真'
		}
		e.reply(`你的境界是${json[e.user_id].levels},你的战斗力是${json[e.user_id].energy}`)
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
		return
	}
	async rules(e) {
		e.reply(`指令：#御前决斗 #锻炼|早睡 #我的境界\n#设置半步管理员 #移除半步管理员\n挑战成功：自己战斗力-3，对方战斗力不变\n挑战失败：自己战斗力-1，对方战斗力-2\n战斗力每日自动-1`)
		return
	}
}