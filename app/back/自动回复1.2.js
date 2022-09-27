import plugin from '../../../lib/plugins/plugin.js'
//这个插件你可以加一个后缀，多安装几个，例如自动回复1.1-原神YunzaiBot群，用于不同的群。
//1.1： 2022.7.23越追越远学习派蒙语音3.0，自动点赞，撤回监听改编
//1.2： 修复了bug

let 完全匹配 = false; //是否完全匹配 true:完全 false:只要有这个词
const hmd_userqq = []; //对于某用户黑名单 ,隔开
//！！！！！！！！！！！！！！！！！！！！！！！！
const bmd_GroupQQ = []; //需要使用的群的白名单 ,隔开，没有则全局
//！！！！！！！！！！！！！！！！！！！！！！！！
let alllist = Bot.gl
var bmd = bmd_GroupQQ
bmd = [];
// 匹配列表
// 可以使用|分割关键词
let 匹配列表 = [
  { 关键词: "自动回复|回复", 发送的内容: ["我可以自动回复哦!", "我会自动回复哦！"] },
  { 关键词: "测试", 发送的内容: ["收到"] },
];

//判断白名单列表为空，已开启全局模式
if (bmd_GroupQQ.length == 0)
  for (var key of alllist) {
    bmd.push(key[0])
  }
// 正则
export class example extends plugin {
  constructor() {
    super({
      name: '回复',
      dsc: '群里自动回复萌新好工具',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 10005,
      rule: [{
        /** 命令正则匹配 */
        reg: '',
        /** 执行方法 */
        fnc: 'relpy1'
      }]
    })
  }
  reply1(e) {
    e.reply('收到')
    if (!bmd.includes(e.group_id)) {
      return;
    }
    if (hmd_userqq.includes(e.user_id)) {
      return;
    }
    if (e.msg) {
      for (var 子项 of 匹配列表) {
        // console.log(子项.关键词);
        if (完全匹配) {
          // 需要分割关键词
          if (子项.关键词.indexOf("|") !== -1) {
            // 判断是否存在
            let 存在 = 子项.关键词.split("|").some((i) => {
              if (e.msg === i) {
                return true;
              }
            });
            if (存在) {
              发出内容(e, 子项);
              return true;
            }
          } else {
            // 不需要分割关键词
            if (子项.关键词 === e.msg) {
              发出内容(e, 子项);
              return true;
            }
          }
        } else if (!完全匹配) {
          // 需要分割关键词
          if (子项.关键词.indexOf("|") !== -1) {
            // 判断是否存在
            let 存在 = 子项.关键词.split("|").some((i) => {
              if (e.msg.indexOf(i) !== -1) {
                return true;
              }
            });
            if (存在) {
              发出内容(e, 子项);
              return true;
            }
          } else {
            // 不需要分割关键词
            if (e.msg.indexOf(子项.关键词) !== -1) {
              发出内容(e, 子项);
              return true;
            }
          }
        }
      }
    }
  }
  发出内容(e, 子项) {
    e.reply(子项.发送的内容[Math.floor(Math.random() * 子项.发送的内容.length)]);
  }
}
