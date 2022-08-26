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

export class duel extends plugin {//决斗
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
					reg: "^#*(发起|开始|和我|与我|御前)决斗(.*)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'duel'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	//e.msg 用户的命令消息
	async duel(e) {
		console.log("用户命令：", e.msg);
		//检查是否有必要权限
		if (!e.group.is_admin) { //检查是否为管理员
			e.reply('我不是管理员，不能主持御前决斗啦~');
			return true;
		}
		if (!e.at) {
			e.reply('不知道你要与谁决斗哦，请@你想决斗的人~');
			return true;
		}
		if (e.at == BotConfig.account.qq) {
			e.group.muteMember(e.user_id, 1);
			e.reply([segment.at(e.user_id), `\n你什么意思？举办了`]);
			return true
		}
		//判定双方存在管理员或群主则结束
		if (e.sender.role == "owner" || e.sender.role == "admin" || e.group.pickMember(e.at).is_owner || e.group.pickMember(e.at).is_admin) {//判定双方是否存在管理员或群主
			e.reply("你们之中有人是管理员，游戏不公平，御前决斗无法进行哦")
			return true
		}
		let user_id = e.user_id;
		let user_id2 = e.at; //获取当前at的那个人
		if (user_id == user_id2) { //判定是否为自己
			e.group.muteMember(e.user_id, 1);
			e.reply([segment.at(e.user_id), `\n...好吧，成全你`]);
			return true;
		}
		if (duelCD[e.user_id]) { //判定是否在冷却中
			e.reply(`你刚刚发起了一场决斗，请耐心一点，等待${Cooling_time}秒后再次决斗吧！`);
			return true;
		}
		let user_id2_nickname = null
		for (let msg of e.message) { //赋值给user_id2_nickname
			if (msg.type === 'at') {
				user_id2_nickname = msg.text//获取at的那个人的昵称
				break;
			}
		}
		duelCD[e.user_id] = true;
		duelCD[e.user_id] = setTimeout(() => {//冷却时间
			if (duelCD[e.user_id]) {
				delete duelCD[e.user_id];
			}
		}, Cooling_time * 1000);
		if (!fs.existsSync(dirpath)) {//如果文件夹不存在
			fs.mkdirSync(dirpath);//创建文件夹
		}
		if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
			}));
		}
		var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename, "utf8"));//读取文件
		if (!json.hasOwnProperty(user_id)) {//如果json中不存在该用户
			json[e.user_id] = Template
		}
		if (!json.hasOwnProperty(user_id2)) {//如果json中不存在该用户
			json[user_id2] = Template
		}

		let level = json[user_id].level
		let energy = json[user_id].energy
		let level2 = json[user_id2].level
		let energy2 = json[user_id2].energy
		//计算实时战斗力的影响,等级在1-13级之间
		//  随机加成部分    +      境界加成部分 * 战斗力 * 随机发挥效果 //最大战斗力差为18*1.5*energy
		let i = Math.random() * 100 + (level + 5) * energy * (0.5 + Math.random()) * 0.1 * Magnification
		let j = Math.random() * 100 + (level2 + 5) * energy2 * (0.5 + Math.random()) * 0.1 * Magnification
		e.reply([segment.at(e.user_id),
		`\n你的境界为${json[user_id].levels}\n${user_id2_nickname}的境界是${json[user_id2].levels}\n决斗开始！`]);//发送消息
		if ((i > j && !json[user_id2].Privilege == 1) || json[user_id].Privilege == 1) {//判断是否成功
			json[user_id].energy -= 3
			setTimeout(() => {
				let k = Math.round((i - j) / 60)
				if (k < 0) {
					k = 1
				}
				i = Math.round(i)
				j = Math.round(j)
				e.group.muteMember(user_id2, (k + 1) * 60); //禁言
				e.reply([segment.at(e.user_id),
				`你实际发挥战斗力${i},${user_id2_nickname}实际发挥战斗力${j}\n🎉恭喜你与${user_id2_nickname}决斗成功。\n🎁${user_id2_nickname}已被禁言${k}分钟！`]);//发送消息
			}, 5000);//设置延时
		}
		else {
			json[user_id].energy--
			json[user_id2].energy -= 2
			setTimeout(() => {
				let k = Math.round((j - i) / 60)
				i = Math.round(i)
				j = Math.round(j)
				e.group.muteMember(user_id, (k + 1) * 60); //禁言
				e.reply([segment.at(e.user_id), `你实际发挥战斗力${i},${user_id2_nickname}实际发挥战斗力${j}\n你与${user_id2_nickname}决斗失败。\n您已被禁言${k}分钟！`]);//发送消息
			}, 5000);//设置延时
		}//战斗力小于0时候重置战斗力
		if (json[user_id].energy < 0) { json[user_id].energy = 0 }
		if (json[user_id2].energy < 0) { json[user_id2].energy = 0 }
		console.log(`发起者：${user_id}被动者： ${user_id2}随机时间：${i}秒钟`); //输出日志
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
		return true; //返回true 阻挡消息不再往下}

	}
}