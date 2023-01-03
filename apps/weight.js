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
        for (let i of qq) {
            let url = `http://tc.tfkapi.top/API/qqqz.php?type=json&qq=${i}`;//听风客的接口

            // QQ：2859167710
            // 查询状态：查询成功
            // 权重：3752
            // 权重越低越容易封号，权重低时别涩涩啦喵~

            let response = await fetch(url);
            let res = await response.json();
            let msg = [
                `QQ：${i}\n`,
                "查询状态：", segment.text(res.msg), "\n",
                "权重：", segment.text(res.qz), "\n",
                "权重越低越容易封号，权重低时别涩涩啦"
            ];
            if (i == Bot.uin) {
                msg = [
                    "我的权重：", segment.text(res.qz), "\n",
                    "权重越低越容易封号，权重低时别涩涩啦"
                ];
            }
            //发出消息
            await e.reply(msg);

            let json = []
            let template = {
            }
            json = await lin_data.getuser2(i, json, `weight`, template, false)
            let list = Object.keys(json)
            let num = list.length
            json[num] = {
                time: currentTime,
                weight: res.qz
            }
            json = await lin_data.getuser2(i, json, `weight`, template, true)
        }
        return true; //返回true 阻挡消息不再往下
    }
}