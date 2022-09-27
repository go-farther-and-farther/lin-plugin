import plugin from "../../lib/plugins/plugin.js";
import cfg from "../../lib/config/config.js";

/**
 * 注意，踢人需要机器人管理员身份，需要设置机器人为管理员
 */

export class newcomerplus extends plugin {
    constructor() {
        super({
            name: "退群后检测踢人",
            dsc: "退群后检测踢人",
            event: "notice.group.increase",
            priority: 4999,
        });
    }

    /** 接受到消息都会执行一次 */
    async accept() {
        let blackkey = `Yz:blackcomers:${this.e.group_id}`;

        let blackcomers = await redis.get(blackkey);

        const { blacks = [] } = blackcomers ? JSON.parse(blackcomers) : {};

        if (blacks.indexOf(this.e.user_id) !== -1) {
            setTimeout(async () => {
                await this.e.group.kickMember(this.e.user_id);
            }, 5000);
            await this.reply(
                "本群已开启退群不允许再次进入。检测到你退出过该群，5秒后将会对你移出本群"
            );
            return "return";
        }
    }
}

export class outNoticeplus extends plugin {
    constructor() {
        super({
            name: "退群不再允许加入",
            dsc: "退群不再允许加入",
            event: "notice.group.decrease",
            priority: 4999,
        });
    }

    async accept() {
        let blackkey = `Yz:blackcomers:${this.e.group_id}`;

        let blackcomers = await redis.get(blackkey);

        let blackcomersSet = new Set(blackcomers);

        blackcomersSet.add(this.e.user_id);

        await redis.set(
            blackkey,
            JSON.stringify({ blacks: Array.from(blackcomersSet) })
        );
    }
}

export class idmanage extends plugin {
    constructor() {
        super({
            name: "管理退群黑名单",
            dsc: "管理退群黑名单",
            event: "message.group",
            priority: 4999,
            rule: [
                {
                    reg: "^#清空退群黑名单",
                    fnc: "clear",
                    permission: "master",
                },
            ],
        });
    }

    async clear() {
        let blackkey = `Yz:blackcomers:${this.e.group_id}`;
        await redis.del(blackkey);
        await this.reply("已清空退群黑名单");
    }
}