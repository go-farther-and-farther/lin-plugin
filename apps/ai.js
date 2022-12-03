import plugin from '../../../lib/plugins/plugin.js'
import fetch from "node-fetch";
import { segment } from "oicq";
import lodash from "lodash";
import command from '../components/command.js'
import fs from 'fs';

const BotName = global.Bot.nickname;
// 机器人名字，推荐不改(机器人如果换名字了需要重启来刷新)
var def_gailv = await command.getConfig("ai_cfg", "def_gailv");
var def_gailv_ = await command.getConfig("ai_cfg", "def_gailv_");
var def_ai_now = await command.getConfig("ai_cfg", "def_ai_now");
var def_onlyReplyAt = await command.getConfig("ai_cfg", "def_onlyReplyAt");
var def_open = await command.getConfig("ai_cfg", "def_open");
// 读yaml文件里面的设置的初始回复概率
//这两个是与概率有关的
var ai_api = await command.getConfig("ai_cfg", "ai_api");
var ai_name = await command.getConfig("ai_cfg", "ai_name");
var ai_nick = await command.getConfig("ai_cfg", "ai_nick");
//群聊是否只关注@信息
const dirpath = "plugins/lin-plugin/data";//文件夹路径
const filename = `ai.json`;//文件名
var Template = {//创建该用户
    "gailv": def_gailv,
    "open": def_open,
    "onlyReplyAt": def_onlyReplyAt,
    "ai_now": def_ai_now
};
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
        //---------------------------------------------------
        if (!fs.existsSync(dirpath)) {//如果文件夹不存在
            fs.mkdirSync(dirpath);//创建文件夹
        }
        if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
            fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
            }));
        }
        var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename, "utf8"));//读取文件
        if (e.isGroup) {
            var id = e.group_id
        }
        else if (e.isPrivate) {
            var id = e.user_id
        }
        if (!json.hasOwnProperty(id)) {//如果json中不存在该用户
            json[id] = Template
        }
        let gailv = json[id].gailv
        let open = json[id].open
        let onlyReplyAt = json[id].onlyReplyAt
        let ai_now = json[id].ai_now

        //---------------------------------------------------
        //一个控制ai回复概率的模块
        if (e.isMaster || e.member.is_owner || e.member.is_admin) {
            //控制接口-------------------------------------------
            let api_num = ai_api.length - 1//接口数量
            // 发送当前的接口名字
            if (e.msg.includes('ai设置接口') || e.msg.includes('设置ai接口') || e.msg.includes('切换ai接口')) {
                let message = e.msg.replace(/(ai设置接口|设置ai接口|切换ai接口|#)/g, "").replace(/[\n|\r]/g, "，").trim();//防止把内容里面的一下删了
                if (message <= api_num && message >= 1 && !isNaN(message))//判断是不是api个数里面的,是则返回
                {
                    ai_now = message - 1
                    e.reply(`已切换到${ai_now + 1}号接口${ai_name[ai_now]},接口链接已隐藏。`);
                }
                else {
                    e.reply(`接口序号${message}超出范围或不合规，目前总量${api_num}`)
                }
            }
            if (e.msg.includes('ai设置概率') || e.msg.includes('设置ai概率') || e.msg.includes('设置回复概率')) {
                if (!open) {
                    e.reply("ai已关闭,请先开启")
                }
                let msgsz = e.msg.replace(/(ai设置概率|设置ai概率|设置回复概率|#)/g, "").replace(/[\n|\r]/g, "，").trim()
                if (isNaN(msgsz)) {
                    e.reply(`${msgsz}不是有效值,请输入正确的数值`)
                }
                else {
                    if (msgsz > 100 || msgsz <= 0) {
                        e.reply("数值不在有效范围内,请输入0以上100以内的整数")
                    }
                    else {
                        let sz = Math.round(msgsz)
                        gailv = sz
                        e.reply(`已四舍五入设置ai触发概率：${gailv}%，`)
                    }
                }
            }
            if (e.msg.includes('ai关闭')) {
                if (!open) {
                    e.reply("ai已经是关闭状态了")
                }
                else{
                    open = false
                    e.reply("ai成功关闭")
                }
            }
            if (e.msg.includes('ai开启')) {
                if (!open) {
                    open = true
                    e.reply(`成功开启,目前ai触发概率为关闭时概率:${gailv}%!`)
                }
                else
                e.reply(`ai已经是开启状态了,不需要再开启一遍哦！`)
            }
           if (e.msg.includes('只关注@消息')) {
                onlyReplyAt = true;
                e.reply("好啦，现在只回复@消息了")
            }
            if (e.msg.includes('关注所有消息')) {
                onlyReplyAt = false;
                e.reply("现在我会关注每一条消息了")
            }
            if (e.msg == '太安静了') {
                if (open) {
                    if (gailv + def_gailv_ > 100) {
                        e.reply(`目前ai触发概率：${gailv}%，再加${def_gailv_}就溢出来了ヾ(≧▽≦*)o`)
                        return true;
                    }
                    gailv += def_gailv_;
                    e.reply(`概率提升，目前ai触发概率：${gailv}%，`)
                }
                else {
                    e.reply("ai是关闭状态,请先使用ai开启打开我ψ(｀∇´)ψ")
                }
            }
            if (e.msg == '太吵了') {
                //如果概率等于0
                if (!open) {
                    e.reply("ai已关闭,请先开启")
                }
                else {
                    if (gailv - def_gailv_ <= 0) {
                        e.reply(`目前ai触发概率：${gailv}%，再减${def_gailv_}就关掉了>_<`)
                    }
                    else {
                        gailv -= def_gailv_;
                        e.reply(`概率降低，目前ai触发概率：${gailv}%，`)
                    }
                }
            }
            //查看状态----------------------------------
            if (e.msg == "ai状态") {
                e.reply(`目前所在的私聊或群聊${id},\nai触发概率：${gailv}%,\n是否需要@${onlyReplyAt},\n正在使用${ai_name[ai_now]},\nai是否是开启状态${open}。`)
            }
            json[id].gailv = gailv
            json[id].open = open
            json[id].onlyReplyAt = onlyReplyAt
            json[id].ai_now = ai_now
            fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
        }
        if (e.msg.charAt(0) == '#') return false;
        //群聊是否需要消息中带有机器人昵称或者@机器人才触发
        if ((e.msg.includes(BotName) || e.atme || e.isPrivate || !onlyReplyAt) && gailv >= Math.round(Math.random() * 100)) {
            console.log("ai消息：", e.msg);
            //接收时将机器人名字替换为对应ai的名字

            let message = e.msg.trim().replace(eval(`/${BotName}/g`), `${ai_nick[ai_now]}`).replace(/[\n|\r]/g, "，");

            //抓取消息并转换为Json
            let postUrl = `${ai_api[ai_now]}${message}`;

            let response = await fetch(postUrl);

            let replyData = await response.json();//将返回的数据转化为json文件

            //******************************//
            // //将返回的数据转化为的json文件保存研究         
            // var date = new Date();
            // let filename = `ai_test_${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes}-${date.getSeconds}-ai.json`
            // if (!fs.existsSync(dirpath)) {//如果文件夹不存在
            //     fs.mkdirSync(dirpath);//创建文件夹
            // }
            // if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
            //     fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
            //     }));
            // }
            // fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(replyData, null, "\t"));//写入文件

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