import plugin from '../../../lib/plugins/plugin.js'
import fetch from "node-fetch";
import { segment } from "oicq";
import lodash from "lodash";
import command from '../command/command.js'
import fs from 'fs';
const dirpath = "plugins/lin-plugin/data/test";//文件夹路径

const BotName = global.Bot.nickname;
// 机器人名字，推荐不改(机器人如果换名字了需要重启来刷新)
var gailv = await command.getConfig("ai_cfg", "gailv");
var gailv_ = await command.getConfig("ai_cfg", "gailv_");
// 读yaml文件里面的设置的初始回复概率
var sz = "";
var msgsz = "";
//这两个是与概率有关的
var ai_api = await command.getConfig("ai_cfg", "ai_api");
var ai_name = await command.getConfig("ai_cfg", "ai_name");
var ai_nick = await command.getConfig("ai_cfg", "ai_nick");
// 读取api接口
var ai_now = 0;//正在用的接口
// 定义现在正在用的接口赋初值
var onlyReplyAt = true
//群聊是否只关注@信息



var bad2good = {
    "傻逼": ["天使", "大可爱"],
    "去死": ["去玩", "去打电动"],
    "测试你妹": "测试"
};
//这是有关
String.prototype.beGood = function () {
    let output = this;
    for (let item in bad2good) {
        let get = "";
        //如果是数组则随机获取
        if (bad2good[item] instanceof Array) get = bad2good[item][lodash.random(item.length - 1)];
        else get = bad2good[item];
        //把不好的item和好的get调换
        output = output.replace(eval(`/${item}/g`), get);
    }
    //输出转化结果
    return output;
};

