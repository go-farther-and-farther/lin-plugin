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
  group: '各种免费ai接口介绍',
  list: [{
    icon: 80,
    title: '1号青云客',
    desc: '言语风格比较犀利，词库较多'
  }, {
    icon: 80,
    title: '2号思知',
    desc: '言语风格比较平淡，词库一般'
  }, {
    icon: 80,
    title: '3号夸克',
    desc: '问答式，听不懂你在说什么'
  }, {
    icon: 80,
    title: '4号小爱',
    desc: '顾名思义。风格温和'
  }, {
    icon: 80,
    title: '5号小源',
    desc: '等你探索>_<'
  }, {
    icon: 80,
    title: '6号小白',
    desc: '等你来探索>_<'
  }, {
    icon: 80,
    title: '更多ai',
    desc: '敬请期待，有合适的接口也可以联系我们'
  }]
}, {
  group: '管理命令，仅Bot管理员可用',
  auth: 'master',
  list: [{
    icon: 80,
    title: '开启/关闭复读',
    desc: '复读加一开关'
  }, {
    icon: 80,
    title: '开启/关闭打断',
    desc: '打断幅度开关'
  }, {
    icon: 80,
    title: '设置复读/打断条件+数字',
    desc: '设置触发消息数量条件'
  }, {
    icon: 80,
    title: '复读状态',
    desc: 'ai开关'
  }, {
    icon: 80,
    title: 'ai开启/ai关闭',
    desc: 'ai开关'
  }, {
    icon: 80,
    title: '太吵了/太安静了',
    desc: 'ai触发概率小幅度调整,具体调整数值在config文件里面查看'
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
    title: 'ai设置概率/设置ai概率/设置回复概率',
    desc: '设置ai触发概率为0以上100以内'
  }, {
    icon: 54,
    title: 'ai设置接口/设置ai接口/切换ai接口+序号',
    desc: '切换ai的接口'
  }, {
    icon: 55,
    title: 'ai状态',
    desc: '查看ai状态(开关 接口 概率)'
  }, {
    icon: 80,
    title: '-特此说明-',
    desc: '请勿修改js文件,以上设置均分群且重启依然生效'
  }]
}]

export const isSys = true
