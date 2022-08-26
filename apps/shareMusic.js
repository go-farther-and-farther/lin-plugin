import fetch from 'node-fetch'
import { segment } from 'oicq'
import plugin from '../../../lib/plugins/plugin.js'

/*
 *搜索并分享歌曲，使用方法发送#点歌 歌曲名 歌手 或者网易云 歌曲名
 *笨比煌CV于2022/08/22，更新于2022/08/25
 *【未经授权，不得转载】
*/
let msg2 =""
let kg = false
let wy = false
let qq = false
let zt = 0
export class shareMusic extends plugin {
  constructor () {
    super({
      name: '点歌',
      dsc: '点歌',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#*(点歌|qq|QQ|kugou|酷狗|网易云|网抑云|网易)(.*)|#听[1-9][0-9]|#听[0-9]*$$',
          fnc: 'shareMusic'
        },
		{
			reg:"^#*点动漫(.*)$",
			fnc:'kanpian'
		}

      ]
    })
  }

async kanpian(e){
	let msg3 = ""
	let  k = ""
	let data3 = ""
	if(e.msg.includes("点动漫")){
		
		k = e.msg.replace(/#点动漫/g,"").trim()
	}
	let url = 'https://search.bilibili.com/all?vt=92884847&keyword=' +  k  +  '&from_source=webtop_search&spm_id_from=333.1007'
	
	
	  let response = await fetch(url);
        const data= await response.text()
		
		let data2 = data.match(/href="(\S*) title/g); 
		
		
		
		console.log(data2)
		data3 = data2[0].replace(/href=/g,"")
		
		
		data3 = data3.replace(/\"/g, "");
		data3 = data3.replace(/title/g,"")
		console.log(data3)
  

msg3 = "https://www.bavei.com/vip/?url=" + "https:"  + data3 
  e.reply(msg3);
  e.reply(["以上是" + k + "的信息，请到浏览器中打开"]);
  return true;//返回true 阻挡消息不再往下
}



 async shareMusic(e) {
  const urlList = {
  qq: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?g_tk=5381&p=1&n=20&w=paramsSearch&format=json&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&flag_qc=0',
  kugou:
    'http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=paramsSearch&page=1&pagesize=20&showtype=1',
  wangyiyun: 'https://autumnfish.cn/search?keywords=paramsSearch',//备用API：http://www.clearfor.xyz:3000/cloudsearch?keywords=paramsSearch
}

  logger.info('[用户命令]', e.msg)
  let msg = e.msg.replace(/\s*/g, "");
  let isQQReg = new RegExp("^[非VIP]*点歌*(qq|QQ)(.*)$");
  let isKugouReg = new RegExp("^[非VIP]*点歌*(kugou|酷狗)(.*)|^[非VIP]*#点歌*(kugou|酷狗)(.*)$");
  let isWangYiyunReg = new RegExp("^[非VIP]*点歌*(网易云|网抑云)(.*)$");
  
  let isQQ = isQQReg.test(msg);
  let isKugou = isKugouReg.test(msg);
  let isWangYiyun = isWangYiyunReg.test(msg);
  
  if (!isQQ && !isKugou && !isWangYiyun) isWangYiyun = true;
  if(zt == 1){
			isKugou = kg
			isQQ = qq
			isWangYiyun = wy
		}
  let isPay = msg.includes("非VIP");
  console.log("什么！这个靓仔点非VIP？？？");
  msg = msg.replace(/[非VIP|点歌|qq|QQ|kugou|酷狗|网易云|网抑云]/g, "");
  
  
   if(e.msg.includes("#听")){
		
		msg = msg2
           }else{
	    msg2 = msg
		   }
		  msg = msg.replace(/#/g,"")
  console.log("这个靓仔在搜", msg);
   
  
  try {
	 
    msg = encodeURI(msg);
    const params = { search: msg };
    let apiName = isQQ ? "qq" : isKugou ? "kugou" : "wangyiyun";
    let url = urlList[apiName].replace("paramsSearch", msg);
    let response = await fetch(url);
    const { data, result } = await response.json();
    let songList = [];
    if (isQQ)
      songList = isPay ? data.song.list.filter((item) => !item.pay.payinfo) : data.song.list;
    else if (isKugou) songList = isPay ? data.info.filter((item) => !item.pay_type_sq) : data.info;
    else songList = result?.songs?.length ? result.songs : [];
	if(zt == 0){
		kg = isKugou
		qq = isQQ
		wy = isWangYiyun
	}
	
	
	let id =""
	
		  if(e.msg.includes("#听")){
		
		id = e.msg.replace(/#听/g,"").trim()
		console.log("id为"+id)
           }
    if (!songList[0]) {
      await e.reply(`没有找到该歌曲哦`);
    } else if (e.isPrivate) {
		
      await e.friend.shareMusic(
        isQQ ? "qq" : isKugou ? "kugou" : "163",
        isQQ ? songList[0].songid : isKugou ? songList[0].hash : songList[0].id
      );
    } else if (e.isGroup )  {
		
		console.log(isKugou)
		if(Number(id)>0){
			 e.group.shareMusic(
        isQQ ? "qq" : isKugou ? "kugou" : "163",
        isQQ ? songList[ id-1 ].id : isKugou ? songList[ id-1 ].hash : songList[ id-1 ].id
		
	
      );
	  zt = 0
		}
      
	  let msg = ""
	  let zz = ""
	  
	  if(isKugou &id == ""){
		  for(let i=0;i<songList.length;i++){

				  msg = msg + "\n"+  String(i+1)+ ".  "+data. info[i].songname + "   作者："+ data. info[i].singername
				  
	  }
	  console.log(msg)
	   ForwardMsg(e,[msg + "\n请发送你要听的序列号的歌曲，例如 #听1"])
	   zt = 1
	  }
	  
      if (isWangYiyun &id == "") {
		  
		 
			   for(let i=0;i<songList.length;i++){

				  msg = msg + "\n"+  String(i+1)+ ". "+songList[i].name + " 作者："+ songList[i].artists[0].name + ","
	  
		  }
		  
		  console.log(msg)
		  ForwardMsg(e,[msg + "\n请发送你要听的序列号的歌曲，例如 #听1"])
		  zt = 1
		  console.log(songList[0].artists[0])
		  
 
      }
		  
	  
	  if(Number(id)>0){
		  
		  let response = await fetch(`http://music.163.com/song/media/outer/url?id=${ songList[ Number(id)-1 ].id }`);
        const data = await response;
        if (!data?.url) return true
        const music = await segment.record(data?.url)
        await e.reply(music)
	  }
	  id = 0
	  
    }
  } catch (error) {
    console.log(error);
  }
  return true;
}


}
async function ForwardMsg(e, data) {
    console.log(data[1]);
    let msgList = [];
    for (let i of data) {
        msgList.push({
            message: segment.text(i),
            nickname: Bot.nickname,
            user_id: Bot.uin,
        });
    }
    if (msgList.length == 10) {
        await e.reply(msgList[0].message);
    }
    else {
        //console.log(msgList);
        await e.reply(await Bot.makeForwardMsg(msgList));
    }
    return;
}