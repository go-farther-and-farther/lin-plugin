/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
*
* */

export const helpCfg = {
  // 帮助标题
  title: 'LinAI帮助',

  // 帮助副标题
  subTitle: 'Yunzai-Bot & Lin-Plugin',

  // 帮助表格列数，可选：2-5，默认3
  // 注意：设置列数过多可能导致阅读困难，请参考实际效果进行设置
  colCount: 3,

  // 单列宽度，默认265
  // 注意：过窄可能导致文字有较多换行，请根据实际帮助项设定
  colWidth: 265,

  // 皮肤选择，可多选，或设置为all
  // 皮肤包放置于 resources/help/theme
  // 皮肤名为对应文件夹名
  // theme: 'all', // 设置为全部皮肤
  // theme: ['default','theme2'], // 设置为指定皮肤
  theme: 'all',

  // 排除皮肤：在存在其他皮肤时会忽略该项内设置的皮肤
  // 默认忽略default：即存在其他皮肤时会忽略自带的default皮肤
  // 如希望default皮肤也加入随机池可删除default项
  themeExclude: ['default'],

  // 是否启用背景毛玻璃效果，若渲染遇到问题可设置为false关闭
  bgBlur: true
}

// 帮助菜单内容
export const helpList = [{
  group: 'ai介绍',
  list: [{
    icon: 80,
    title: '1号青云客',
    desc: ''
  }, {
    icon: 80,
    title: '2号思知',
    desc: ''
  }, {
    icon: 80,
    title: '3号夸克',
    desc: ''
  }, {
    icon: 80,
    title: '4号小爱',
    desc: ''
  }, {
    icon: 80,
    title: '5号小源',
    desc: ''
  }, {
    icon: 80,
    title: '7号小白',
    desc: ''
  }, {
    icon: 80,
    title: '更多ai',
    desc: '敬请期待'
  }]
}, {
  group: '管理命令，仅管理员可用',
  auth: 'master',
  list: [{
    icon: 80,
    title: 'ai开启/关闭',
    desc: 'ai开关'
  }, {
    icon: 80,
    title: '太吵了/太安静了',
    desc: 'ai触发概率小幅度调整'
  }, {
    icon: 80,
    title: 'ai只关注@消息',
    desc: 'ai模式调整为仅@时概率触发'
  }, {
    icon: 54,
    title: 'ai关注所有消息',
    desc: 'ai模式调整为全局概率触发'
  }, {
    icon: 54,
    title: 'ai设置概率',
    desc: '设置ai触发概率为0以上100以内'
  }, {
    icon: 54,
    title: '#查看全部ai接口',
    desc: '查看已配置的ai接口'
  }, {
    icon: 54,
    title: '#切换ai接口+序号',
    desc: '切换ai的接口'
  }]
}]

export const isSys = true