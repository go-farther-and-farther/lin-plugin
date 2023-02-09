import fs from 'node:fs'
import { segment } from 'oicq'
const errorpath = `./logs/error.log`;
export class geterror extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'lin发送错误日志',
            /** 功能描述 */
            dsc: '',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: "^#(lin)?(发送|获取)?报错$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'geterror'
                }, {
                    /** 命令正则匹配 */
                    reg: "^#(lin)?(删除|重置|刷新|备份)报错$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'errorback'
                },
                {
                    /** 命令正则匹配 */
                    reg: "^#(lin)?(发送|获取)?日志(文件)?$", //匹配消息正则，命令正则
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
        if (!fs.existsSync(errorpath)) {
            e.reply(`${errorpath}不存在。`)
        }
        //上传文件
        e.reply("可以使用“#备份报错”以刷新报错")
        if (e.isGroup) {
            e.group.fs.upload(errorpath)
            return true;
        }
        if (e.isPrivate) {
            e.friend.sendFile(errorpath)
            return true;
        }
    }
    async getjournal(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        var date = new Date();
        let month = date.getMonth() + 1
        let dates = date.getDate()
        if (month == 1) month = '01'
        if (month == 2) month = '02'
        if (month == 3) month = '03'
        if (month == 4) month = '04'
        if (month == 5) month = '05'
        if (month == 6) month = '06'
        if (month == 7) month = '07'
        if (month == 8) month = '08'
        if (month == 9) month = '09'
        if (dates == 1) dates = '01'
        if (dates == 2) dates = '02'
        if (dates == 3) dates = '03'
        if (dates == 4) dates = '04'
        if (dates == 5) dates = '05'
        if (dates == 6) dates = '06'
        if (dates == 7) dates = '07'
        if (dates == 8) dates = '08'
        if (dates == 9) dates = '09'
        let journalpath = `./logs/command.${date.getFullYear()}-${month}-${dates}.log`
        if (!fs.existsSync(journalpath)) {
            e.reply(`${journalpath}不存在。`)
        }
        e.reply(`正在为您发送./logs/command.${date.getFullYear()}-${month}-${dates}.log`)
        if (e.isGroup) {
            e.group.fs.upload(journalpath)
            return true;
        }
        if (e.isPrivate) {
            e.friend.sendFile(journalpath)
            return true;
        }
    }
    async errorback(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        if (!fs.existsSync(errorpath)) {
            e.reply(`${errorpath}不存在报错文件。`)
        }
        else {
            var date = new Date();
            let month = date.getMonth() + 1
            let errorbackpath = `./logs/error.${date.getFullYear()}-${month}-${date.getDate()}back.log`
            fs.copyFileSync(`${errorpath}`, `${errorbackpath}`);
            e.reply(`${errorpath}存在报错，已经自动重置并备份。`)
            fs.unlink(errorpath, function (err) {
                if (err) {
                    throw err;
                }
                console.log('文件:' + errorpath + '删除成功！');
            })
        }
    }
}