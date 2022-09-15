import fs from 'node:fs'
import { segment } from 'oicq'
const errorpath = `./logs/error.log`;

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
        if (!fs.existsSync(errorpath)) {//如果配置不存在，则复制一份默认配置到配置里面
            e.reply(`${errorpath}不存在。`)
        }
        else {
            e.friend.sendFile(errorpath)
        }
    }
}