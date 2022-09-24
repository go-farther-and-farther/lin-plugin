import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
//借鉴和学习了碎月的大佬的插件，勿喷
export class baidu extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '百度',
            /** 功能描述 */
            dsc: '调用青云客免费接口回答消息',
            /** https://www.baidu.com/s?wd= */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '#百度(一下)?(.*)',
                    /** 执行方法 */
                    fnc: 'baidu'
                }
            ]
        })
    }
    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async baidu(e) {
        console.log("百度的内容：", e.msg);
        //接收时将机器人名字替换为青云客AI的菲菲
        let message = e.msg.trim().replace('#百度一下', "").replace(/[\n|\r]/g, "，");//防止把内容里面的一下删了
        message = message.trim().replace('#百度', "").replace(/[\n|\r]/g, "，");
        let postUrl = `https://www.baidu.com/s?wd=${message}`;
        const puppeteer = require('puppeteer');

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
            ]
        });
        const page = await browser.newPage();
        await page.goto(postUrl);
        await page.setViewport({
            width: 1920,
            height: 1080
        });

        await this.reply(segment.image(await page.screenshot({
            fullPage: true
        })))

        await browser.close();

    }
}