export class ai extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'LinAI',
            /** 功能描述 */
            dsc: '调用免费接口回答消息',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 66666,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '',
                    /** 执行方法 */
                    fnc: 'ai',
                    log: false
                }
            ]
        })
    }
    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async ai(e) {
        //是否为文本消息和指令
        if (!e.msg) return false;
        //e.msg 用户的命令消息
        console.log("用户命令：", e.msg);
        //一个控制ai回复概率的模块
        if (e.isMaster) {
            //控制接口-------------------------------------------
            let num = ai_api.length - 1
            // 发送当前的接口名字
            if (e.msg.includes('ai设置接口') || e.msg.includes('设置ai接口') || e.msg.includes('切换ai接口')) {
                let message = e.msg.replace(/(ai设置接口|设置ai接口|切换ai接口|#)/g, "").replace(/[\n|\r]/g, "，").trim();//防止把内容里面的一下删了
                if (message <= num && message >= 1 && !isNaN(message))//判断是不是api个数里面的,是则返回
                {
                    ai_now = message - 1
                    e.reply(`已切换到${ai_now + 1}号接口${ai_name[ai_now]},接口链接已隐藏。`);
                }
                else {
                    e.reply(`接口序号${message}超出范围或不合规，目前总量${num}`)
                }
                return true;
            }
            //设置概率-----------------------------------------
            if (e.msg.includes('ai设置概率') || e.msg.includes('设置ai概率') || e.msg.includes('设置回复概率')) {
                if (gailv < 0) {
                    e.reply("ai已关闭,请先开启")
                    return true;
                }
                msgsz = e.msg.replace(/(ai设置概率|设置ai概率|设置回复概率|#)/g, "").replace(/[\n|\r]/g, "，").trim()
                if (isNaN(msgsz)) {
                    e.reply(`${msgsz}不是有效值,请输入正确的数值`)
                }
                else {
                    if (msgsz > 100 || msgsz <= 0) {
                        e.reply("数值不在有效范围内,请输入0以上100以内的整数")
                    }
                    else {
                        sz = Math.round(msgsz)
                        gailv = sz
                        e.reply(`已四舍五入设置ai触发概率：${gailv}%，`)
                    }
                }
                return true;
            }
            if (e.msg.includes('ai关闭')) {
                if (gailv <= 10) {
                    e.reply("ai已经是关闭状态了")
                    return true;
                }
                gailv = 0
                e.reply("ai已关闭")
                return true;
            }
            if (e.msg.includes('ai开启')) {
                if (gailv == 0) {
                    e.reply(`已经是开启状态了,目前ai触发概率：${gailv}%，`)
                    return true;
                }
                gailv = 50
                e.reply("ai已开启。概率为50％")
                return true;
            }

            if (e.msg.includes('ai只关注@消息')) {
                onlyReplyAt = true;
                e.reply("好啦，现在只回复@消息了")
                return true;
            }
            if (e.msg.includes('ai关注所有消息')) {
                onlyReplyAt = false;
                e.reply("现在我会关注每一条消息了")
                return true;
            }
            if (e.msg == '太安静了') {
                //如果概率等于1
                if (gailv <= 0) {
                    e.reply("ai已关闭,请先开启")
                    return true;
                }
                if (gailv == 100) {
                    //提示不能修改了
                    e.reply("概率100％了，不能再加了！");
                    return true;;
                }
                else {
                    gailv += gailv_;
                    e.reply(`概率提升，目前ai触发概率：${gailv}%，`)
                    return true;
                }
            }
            else
                if (e.msg == '太吵了') {
                    //如果概率等于0
                    if (gailv > 0) {
                        e.reply("ai已关闭,请先开启")
                        return true;
                    }
                    if (gailv == 10) {
                        //提示不能修改了
                        e.reply("很安静了，再改就关掉了>_<");
                        return true;
                    }
                    else {
                        gailv -= gailv_;
                        e.reply(`概率降低，目前ai触发概率：${gailv}%，`)
                        return true;
                    }
                }
            //查看状态----------------------------------
            if (e.msg.includes('ai状态')) {
                e.reply(`目前ai触发概率：${gailv}%,是否需要@${onlyReplyAt},正在使用${ai_name[ai_now]}`)
            }
        }
        if (e.msg.charAt(0) == '#') return false;
        let b = Math.round(Math.random() * 100)
        //群聊是否需要消息中带有机器人昵称或者@机器人才触发
        if ((e.msg.includes(BotName) || e.atme || e.isPrivate || !onlyReplyAt) && gailv >= b) {
            console.log("ai消息：", e.msg);
            //接收时将机器人名字替换为青云客AI的菲菲


            let message = e.msg.trim().replace(eval(`/${BotName}/g`), "菲菲").replace(/[\n|\r]/g, "，");
            //这里需要处理一下，先埋个坑


            //抓取消息并转换为Json
            let postUrl = `${ai_api[ai_now]}${message}`;

            let response = await fetch(postUrl);

            let replyData = await response.json();//将返回的数据转化为json文件


            //******************************//
            //将返回的数据转化为的json文件保存研究         
            var date = new Date();
            let filename = `ai_test_${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes}-${date.getSeconds}-ai.json`
            if (!fs.existsSync(dirpath)) {//如果文件夹不存在
                fs.mkdirSync(dirpath);//创建文件夹
            }
            if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
                fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
                }));
            }
            fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(replyData, null, "\t"));//写入文件


            let replyMsg = [];//这个保存返回信息里面的文本文件
            replyData = JSON.stringify(replyData) //转换字符串用于判断返回值
            if (replyData) {
                //匹配不同ai接口返回规则:cv自c佬自定义ai.js
                if (replyData.indexOf("result") != -1) {
                    replyMsg.push(JSON.parse(replyData).content)
                } else if (replyData.indexOf("desc") != -1) {
                    replyMsg.push(JSON.parse(replyData).data.desc)
                } else if (replyData.indexOf("info") != -1) {
                    replyMsg.push(JSON.parse(replyData).data.info.text)
                } else if (replyData.indexOf("text") != -1 && replyData.indexOf("mp3") != -1) {
                    replyMsg.push(JSON.parse(replyData).text)
                } else if (replyData.indexOf("code") != -1 && replyData.indexOf("text") != -1) {
                    replyMsg.push(JSON.parse(replyData).text)
                }
            }

            //处理消息
            let tempReplyMsg = [];
            replyMsg = replyMsg.join(",").replace(/(夸克宝宝|菲菲|小思|小爱|琪琪|吴珂)/g, BotName)
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
                logger.mark(`[${ai_name[ai_now]}回复] ${e.msg}`);
                //发送消息
                e.reply(replyMsg, e.isGroup);
                //阻止继续匹配其他命令
                return true;
            }
            //返回false继续匹配其他命令
            else { return false; }
        }
    }
}