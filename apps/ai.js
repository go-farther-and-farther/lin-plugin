import plugin from '../../../lib/plugins/plugin.js'
import fetch from "node-fetch";
import { segment } from "oicq";
import lodash from "lodash";
import command from '../command/command.js'
//感谢前边所有版本的青云客作者
//@苏苏@dmhfd(1695037643);@Yoolan.
//项目路径
const BotName = global.Bot.nickname;
//机器人名字，推荐不改(机器人如果换名字了需要重启来刷新)
var gailv = await command.getConfig("ai_cfg", "gailv");
var gailv_ = await command.getConfig("ai_cfg", "gailv_");
//暂时还不能用
ai_api='http://api.qingyunke.com/api.php?key=free&appid=0&msg='
//var ai_api = await command.getConfig("ai_cfg", "ai_api");
var onlyReplyAt = true //群聊是否只关注@信息
var bad2good = {
    "傻逼": ["天使", "大可爱"],
    "去死": ["去玩", "去打电动"],
    "测试你妹": "测试"
};

//1.定义命令规则
String.prototype.beGood = function () {
    let output = this;
    for (let item in bad2good) {
        let get = "";
        //如果是数组则随机获取
        if (bad2good[item] instanceof Array) get = bad2good[item][lodash.random(item.length - 1)];
        else get = bad2good[item];
        output = output.replace(eval(`/${item}/g`), get);
    }
    //输出转化结果
    return output;
};
export class ai extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '青云客ai',
            /** 功能描述 */
            dsc: '调用青云客免费接口回答消息',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 12000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '',
                    /** 执行方法 */
                    fnc: 'qyk'
                }
            ]
        })
    }
    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async qyk(e) {
        //是否为文本消息和指令
        if (!e.msg || e.msg.charAt(0) == '#') return false;
        //e.msg 用户的命令消息
        console.log("用户命令：", e.msg);
        //一个控制ai回复概率的模块
        let j = Math.random();
        if (e.msg.includes('ai关闭')) {
            gailv = 0
            e.reply(`可以输入“太吵了”、“太安静了”、“ai开启”、“ai关闭”、“关注所有消息”、“只关注@信息”调节\n目前青云客ai触发概率：${(gailv * 100).toFixed(0)}%，是否只关注@信息：${onlyReplyAt}`)
        } else if (e.msg.includes('ai开启')) {
            gailv = await command.getConfig("qykai_cfg", "gailv");
            e.reply(`可以输入“太吵了”、“太安静了”、“ai开启”、“ai关闭”、“关注所有消息”、“只关注@信息”调节\n目前青云客ai触发概率：${(gailv * 100).toFixed(0)}%，是否只关注@信息：${onlyReplyAt}`)
        } else if (e.msg.includes('只关注@信息')) {
            onlyReplyAt = true;
            e.reply(`可以输入“太吵了”、“太安静了”、“ai开启”、“ai关闭”、“关注所有消息”、“只关注@信息”调节\n目前青云客ai触发概率：${(gailv * 100).toFixed(0)}%，是否只关注@信息：${onlyReplyAt}`)
        } else if (e.msg.includes('关注所有消息')) {
            onlyReplyAt = false;
            e.reply(`可以输入“太吵了”、“太安静了”、“ai开启”、“ai关闭”、“关注所有消息”、“只关注@信息”调节\n目前青云客ai触发概率：${(gailv * 100).toFixed(0)}%，是否只关注@信息：${onlyReplyAt}`)
        }
        else if (gailv == 0)
            return false
        if (e.msg.includes('太安静')) {
            //如果概率等于1
            if (gailv > 0.99) {
                //提示不能修改了
                gailv = 1
                e.reply("很吵了，不能修改了");
                return false;
            }
            gailv = gailv + gailv_;
            e.reply(`可以输入“太吵了”、“太安静了”、“ai开启”、“ai关闭”、“关注所有消息”、“只关注@信息”调节\n目前青云客ai触发概率：${(gailv * 100).toFixed(0)}%，是否只关注@信息：${onlyReplyAt}`)
            return false;
        }
        if (e.msg.includes('太吵')) {
            //如果概率等于0
            if (gailv < 0.01) {
                //提示不能修改了
                gailv = 0
                e.reply("很安静了，不能修改了");
                return false;
            }
            gailv = gailv - gailv_;
            e.reply(`可以输入“太吵了”、“太安静了”或者进入文件修改是否只关注@信息来调节\n目前青云客ai触发概率：${(gailv * 100).toFixed(0)}%，是否只关注@信息：${onlyReplyAt}`)
            return false;
        }
        if (j >= gailv)//ai的触发率
        {
            console.log("退出青云客ai");
            return false;
        }
        //群聊是否需要消息中带有机器人昵称或者@机器人才触发
        if (e.msg.includes(BotName) || (e.at && e.at == e.uin) || e.isPrivate || !onlyReplyAt) {
            console.log("青云客消息：", e.msg);
            //接收时将机器人名字替换为青云客AI的菲菲
            let message = e.msg.trim().replace(eval(`/${BotName}/g`), "菲菲").replace(/[\n|\r]/g, "，");
            let postUrl = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${message}`;
            //抓取消息并转换为Json
            let response = await fetch(postUrl);
            let replyData = await response.json();
            //处理消息
            let tempReplyMsg = [];
            let replyMsg = replyData.content.replace(/菲菲/g, BotName)
                .replace(/\{br\}/g, "\n")
                .replace(/&nbsp;/g, " ")
                .replace(/\{face:([\d]+)\}/g, "#face$1#[div]")
                //消息和谐处理
                .beGood()
                .trim();
            //表情处理
            if (replyMsg.includes("[div]")) {
                for (let item of replyMsg.split("[div]")) {
                    if (/#face[\d]+#/.test(item)) item = segment.face(item.replace(/#face([\d]+)#/, "$1"));
                    tempReplyMsg.push(item);
                }
            }
            //是否有表情
            if (tempReplyMsg && tempReplyMsg.length > 0) replyMsg = tempReplyMsg;
            //是否有消息输出
            if (replyMsg) {
                //设置了log: false; 好像是没有输出日志的
                logger.mark(`[青云客回复] ${e.msg}`);
                //发送消息
                e.reply(replyMsg, e.isGroup);
                //阻止继续匹配其他命令
                return true;
            }
            //返回false继续匹配其他命令
            return false;
            //Created by Yoolan.
        }
        else return false;
    }
}