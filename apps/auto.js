import { segment } from "oicq";
import schedule from "node-schedule";
//项目路径
const _path = process.cwd();

//越追越远（2859167710）编写于2022.7.15，特别感谢cvs，特别感谢苏苏，苏佬c佬yyds
//定时推 定时区分 (秒 分 时 日 月 星期) 
//1.2更新了黑名单
//1.3更新了延迟
//1.4随机延迟,每天早上6点多，随机点赞
let time_ = String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 60)) + ' ' + String(Math.floor(Math.random() * 16) + 6) + ' * * *'////////////////////////////////////////////1.4更新
schedule.scheduleJob(time_, function () {
    let id = [];//这个是点赞名单,空则全部点赞
    let blacklist = [];//这个是不发送提示消息的黑名单，有的人怕被骚扰。
    let blacklist_id = [];//这个是黑名单id
    let delayed = 60000 + Math.floor(Math.random() * 60000);//这个是间隔时间///////////////////////////////////1.4更新
    let url = `https://api.iyk0.com/ecy/api.php`;//这个是接口,获取图片的。
    let words = ['今天派蒙给你点赞啦！', "你的喜欢是对我最大的支持！", "今天我帮你点赞了哦！","喜不喜欢给你的这个壁纸啊？","不需要打卡了可以删除好友。"]
    var alllist = Bot.fl
    idlist = [];
    for (var key of alllist) {
        idlist.push(key[0])
        console.log(idlist)
    }
    //判断白名单模式还是全局模式
    if (id.length == 0) {
        console.log("判断id列表为空，已开启全局模式，即将点赞的列表为：", idlist)
    } else {
        var idlist = id;
        console.log("判断id列表不为空，已开启白名单模式，即将点赞的列表为：", idlist)
    }
    for (let i = 0; i < idlist.length; i++) {
        setTimeout(() => {
            console.log(`本次为第${i}次点赞，`, idlist[i], `正在点赞中...`)
            if (!blacklist_id.includes(idlist[i])) {
                //判断是否在黑名单中
                Bot.pickFriend(idlist[i]).thumbUp(10);
                console.log(`点赞成功`)
                let l = Math.floor(Math.random() * 100)
                if (!blacklist.includes(id[i])||l<30) {//这里是消息的触发概率
                    let msg = [
                        words[Math.floor(Math.random() * words.length)],
                        segment.image(url),
                    ];
                    Bot.pickUser(idlist[i]).sendMsg(msg)
                }
            }
        }, delayed * i);//设置延时
    }
}
);