import fs from 'node:fs'
import YAML from 'yaml'
import { segment } from "oicq";
const _defpath = `./plugins/lin/config/lin.config.def.yaml`;
const configyamlpath = `./plugins/lin/config/lin.config.yaml`;
const configyamlbackpath = `./plugins/lin/config/lin.config.back.yaml`;
const _path = process.cwd().replace(/\\/g, '/');
let my = {};
export class getconfig extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '点赞',
            /** 功能描述 */
            dsc: '',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: "^#(强制)?重置lin配置$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'command'
                },
                {
                    /** 命令正则匹配 */
                    reg: "^#(发送|获取)?lin配置$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'getconfig'
                },
                {
                    /** 命令正则匹配 */
                    reg: "^#上传lin配置$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'uploadconfig'
                }
            ]
        })
    }
    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async command(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        if (!fs.existsSync(configyamlpath)) {//如果配置不存在，则复制一份默认配置到配置里面
            fs.copyFileSync(`${_defpath}`, `${configyamlpath}`);
            e.reply(`${configyamlpath}不存在配置，已经自动生成。`)
        }
        else {
            fs.copyFileSync(`${configyamlpath}`, `${configyamlbackpath}`);
            fs.copyFileSync(`${_defpath}`, `${configyamlpath}`);
            e.reply(`${configyamlpath}存在配置，已经自动重置并备份。`)
        }
    }
    async getconfig(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        if (!fs.existsSync(configyamlpath)) {
            e.reply(`${configyamlpath}不存在。`)
        }
        else {
            e.friend.sendFile(configyamlpath)
        }
    }
    async uploadconfig(e) {
        let name = global.Bot.nickname
        if (!e.isMaster) {
            e.reply(`只有主人才能命令${name}哦~`)
            return true;
        }
        if (!e.file) {
            if (my[e.user_id]) {
                clearTimeout(my[e.user_id]);
            }
            my[e.user_id] = setTimeout(() => {
                if (my[e.user_id]) {
                    delete my[e.user_id];
                }
                if (my["单次"]) {
                    delete my["单次"]
                }
                e.reply("操作超时，请重新发送安装指令哦")
            }, timeout * 1000);//等待yaml文件
            my["单次"] = true;

            e.reply([segment.at(e.user_id), " 请发送lin插件的config"]);
            return true;
        }

        my[e.user_id] = true;
        my["单次"] = true;
        if (my[e.user_id] && my["单次"]) {

            if (!e.file || !e.file.name.includes("yaml")) {
                e.reply([segment.at(e.user_id), '发送的不是yaml文件呢，已取消！'])
                cancel(e);
                return true;
            }

            if (e.message[0].size > 1024000) {
                cancel(e);
                e.reply("文件过大，已取消本次安装");
                return true;
            }
            cancel(e);
            if (!fs.existsSync(configyamlpath)) {
                fs.mkdirSync(configyamlpath);
            }
            //获取文件下载链接
            let fileUrl = await e.friend.getFileUrl(e.file.fid);
            //下载output_log.txt文件
            const response = await fetch(fileUrl);
            const streamPipeline = promisify(pipeline);
            await streamPipeline(response.body, fs.createWriteStream(configyamlpath));
            e.reply("配置已经下载到本地了呢~，你可以使用重启来应用！");
            return true;
            return true;
        } cancel(e);
        my[e.user_id] = setTimeout(() => {
            if (my[e.user_id]) {
                delete my[e.user_id];
            }
            if (my["批量"]) {
                delete my["批量"];
            }
            e.reply(`超过${timeout}秒未发送消息，批量安装已结束~`)
        }, timeout * 1000);//等待yaml文件
    }
}