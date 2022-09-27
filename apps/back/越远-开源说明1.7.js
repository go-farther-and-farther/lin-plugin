import { segment } from "oicq";
import fetch from "node-fetch";


// 使用方法：               无
//此插件为公益插件，宣传机器人的开源性质,越追越远2022.7.11编写，请大家多转发


// v1.1 无2022.7.11
// v1.2 修改触发规则2022.7.12
// v1.3 修改为随机触发，添加各种插件地址2022.7.12
// v1.4 更新了报错和随机触发2022.7.12
// v1.5 更新了内容2022.7.13
// v1.6 更新了概率2022.7.13
// v1.7更新黑名单2022.7.26
//项目路径
const _path = process.cwd();
let hmd1=[]//手动触发黑名单
let hmd2=[]//随机触发黑名单
let cailiao = [["BOT源代码是开源的",
"Yunzai-Bot官方群213938015",
"Yunzai-Bot解答群719834329",
"Yunzai-Bot开源代码网址https://gitee.com/Le-niao/Yunzai-Bot",
"Yunzai-Bot机器人安装教程https://www.bilibili.com/read/cv15119056",
"Yunzai-Bot图鉴插件来源https://gitee.com/Ctrlcvs/xiaoyao-cvs-plugin",
"Yunzai-Bot喵喵插件来源https://gitee.com/yoimiya-kokomi/miao-plugin",
'Yunzai-Bot插件列表https://github.com/HiArcadia/Yunzai-Bot-plugins-index']]


export const rule = {
  ci: {
    reg: "^(机器人怎么|bot).*$", //匹配消息正则，命令正则
    priority: 100, //优先级，越小优先度越高
    describe: "【机器人怎么搞】", //【命令】功能说明
  },
  sui: {
    reg: "", //匹配消息正则，命令正则
    priority: 100, //优先级，越小优先度越高
    describe: "", //【命令】功能说明
  },
};
//固定词条触发
export async function ci(e) {
  if (hmd1.includes(e.group_id)) {
    return;
  }
  let i = Math.round(Math.random() * (cailiao.length - 1));
  e.reply(cailiao[i]);
}


//随机触发式
export function sui(e) {
  if (hmd2.includes(e.group_id)) {
    return;
  }
  let k = Math.round(Math.random() * (cailiao.length - 1))
  let j = Math.floor(Math.random() * 1000)
  if (j < 2)//随机触发概率
    e.reply(cailiao[k]);
}