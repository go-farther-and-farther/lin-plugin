import { segment } from "oicq";
import fetch from "node-fetch";
import schedule from "node-schedule";
import moment from "moment";
import fs from "fs";
import { promisify } from "util";
import { pipeline } from "stream";

//By越追越远【未经授权，不得转载】
//致谢：@苏苏@渔佬：提供关键方法与思路，解决致命问题，@c佬：解决致命问题

//如果报错请删除Yunzai/data/目录中lin文件夹

var dirpath = "data/lin/";//文件夹路径
var filename = `mine`;//文件名
var dateTime = 'YYYY-MM-DD 00:00:00';//默认日期时间格式
var catCD = {};//挖矿 CD
var keyname = ''

export const rule = {
  mining: {
    reg: "^(.*)挖矿(.*)$",
    priority: 999,
    describe: "【#挖矿】 ",
  },
  Fightmonsters: {
    reg: "^(.*)锄地(.*)$",
    priority: 999,
    describe: "【锄地】",
  },
  list: {
    reg: "^(.*)(锄地|挖矿)列表(.*)$",
    priority: 999,
    describe: "【#锄地帮助】发出锄地列表 ",
  },
  help: {
    reg: "^(.*)(锄地|挖矿)帮助(.*)$",
    priority: 999,
    describe: "【#锄地帮助】发出锄地帮助 ",
  },
};

schedule.scheduleJob('0 0 * * * *', function () {//1小时执行一次
  if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
    filename = filename + ".json";//添加.json
  }
  if (!fs.existsSync(dirpath)) {//如果文件夹不存在
    fs.mkdirSync(dirpath);//创建文件夹
  }
  if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
    }));
  }
  var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename));//读取文件
  for (let key in json) {//遍历json
    json[key].Crystalminecd++;//距离上次挖矿时间
  }
  fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
}
);
schedule.scheduleJob('0 0 4 * * *', function () {//每天四点刷新
  if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
    filename = filename + ".json";//添加.json
  }
  if (!fs.existsSync(dirpath)) {//如果文件夹不存在
    fs.mkdirSync(dirpath);//创建文件夹
  }
  if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
    }));
  }
  var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename));//读取文件
  for (let key in json) {//遍历json
    json[key].Monstercd++;//距离上次锄地时间
  }
  fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
}
);


export async function Fightmonsters(e) {
  if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
    filename = filename + ".json";//添加.json
  }
  if (!fs.existsSync(dirpath)) {//如果文件夹不存在
    fs.mkdirSync(dirpath);//创建文件夹
  }
  if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
    }));
  }

  var json = fs.readFileSync(dirpath + "/" + filename, "utf8");//读取文件
  if (!JSON.parse(json).hasOwnProperty(e.user_id)) {//如果json中不存在该用户
    json = JSON.parse(json);//转换为json
    json[e.user_id] = {//创建该用户
      "Crystalminecd": 0,
      "Monstercd": 0,
      'id': e.user_id,
    };
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
  }
  json = JSON.parse(json);//转换为json
  json[e.user_id].id = e.user_id;
  if (json[e.user_id].Monstercd >= 1) {
    e.reply(`距离上次锄地时间${json[e.user_id].Monstercd}小时，锄地成功，锄地时间刷新了！`)
    json[e.user_id].Monstercd = 0;//距离上次锄地时间
  }
  if (json[e.user_id].Monstercd < 1) { e.reply(`距离上次锄地时间${json[e.user_id].Monstercd}天，你今天已经锄了地，怎么又锄地！`) }
  fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
  return;
}


export async function mining(e) {
  if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
    filename = filename + ".json";//添加.json
  }
  if (!fs.existsSync(dirpath)) {//如果文件夹不存在
    fs.mkdirSync(dirpath);//创建文件夹
  }
  if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
    }));
  }

  var json = fs.readFileSync(dirpath + "/" + filename, "utf8");//读取文件

  if (!JSON.parse(json).hasOwnProperty(e.user_id)) {//如果json中不存在该用户
    json = JSON.parse(json);//转换为json
    json[e.user_id] = {//创建该用户
      "Crystalminecd": 0,
      "Monstercd": 0,
      'id': e.user_id,
    };
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
  }
  json = JSON.parse(json);//转换为json
  json[e.user_id].id = e.user_id;
  if (json[e.user_id].Crystalminecd >= 72) {
    e.reply(`距离上次挖水晶矿时间${json[e.user_id].Crystalminecd}小时，挖水晶矿记录成功了！，时间已刷新`)
    json[e.user_id].Crystalminecd = 0;//距离上次挖矿时间
  }
  if (json[e.user_id].Crystalminecd < 72) {
    e.reply(`距离上次挖水晶矿时间${json[e.user_id].Crystalminecd}小时，还不到72小时，水晶矿还没有长好！`)
  }
  fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
  return;
}

export async function list(e) {
  if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
    filename = filename + ".json";//添加.json
  }
  if (!fs.existsSync(dirpath)) {//如果文件夹不存在
    fs.mkdirSync(dirpath);//创建文件夹
  }
  if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
    }));
  }
  var json = fs.readFileSync(dirpath + "/" + filename, "utf8");//读取文件
  if (!JSON.parse(json).hasOwnProperty(e.user_id)) {//如果json中不存在该用户
    json = JSON.parse(json);//转换为json
    json[e.user_id] = {//创建该用户
      "Crystalminecd": 0,
      "Monstercd": 0,
      'id': e.user_id,
    };
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
  }
  json = JSON.parse(json);//转换为json
    let text = ''
    for (let key in json) {//遍历json
      text += `${json[key].id}：距离上次挖水晶矿${json[key].Crystalminecd}小时，锄地${json[key].Monstercd}天\n`
    }
    e.reply(text)
    return;
}
export async function help(e) {
  e.reply(`本插件实用手动打卡的方式记录群友的挖矿和锄地时间\n指令如下：今天已锄地、今天已挖矿、锄地|挖矿帮助、\n挖矿|锄地列表、挖矿|锄地列表全部`)
  return;
}