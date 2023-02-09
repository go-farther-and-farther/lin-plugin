import path from 'path'
/* 自定义全局插件名*/
export const appname = 'lin-plugin'
/* 自动匹配插件绝对路径 */
export const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}${appname}`
/** 打印插件名*/
logger.info(`${appname}[2023-1-19]`);