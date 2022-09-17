import fs from 'node:fs'
import { segment } from 'oicq'
const errorpath = `./logs/error.log`;
const date = new Date();
export class geterror extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '发送错误日志',
            /** 功能描述 */
            dsc: '',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: "^#lin(发送|获取)?报错$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'geterror'
                }, {
                    /** 命令正则匹配 */
                    reg: "^#lin(删除|重置|刷新|备份)?报错$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'errorback'
                },
                {
                    /** 命令正则匹配 */
                    reg: "^#lin(发送|获取)?日志$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'getjournal'
                }
            ]
        })
    }
    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async geterror(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        if (e.isGroup) {
            e.reply("请主人私聊我哦！")
            return true;
        }
        if (!fs.existsSync(errorpath)) {
            e.reply(`${errorpath}不存在。`)
        }
        else {
            e.friend.sendFile(errorpath)
        }
    }
    async getjournal(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        if (e.isGroup) {
            e.reply("请主人私聊我哦！")
            return true;
        }
        let journalpath = `./logs/command.${date.getFullYear}` + `-${date.getMonth}-` + `${date.getDate}.log`
        if (!fs.existsSync(journalpath)) {
            e.reply(`${journalpath}不存在。`)
        }
        else {
            e.friend.sendFile(journalpath)
        }
    }
    async errorback(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        if (e.isGroup) {
            e.reply("请主人私聊我哦！")
            return true;
        }
        if (!fs.existsSync(errorpath)) {
            e.reply(`${errorpath}不存在报错文件。`)
        }
        else {
            let errorbackpath = `./logs/error.` + date + `.back.log`
            fs.copyFileSync(`${errorpath}`, `${errorbackpath}`);
            e.reply(`${configyamlpath}存在配置，已经自动重置并备份。`)
            fs.unlink(errorpath, function (err) {
                if (err) {
                    throw err;
                }
                console.log('文件:' + errorpath + '删除成功！');
            })
        }
    }
}