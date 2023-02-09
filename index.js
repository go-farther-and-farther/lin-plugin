import fs from 'node:fs'
import { BotApi } from './model/api/api.js';
import { Data, Version } from './components/index.js'
//用粉笔写；用白垩粉擦
import chalk from 'chalk'

//以js结束的文件被读取
const apps = await BotApi.Index.toindex({ indexName: 'apps' });
const files = fs.readdirSync('./plugins/lin-plugin/apps').filter(file => file.endsWith('.js'))

let ret = []

//改自碎月和喵喵的启动提示
if (Bot?.logger?.info) {
    Bot.logger.info('⏳⏳⏳⏳⏳⏳⏳⏳')
    Bot.logger.info(chalk.blue(`(🔨lin-Plugin🔨):"lin插件"初始化.....`))
    Bot.logger.info(chalk.red(`┎┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┒`))
    Bot.logger.info(chalk.red(`┃`)+chalk.blue(`  ╦        ╦══╦══╦  ╦      ╔╗  `)+chalk.red(`┃`))
    Bot.logger.info(chalk.red(`┃`)+chalk.blue(`  ║           ║     ║     ⫽ ║  `)+chalk.red(`┃`))
    Bot.logger.info(chalk.red(`┃`)+chalk.blue(`  ║           ║     ║   ⫽   ║  `)+chalk.red(`┃`))
    Bot.logger.info(chalk.red(`┃`)+chalk.blue(`  ║           ║     ║ ⫽     ║  `)+chalk.red(`┃`))
    Bot.logger.info(chalk.red(`┃`)+chalk.blue(`  ╚══════  ╩══╩══╩  ╚╝      ╩  `)+chalk.red(`┃`))
    Bot.logger.info(chalk.red(`┖┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┚`))
    Bot.logger.warn(chalk.red(`(🔨lin-Plugin🔨):若出现README.md中未提及的问题,请联系我们!!!`))
    Bot.logger.info(chalk.blue('(🔨lin-Plugin🔨):"初始化完成,欢迎您的使用✔!'))
    Bot.logger.info('⌛⌛⌛⌛⌛⌛⌛⌛')
} else {
    console.log(`正在载入"🔨lin插件"~`)
}

if (!await redis.get(`lin:notice:deltime`)) {
    await redis.set(`lin:notice:deltime`, "600")
}


// files.forEach((file) => {//forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数。
//     ret.push(import(`./apps/${file}`))
// })//把file放入

// ret = await Promise.allSettled(ret)

// let apps = {}
// for (let i in files) {//有点看不懂
//     let name = files[i].replace('.js', '')

//     if (ret[i].status != 'fulfilled') {
//         logger.error(`载入插件错误：${logger.red(name)}`)
//         logger.error(ret[i].reason)
//         continue
//     }
//     apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
// }
export { apps }
