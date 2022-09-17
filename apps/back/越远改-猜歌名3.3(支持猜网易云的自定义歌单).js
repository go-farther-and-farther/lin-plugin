import { segment } from "oicq";
import fetch from "node-fetch";

//项目路径
const _path = process.cwd();

//qq: 717157592  有BUG请不要联系
//使用说明：此插件需要装ffmpeg，安装教程:Window在云崽群发送 ffmpeg;   linux在云崽群发送 linux安装ffmpeg;

//历史版本:
//猜歌名2.1:增加了提示指令,返回歌曲为一整首歌
//猜歌名3.0:增加了自动提示,修改了命令,返回歌曲改为返回铃声

//目前版本:
//猜歌名3.3:更换了接口,支持猜网易云的自定义歌单,意思就是歌单有什么歌,机器人就随机发歌单的其中一首歌让你们猜
//越追越远修改后支持多歌单
let music = [7480157955];  //这里改网易云的歌单id ,现在是我的歌单,不会获取歌单id的在云崽群发送 歌单id


//简单应用示例

//1.定义命令规则
export const rule = {
    guessmusic: {
    reg: "^猜歌名$", //匹配消息正则，命令正则
    priority: 100, //优先级，越小优先度越高
    describe: "【猜歌名】", //【命令】功能说明
  },
  answerCheck: {
    reg: "noCheck",
    priority: 1000,
    describe: "",
  },
  
  EndCheck: {
    reg: "^(结束猜歌名|投降)$",
    priority: 900,
    describe: "",
  },

  
};

//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
export async function guessmusic(e) {
 

  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    e.reply('猜歌名正在进行哦!')
    return true;
  }
   let i = Math.round(Math.random() * (music.length - 1))
   let res = await(await fetch(`https://api.yimian.xyz/msc/?type=playlist&id=${music[i]}&random=true`)).json(); 
   console.log("歌名是:"+res[0].name);
  
    e.reply( `游戏开始拉,请听语音猜出歌名！\n游戏区分大小写,猜的歌名必须跟答案一样才算你对噢~\n结束游戏指令【投降】`,true);
    e.reply(segment.record(res[0].url));
    
    setTimeout(() => {
      e.reply(`提示：\n歌手:${res[0].artist}`);
    }, 2000)//毫秒数
   
  guessConfig.gameing = true;
  guessConfig.current = res[0].name;
 

    guessConfig.timer = setTimeout(() => {
      if (guessConfig.gameing) {
        guessConfig.gameing = false;
        e.reply(`嘿嘿,猜歌名结束拉,很遗憾没有人猜中噢！歌名是【${res[0].name}】`);
     
		return true;
      }
    }, 120000)//毫秒数


  return true; //返回true 阻挡消息不再往下
}

const guessConfigMap = new Map()

function getGuessConfig(e) {
    let key = e.message_type + e[e.isGroup ? 'group_id' : 'user_id'];
    let config = guessConfigMap.get(key);
    if (config == null) {
      config = {
        gameing: false,
        current: '',
        timer: null,
      }
      guessConfigMap.set(key, config);
    }
    return config;
  }

export async function answerCheck(e) {
    
    let guessConfig = getGuessConfig(e);
    let {gameing, current } = guessConfig;
    
   
   
  if (gameing && e.msg == guessConfig.current) {
      e.reply(`猜歌名结束,这也能猜中？\n蒙的吧~~派蒙才不信呢`, true);
      guessConfig.gameing = false;
      clearTimeout(guessConfig.timer)
      return true;
    }
}
  
  export async function EndCheck(e) {
    
    let guessConfig = getGuessConfig(e);
    let {gameing, current } = guessConfig;
    
    if(gameing){
         guessConfig.gameing = false
         clearTimeout(guessConfig.timer);
         
         
         e.reply(`猜歌名已结束\n歌名是:` + guessConfig.current);
         
         return true;
    }else{
        e.reply(`猜歌名游戏都没开始,你结束锤子呢？`)
        return true;
    }
  }
  
 
  

  
  
