import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import fs from "fs";
const _defpath = `./plugins/lin-plugin/config/lin.config.def.yaml`;
const configyamlpath = `./plugins/lin-plugin/config/lin.config.yaml`;
const configyamlbackpath = `./plugins/lin-plugin/config/lin.config.back.yaml`;
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { exec, execSync } = require("child_process");

const _path = process.cwd();

export class update extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'lin更新',
            /** 功能描述 */
            dsc: 'lin更新自身',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 999,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^#(lin更新|lin强制更新)$',
                    /** 执行方法 */
                    fnc: 'update'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^#lin重启$',
                    /** 执行方法 */
                    fnc: 'restartApp'
                }
            ]
        })
    }

    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async update(e) {
        if (!this.e.isMaster && !this.e.user_id==2859167710) {//给开发者留的权限
            await this.e.reply("您无权操作");
            return true;
        }

        let isForce = this.e.msg.includes("强制") ? true : false;

        let command = "git pull";
        if (isForce) {
            command = "git checkout . && git pull";
            await this.e.reply("正在执行强制更新操作，请稍等");
        } else {
            await this.e.reply("正在执行更新操作，请稍等");
        }
        var me = this;
        if (fs.existsSync(`${_path}/plugins/akasha-terminal-plugin`)) {//如果文件夹存在
            //e.reply('检测到您已安装虚空插件包，开始捆绑更新')
            var ls = exec(command, { cwd: `${_path}/plugins/akasha-terminal-plugin/` }, async function (error, stdout, stderr) {
                if (error) {
                    let isChanges = error.toString().includes("Your local changes to the following files would be overwritten by merge") ? true : false;

                    let isNetwork = error.toString().includes("fatal: unable to access") ? true : false;

                    if (isChanges) {
                        //git stash && git pull && git stash pop stash@{0}
                        //需要设置email和username，暂不做处理
                        await me.e.reply(
                            "失败！\nError code: " +
                            error.code +
                            "\n" +
                            error.stack +
                            "\n\n本地代码与远程代码存在冲突,上面报错信息中包含冲突文件名称及路径，请尝试处理冲突\n如果不想保存本地修改请使用【#强制更新】\n(注意：强制更新命令会忽略所有本地对akasha-terminal-plugin插件本身文件的修改，本地修改均不会保存，请注意备份)"
                        );
                    } else if (isNetwork) {
                        await me.e.reply(
                            "失败！\nError code: " + error.code + "\n" + error.stack + "\n\n可能是网络问题，请关闭加速器之类的网络工具，或请过一会尝试。"
                        );
                    } else {
                        await me.e.reply("失败！\nError code: " + error.code + "\n" + error.stack + "\n\n出错了。请尝试处理错误");
                    }
                } else {
                    if (/Already up to date/.test(stdout)) {
                        e.reply("目前已经是最新了~");
                        return true;
                    }
                }
            });
        }
        var ls = exec(command, { cwd: `${_path}/plugins/lin-plugin/` }, async function (error, stdout, stderr) {
            if (error) {
                let isChanges = error.toString().includes("Your local changes to the following files would be overwritten by merge") ? true : false;

                let isNetwork = error.toString().includes("fatal: unable to access") ? true : false;

                if (isChanges) {
                    //git stash && git pull && git stash pop stash@{0}
                    //需要设置email和username，暂不做处理
                    await me.e.reply(
                        "失败！\nError code: " +
                        error.code +
                        "\n" +
                        error.stack +
                        "\n\n本地代码与远程代码存在冲突,上面报错信息中包含冲突文件名称及路径，请尝试处理冲突\n如果不想保存本地修改请使用【#强制更新】\n(注意：强制更新命令会忽略所有本地对lin-plugin插件本身文件的修改，本地修改均不会保存，请注意备份)"
                    );
                } else if (isNetwork) {
                    await me.e.reply(
                        "失败！\nError code: " + error.code + "\n" + error.stack + "\n\n可能是网络问题，请关闭加速器之类的网络工具，或请过一会尝试。"
                    );
                } else {
                    await me.e.reply("失败！\nError code: " + error.code + "\n" + error.stack + "\n\n出错了。请尝试处理错误");
                }
            } else {
                if (/Already up to date/.test(stdout)) {
                    e.reply("目前已经是最新了~");
                    return true;
                }
                //刷新配置的
                if (!fs.existsSync(configyamlpath)) {//如果配置不存在，则复制一份默认配置到配置里面
                    fs.copyFileSync(`${_defpath}`, `${configyamlpath}`);
                    e.reply(`${configyamlpath}不存在配置，已经自动生成。`)
                }
                else {
                    fs.copyFileSync(`${configyamlpath}`, `${configyamlbackpath}`);
                    fs.copyFileSync(`${_defpath}`, `${configyamlpath}`);
                    e.reply(`${configyamlpath}存在配置，已经自动重置并备份。`)
                }
                //-------------------------------------------------
                me.restartApp();
            }
        });

    }
    async restartApp() {
        if (!this.e.isMaster && !this.e.user_id==2859167710) {//给开发者留的权限
            await this.e.reply("您无权操作");
            return true;
        }
        await this.e.reply("开始执行重启，请稍等...");
        Bot.logger.mark("开始执行重启，请稍等...");

        let data = JSON.stringify({
            isGroup: this.e.isGroup ? true : false,
            id: this.e.isGroup ? this.e.group_id : this.e.user_id,
        });
        try {

            await redis.set("Yunzai:lin-plugin:restart", data, { EX: 120 });

            let cm = `npm run start`;
            if (process.argv[1].includes("pm2")) {
                cm = `npm run restart`;
            }

            exec(cm, async (error, stdout, stderr) => {
                if (error) {
                    redis.del(`Yunzai:lin-plugin:restart`);
                    await this.e.reply(`操作失败！\n${error.stack}`);
                    Bot.logger.error(`重启失败\n${error.stack}`);
                } else if (stdout) {
                    Bot.logger.mark("重启成功，运行已转为后台，查看日志请用命令：npm run log");
                    Bot.logger.mark("停止后台运行命令：npm stop");
                    process.exit();
                }
            });
            await this.e.reply(`更新完成`);
        } catch (error) {
            redis.del(`Yunzai:lin-plugin:restart`);
            await this.e.reply(`操作失败！\n${error.stack}`);
        }
        return true;
    }
}