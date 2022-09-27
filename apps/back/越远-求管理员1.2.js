import { segment } from "oicq";
const _path = process.cwd();
//越追越远写的插件
//1.1 请求管理员插件
//1.2 自己是管理员了，就不吵了
let adminwqpp = false; //是否adminwqpp true:完全 false:只要有这个词
const qhmd_userqq = []; //对于某用户黑名单 ,隔开
//！！！！！！！！！！！！！！！！！！！！！！！！
const qbmd_GroupQQ = []; //需要使用的群的名单 ,隔开，没有则全局
//！！！！！！！！！！！！！！！！！！！！！！！！
let alllist = Bot.gl
var bmd = qbmd_GroupQQ
bmd = [];
// pplist
// 可以使用|分割关键词
let pplist = [
  {
    gjc: "管理员", qadminword: ["群主给我一个管理员吧，求求了！", "群主我也想当管理员！",
      "群主给我一个管理员吧，我很有用的！", "群主给我一个管理员吧，我会禁言那些不听话的小家伙哦！",
      "群主给我一个管理员吧，我会帮群友撤回不当言论哦！"]
  },
];

//判断白名单列表为空，已开启全局模式
if (qbmd_GroupQQ.length == 0)
  for (var key of alllist) {
    bmd.push(key[0])
  }
// 正则
export const rule = {
  admin: {
    reg: "noCheck", //匹配消息正则，命令正则
    priority: 10005, //优先级，越小优先度越高，这个等级低于表情的等级！！！
    describe: "书", //【命令】功能说明
  },
};

export function ad(e) {
  if (Bot.pickGroup(e.group_id).is_owner) { 
    return;
  }
  if (Bot.pickGroup(e.group_id).is_admin) { 
    return;
  }
  if (!bmd.includes(e.group_id)) {
    return;
  }
  if (qhmd_userqq.includes(e.user_id)) {
    return;
  }
  if (e.msg) {
    for (var son of pplist) {
      // console.log(son.关键词);
      if (adminwqpp) {
        // 需要分割关键词
        if (son.gjc.indexOf("|") !== -1) {
          // 判断是否存在
          let 存在 = son.gjc.split("|").some((i) => {
            if (e.msg === i) {
              return true;
            }
          });
          if (存在) {
            qadmin(e, son);
            return true;
          }
        } else {
          // 不需要分割关键词
          if (son.gjc === e.msg) {
            qadmin(e, son);
            return true;
          }
        }
      } else if (!adminwqpp) {
        // 需要分割关键词
        if (son.gjc.indexOf("|") !== -1) {
          // 判断是否存在
          let 存在 = son.gjc.split("|").some((i) => {
            if (e.msg.indexOf(i) !== -1) {
              return true;
            }
          });
          if (存在) {
            qadmin(e, son);
            return true;
          }
        } else {
          // 不需要分割关键词
          if (e.msg.indexOf(son.gjc) !== -1) {
            qadmin(e, son);
            return true;
          }
        }
      }
    }
  }
}
function qadmin(e, son) {
  e.reply(son.qadminword[Math.floor(Math.random() * son.qadminword.length)]);
}
//这个可以用来发文件，我注释掉了
//function 发出语音(e, son) {
//  e.reply(segment.record(`${_path}/resources/reply` + son.qadminword[Math.floor(Math.random() * son.qadminword.length)]));
//}