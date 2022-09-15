import fs from 'node:fs'
import YAML from 'yaml'
const _defpath = `./plugins/lin/config/lin.something.def.yaml`;
const somethingyamlpath = `./plugins/lin/config/lin.something.yaml`;
const somethingyamlbackpath = `./plugins/lin/config/lin.something..yaml`;
const _path = process.cwd().replace(/\\/g, '/');

export class command extends plugin {
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
                    reg: "^#lin(强制)?重置配置$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'command'
                }
            ]
        })
    }
    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async command(e) {
        if (!fs.existsSync(somethingyamlpath)) {//如果配置不存在，则复制一份默认配置到配置里面
            fs.copyFileSync(`${_defpath}`, `${somethingyamlpath}`);
            e.reply(`${somethingyamlpath}不存在配置，已经自动生成。`)
        }
        else {
            fs.copyFileSync(`${somethingyamlpath}`, `${somethingyamlbackpath}`);
            e.reply(`${somethingyamlpath}存在配置，已经自动重置并备份。`)
        }
    }
}
