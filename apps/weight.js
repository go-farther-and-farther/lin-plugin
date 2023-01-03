import { segment } from "oicq";
import fetch from "node-fetch";
import lodash from 'lodash'
import plugin from '../../../lib/plugins/plugin.js'
import lin_data from '../components/lin_data.js';
import moment from "moment"

const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
export class weight extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '查QQ权重',
            /** 功能描述 */
            dsc: '简单开发示例',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 50000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: "^#*查权重(.*)$",
                    /** 执行方法 */
                    fnc: 'weight'
                },
            ]
        })
    }

    //执行方法
    async weight(e) {
        let qq = e.message.filter(item => item.type == 'at')?.map(item => item?.qq)
        console.log(qq);
        if (lodash.isEmpty(qq)) {
            qq = e.msg.match(/\d+/g)
        }
        if (!qq) { qq = [e.user_id] }
        qq.push(Bot.uin)
        let msg = ''
        for (let i of qq) {
            let url = `http://tc.tfkapi.top/API/qqqz.php?type=json&qq=${i}`;//听风客的接口

            // QQ：2859167710
            // 查询状态：查询成功
            // 权重：3752
            // 权重越低越容易封号，权重低时别涩涩啦喵~

            let response = await fetch(url);
            let res = await response.json();
            let json = []
            let template = {
            }
            json = await lin_data.getuser2(i, json, `weight`, template, false)
            if (i == Bot.uin) {
                msg = msg + `我的权重：${res.qz}\n记得爱护我哦！`;
            }
            else {
                msg = msg + `QQ：${i}\n查询状态： ${res.msg}\n权重：${res.qz}\n权重越低越容易封号，权重低时别涩涩啦\n`;
                if (json[date - 1].weight) {
                    msg = msg + `昨日权重：${json[date - 1].weight}`
                }
            }
            //发出消息
            

            let date = new Date();
            let month = date.getMonth() + 1
            json[date] = {
                time: currentTime,
                weight: res.qz
            }
            json = await lin_data.getuser2(i, json, `weight`, template, true)
        }
        await e.reply(msg);
        return true; //返回true 阻挡消息不再往下
    }
}