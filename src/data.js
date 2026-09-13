// ============================================================
//  活动数据 — 统一管理所有 Tab、活动、友情链接
//  修改此文件即可更新页面内容，无需改动 app.js
//
//  数据结构说明：
//  tabs: 每个 tab 包含 id / label / sections[]
//    sections[]: 每个分区包含 title / items[]
//      items[]: 每个活动包含 name，以及以下二选一：
//        - code（口令码，用户点击复制）
//        - link（链接，用户点击跳转）
//      可选字段：deadline（截止日期）
//
//  friendLinks: 友情链接数组，每项包含 name / url
// ============================================================

// ========== 友情链接 ==========
export const friendLinks = [
  { name: '苏宁易购', url: 'https://tb.jiuxinban.com/CK1W4u' },
  { name: '当当网', url: 'https://tb.jiuxinban.com/CK1W9y' },
  { name: '1688', url: 'https://tb.jiuxinban.com/CK1Vl5' },
  { name: '腾讯云', url: 'https://curl.qcloud.com/ITnFdvQ9' },
  { name: '影视会员', url: 'https://wcbblll.99kami.com' },
  { name: '音乐会员', url: 'https://wcbblll.im01.cn' },
  { name: '福来流量站', url: 'http://35568.qcxmt.cn' },
  // { name: '淘宝·拼多多·唯品会', url: 'https://pqjdg.yhzu.cn/' },
  // { name: '京东·淘宝·拼多多', url: 'https://github.com/jdjdndn/jd_tb_pxx' },
  // { name: '美团优惠聚合', url: 'https://github.com/jdjdndn/meituan_youhuiquan' },
  // { name: '优惠券合集', url: 'https://github.com/jdjdndn/youhuijuhe' },
];

// ========== Tab 数据 ==========
export const tabs = [
  // ────────────── 美团 ──────────────
  {
    id: 'meituan',
    label: '🍜 美团',
    sections: [
      {
        title: '外卖美食',
        items: [
          { name: '美团外卖节', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰0oNDdiZTcyMDE💰', deadline: '2027.12.31' },
          { name: '吃喝玩乐每日福利', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰2gOWRkZTMwYzc💰', deadline: '2027.3.31' },
          { name: '红包天天领综合会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰43Y2YwOTVkOTA💰', deadline: '2026.12.31' },
          { name: '大牌饮品商品券会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰4wZjZkNzBjNDc💰', deadline: '2028.4.30' },
          { name: '甄选好店优惠专享', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰61Zjc5NzcwMmY💰', deadline: '2026.12.31' },
          { name: '万物享优惠', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰hcNzcyYjZiYTk💰', deadline: '2026.12.31' },
          { name: '超市便利店专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰cgMTI5MmJlOTI💰', deadline: '2026.12.31' },
          { name: '零食天天有优惠', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰kjYmQ5YjA4NGQ💰', deadline: '2026.12.31' },
          { name: '水果会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰g7ODQ1ZmFmMWQ💰', deadline: '2027.3.31' },
          { name: '美团品质会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰raYWYwNWFjY2I💰', deadline: '2026.12.31' },
          { name: '爆款团低至1折', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰v8NTAyNDYxYmI💰', deadline: '2026.12.31' },
        ],
      },
      {
        title: '酒旅出行',
        items: [
          { name: '全国爆款酒店3折起', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰t8YzEyNzRhYjA💰', deadline: '2027.11.3' },
          { name: '大额出行券包', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰grNDRmNTNiYmQ💰', deadline: '2028.3.1' },
          { name: '低价购票畅快启程', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰i8MzZiODg3MWQ💰', deadline: '2028.3.31' },
          { name: '景点门票超值精选', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰l9MTk3YjRjMTE💰', deadline: '2026.12.31' },
          { name: '暑期出游季', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰mcY2U0OGJjZDM💰', deadline: '2026.12.31' },
        ],
      },
      {
        title: '健康买药',
        items: [
          { name: '买药享好价', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰87ZTc2MzhjNDU💰', deadline: '2026.12.31' },
          { name: '买药新客会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰qaMTY1MjZiZTc💰', deadline: '2026.12.31' },
          { name: '儿童用药专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰rnMDIwYTAyYmM💰', deadline: '2026.12.31' },
          { name: '仙特明专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰2qZmIyZTM3ZTY💰', deadline: '2026.12.31' },
          { name: '海露专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰0rMWI3YzczOTg💰', deadline: '2026.12.31' },
          { name: '内舒拿专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰oaY2FmNGY1NzM💰', deadline: '2026.12.31' },
          { name: '氯雷他定专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰y7NjQxYTcxZmE💰', deadline: '2026.12.31' },
          { name: '买药成人会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰ujMzZmNGVhYTU💰', deadline: '2026.12.31' },
        ],
      },
      {
        title: '美妆个护',
        items: [
          { name: '美妆综合会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰b4MWUzNDAxNWU💰', deadline: '2026.12.31' },
          { name: '屈臣氏专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰d0MzM1ZWNhZDQ💰', deadline: '2026.12.31' },
          { name: '健康变美品质专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰n6NTFjODM2ODg💰', deadline: '2026.12.31' },
          { name: '玩乐变美一折起', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰qsOTU1MjhjYTE💰', deadline: '2026.12.31' },
        ],
      },
      {
        title: '母婴·生活·数码',
        items: [
          { name: '伊利奶粉专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰8tYWE4ZTMxZjE💰', deadline: '2026.9.4' },
          { name: '母婴专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰9jMGQ2NTkzNWM💰', deadline: '2026.12.31' },
          { name: '美团生活服务专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰kxNTI5OTBhMmI💰', deadline: '2026.12.31' },
          { name: '无忧保洁专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰luMjY3MjU4OTg💰', deadline: '2026.12.31' },
          { name: '轻喜到家品牌专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰psZTNjMzkxZmY💰', deadline: '2026.9.30' },
          { name: '天鹅到家品牌专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰vyNjgzMjk4ODg💰', deadline: '2026.9.30' },
          { name: '随心学教育专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰itMTlkY2RlMDk💰', deadline: '2026.12.31' },
          { name: '数码会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰diZTU0NmJjYjA💰', deadline: '2026.12.31' },
          { name: 'TOP TOY专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰fnMmUyY2VmNjE💰', deadline: '2026.12.31' },
          { name: '日百综合会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰mrZjgwNWUxNjM💰', deadline: '2026.12.31' },
          { name: '名创优品专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰voZDdkMDhjMjE💰', deadline: '2026.12.31' },
          { name: '鲜花会场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰jlZjI0MDE0OGM💰', deadline: '2026.12.31' },
        ],
      },
      {
        title: '限时特惠',
        items: [
          { name: '9.9元购360元神券包', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰nkMDBiOTVmZjY💰', deadline: '2026.9.30' },
          { name: '民宿特惠7折起', code: '#小程序://美团丨外卖团购特价美食酒店电影/民宿特惠7折起/09Bdj7vsgb64nCk', deadline: '2026.12.31' },
          { name: '九号温泉品牌专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰ryNTA0Zjc2ZDY💰', deadline: '2026.12.31' },
          { name: '开学季专场', code: '1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰l9MjlmNjdhMzY💰', deadline: '2026.9.24' },
        ],
      },
    ],
  },
  {
    id: "taobaoshangou",
    label: '淘宝闪购',
    sections: [
      {
        title: "淘宝闪购",
        items:[
      { name: '闪购天天领红包', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021004134685665%2Fpages%2Ftaoke-guide%2Findex%3Ffrom%3Dminiapp.taobao%26channelInfo%3D%7B%22subSubChannel%22%3A%22miniapp.taobao.et%22%7D%26alsc_exsrc%3DES0006299852%26scene%3D8c43025b5bd64e71b0ebca47606ad6fa',deadline: '2032.4.14'},
      { name: '闪购消费日专享，城市大额红包等你抢，叠加更优惠！', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021003183669766%2Fpages%2Fwh-coupon-guide%2Findex%3Ffrom%3Dminiapp.taobao%26channelInfo%3D%7B%22subSubChannel%22%3A%22miniapp.taobao.et%22%7D%26alsc_exsrc%3DES0006299852%26scene%3Dff13be18793241a387453bff04b3133e', deadline: '2026.12.31' },
      { name: '闪购最高领18元红包', code: 'mp://DkIMsAbgHcTEKuC' },
      { name: '闪购新客专享最高20元红包，叠加使用更划算！', link: 'https://lloSK69S0O5.ug.ele.me/wow/alsc/mod/dd84fb45b245f3292e170527?inviterId=9b7db08&channel=3&actId=1&scene=f5ec977ff3d645ad9d02523a0da8e1d0',deadline: '2028.7.31'},
      { name: '闪购品牌日 单单有福利，最高22元，可叠加', link: 'https://market.m.taobao.com/app/starlink/wakeup-transit/pages/download?star_id=9249&slk_force_set_request=true&scene=5ca8b0c019de4736a5808aaf3950a266',deadline: '2027.5.13'},
      { name: '零售闪购品牌日，超市好价 即刻送达', link: 'https://market.m.taobao.com/app/starlink/wakeup-transit/pages/download?star_id=9249&slk_force_set_request=true&scene=7b5880f900f94640a992e112c1e60965',deadline: '2026.12.31'},
      { name: '闪购夜宵专享会场，每晚8点抢免单红包', link: 'https://market.m.taobao.com/app/starlink/wakeup-transit/pages/download?star_id=8706&slk_force_set_request=true&alsc_exsrc=ES0007485972&scene=0620bdbc5178441aa8bf7ec28fd8f6fc',deadline: '2027.1.14' },
      { name: '来闪购一下 可赢免单福利，闪购大额满减红包', link: 'https://market.m.taobao.com/app/starlink/wakeup-transit/pages/download?star_id=8339&slk_force_set_request=true&tfPos=h5&alsc_exsrc=ES0007076172&scene=ff7376711fea4d93b579c4ec6aba0e79',deadline: '2028.5.11' },
      { name: '领8元红包，叠加更优惠，买药更省钱！', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021003183669766%2Fpages%2Fwh-coupon-guide%2Findex%3Fscene%3Dbaf73ba7154643d398b8293cbb0dbfc2',deadline: '2027.2.28'},
      { name: '名创优品品牌馆，叠券最高99-65', link: 'https://market.m.taobao.com/app/starlink/wakeup-transit/pages/download?star_id=9249&slk_force_set_request=true&scene=2b22a4b4cfef44099d65b9292dd1d99e',deadline:'2026.12.31' },
      { name: '闪购果蔬日日鲜，领专属红包福利', link: 'https://market.m.taobao.com/app/starlink/wakeup-transit/pages/download?star_id=9249&slk_force_set_request=true&scene=748268b0d12b4229ac524d5d92d75271',deadline:'2026.12.31' },
      { name: '猫超品牌馆，夏季出游季爆品5折起', link: 'https://tb.ele.me/wow/z/uniapp/1100497/ad-miniapp/et-union/home?wh_weex=true&weex_mode=dom&channelInfo=%7B%22subSubChannel%22%3A%22miniapp.taobao.et%22%7D&alsc_exsrc=ES0007485972&scene=2eff0a5dc8f4491eb842b3c6918b6d1e' ,deadline:'2026.12.31'},
      { name: '近铁商圈', code: 'mp://BDz9UZSBfokxAwh',deadline:'2026.12.31'} ,
      { name: '闪购天天领红包，来闪购 下单抽免单', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021003183669766%2Fpages%2Fwh-coupon-guide%2Findex%3Ffrom%3Dminiapp.taobao%26channelInfo%3D%7B%22subSubChannel%22%3A%22miniapp.taobao.et%22%7D%26alsc_exsrc%3DES0007485972%26scene%3D1e27b4980dfc4265b6dc393cd9145658', deadline: '2027.5.13' },
      { name: '淘宝闪购-爆品好价 爆品9.9元起，全场免运费', link: 'https://market.m.taobao.com/app/starlink/wakeup-transit/pages/download?star_id=8706&slk_force_set_request=true&alsc_exsrc=ES0008124452&scene=9202534329974f2aaf36208c8c3bd461',deadline:'2027.9.30'} ,
      { name: '淘宝闪购-领最高15元大红包', link: 'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021005151656223%26page%3D%252Fpages%252Findex%252Findex%26query%3DchannelInfo%253D%25257B%252522channel%252522%25253A%252522mini_app%252522%25252C%252522subChannel%252522%25253A%252522miniapp.alipay%252522%25252C%252522subSubChannel%252522%25253A%252522miniapp.alipay.et%252522%25257D%2526alsc_exsrc%253DES0007265508%2526scene%253D9c1b8c64364e4bac85227067e9d319b4',deadline:'2028.5.31'} ,
      { name: '领券省更多 评价赢现金 叠加红包 优评返现', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021004134685665%2Fpages%2Fcompose-reduce-guide%2Findex%3Fscene%3D4df2be751471483a95ff58b0dd6f9df4',deadline:'2030.4.3'} ,
      { name: '评价有礼单单返(淘天版) 下单写优评高额返现页面商户下单，评价再返现', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021003183669766%2Fpages%2Fcomment-poliely-guide%2Findex%3Fscene%3D552c2d91e92e431097bb7c03d34279e4',deadline:'2026.12.31'} ,
      { name: '品牌好物抢5-10元叠加红包，限时抢购正当时！', code: 'mp://RsWmDT1EWP8pzzs',deadline:'2033.6.30'} ,
      { name: '领券省更多 评价赢现金 叠加红包 优评返现', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021004134685665%2Fpages%2Fcompose-reduce-guide%2Findex%3Fscene%3D4df2be751471483a95ff58b0dd6f9df4',deadline:'2030.4.3'} ,
      { name: '零售会场 一键领零售红包零售红包聚合会场，一键全领取', link: 'https://m.duanqu.com/?_ariver_appid=8251537&page=plugin-private%3A%2F%2F2021004134685665%2Fpages%2Fbdlm-ls-guide%2Findex%3FconfigKey%3DPAGE_TAOBAO_RETAIL%26scene%3D917b19c60eb54693bd1249c7e5208f44',deadline:'2028.12.31'} ,
    ]
      }
    ]
  },

  // ────────────── 电商 ──────────────
  {
    id: 'ecommerce',
    label: '🛒 电商',
    sections: [
      {
        title: '京东',
        items: [
          { name: '小首页', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPIJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4ZXgcHUl5eOC5vQzdhZzoQPmNeKzYnfjxtWx9vcDsZUTYDZF1cCk4TBm0KGF8lbQYBZBUzCXsVA24JE18WVAEDZF5bAUIeAWoJHl4cWQ8yU15UOA1CfxBeeiFyIlNcDxYVOHsnAF8PG1IBW3RDBkpbensnAG84GGslXwcDUFdtOJWasxV7bwJRXHRxABwjSkpERBrWlusEIXELUFpZGXsnM18JKw' },
          { name: '福利积分页', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPIJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4ZXgcHVllYOC9wYhpcXzlsOFkBCx4DDkJJGThSWg0ZUTYDZF1cCk4TBm0KGF8lbQYBZBUzCXsVA24JE18WVAEDZF5bAUIeAWoIH1wWVAcyU15UOA1CfxBeeiFyIlNcDxYVOHsnAF8PG1IBW3RDBkpbensnAG84GGslXwcDUFdtOJWaswcPcBtGWAN9EzkhWC4WaDTWlusEL3YCVlxdGXsnM18JKw' },
          { name: '限时优惠页', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPEJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4XgYGUlltdQN_QCdqZRNwHgVhXC4EchFOVxd0TVcZbQcyV19fDU8SAW0LH2slXQUyHzBcOEkXAm4AH1gcWgcyVFhUAUIVBm8AH10VXjYFVFdtTh5rfDlpYTxqCFhZHBZtOHsUM2gIEk8TL0dQQFgvOHsUA18LK2sXXAcGXW5t1sana2prWyMWGnlLClscfxlpBbGFq0pnLQYGVVhMOHsnM244' },
          { name: '精选商品页', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPIJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4XgEAVFZcODF8Wh1VQS9RPX5GATsBCxlBBCRyXjsZUTYDZF1cCk4TBm0KGF8lbQYBZBUzCXsVA24JE18WVAEDZF5bAUIeAWoLG1kdVQcyU15UOA1CfxBeeiFyIlNcDxYVOHsnAF8PG1IBW3RDBkpbensnAG84GGslXwcDUFdtOJWaswQNbFhqX01fXV46ARhkUSfWlusEIXELUFpZGXsnM18JKw' },
          { name: '京东秒杀', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPEJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4XgYCV1ptCyJFQWd7eB13L3xKVD5efR5SGTVtXVcZbQcyV19fDU8SAW0LH2slXQUyHzBcOEkXAm4AH1gcWgcyVFhUAUIVBmwKHVsSWjYFVFdtTh5rfDlpYTxqCFhZHBZtOHsUM2gIEk8TL0dQQFgvOHsUA18LK2sXXAcGXW5t1sanYm9_TilhDVxmFl46UTtHcbGFq0pnLQYAVl5MOHsnM244' },
          { name: '自营热卖', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPEJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4XgYDVl1tDAgTGS4NWglwOQUDCAsfYE0ffzIATVcZbQcyV19fDU8SAW0LH2slXQUyHzBcOEkXAm4AH1gcWgcyVFhUAUIVBmwPG1IUWDYFVFdtTh5rfDlpYTxqCFhZHBZtOHsUM2gIEk8TL0dQQFgvOHsUA18LK2sXXAcGXW5t1sanYGhySycUIQ97VCYKehsfd7GFq0pnLQYAVl5MOHsnM244' },
          { name: '实时热销', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPEJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4XgYBVFhtdhZ_dgxwRAJ1VF5LEw4WSS1kGRpWe1cZbQcyV19fDU8SAW0LH2slXQUyHzBcOEkXAm4AH1gcWgcyVFhUAUIVBmwOElMTXTYFVFdtTh5rfDlpYTxqCFhZHBZtOHsUM2gIEk8TL0dQQFgvOHsUA18LK2sXXAcGXW5t1sanZRt1WTtmX3xCPwU4eisef7GFq0p-JAYKXFhMOHsnM244' },
          { name: '京喜秒杀', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BANkJK1olXDYDZBoCUBVIMzZNXhpXVhgcEh4fFxBCHD1WR0VUBVlUChpDSh9FWTdVRhwWQ15dAQoUFwlORjNVKzNzGmJGCBk_ajINBSRXawVuVW4AJBhRBHsWM2wJGV4RWAQAV1ptOEsUMyRmGmsXXQcDXFpeAUwWM28OElIcXwMBXFhVCE0nBG8BKx1AIXlUNSQ6dx5JWCdAK2slXjYFVFdJDjlWUXsOaWslXDYBZG5fCUoTCl84xdalLgJ3VykuUQ4RCxR1RhAXGdiP5E82cUsfC2kZK2slbQcy' },
          { name: '热门清单榜', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPEJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4ZXgcDVlxtbUgNGQgBQTpwXlJeETk2TykSaB1Ma1cZbQcyV19fDU8SAW0LH2slXQUyHzBcOEkXAm4AH1gcWgcyVFhUAEgRAWcLEloWXDYFVFdtTh5rfDlpYTxqCFhZHBZtOHsUM2gIEk8TL0dQQFgvOHsUA18LK2sXXAcGXW5t1sanf2x7TBlmLloAMB0adhVtV7GFq0ppKgIFXV5MOHsnM244' },
          { name: '优惠雷达', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPIJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4ZXgEAVVldODtMB29tEj9SPW9gFisdfhsUVRt_WSsZUTYDZF1cCk4TBm0KGF8lbQYBZBUzCXsVA24JE18WVAEDZF5bAUMUBWoIGFkRVQIyU15UOA1CfxBeeiFyIlNcDxYVOHsnAF8PG1IBW3RDBkpbensnAG84GGslXwcDUFdtOJWasxp_byRBX1YEJ1gnWkxvaxXWlusEL3YCUFlZGXsnM18JKw' },
          { name: '幸运转盘', link: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPEJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4ZXwcEVlhtSDJBXzt_UwR2AUZGMhk7TCNQAz8KXVcZbQcyV19fDU8SAW0LH2slXQUyHzBcOEkXAm4AH1gcWgcyVFhUAEgRBm8PHVwWXzYFVFdtTh5rfDlpYTxqCFhZHBZtOHsUM2gIEk8TL0dQQFgvOHsUA18LK2sXXAcGXW5t1sanYRtrf1oQAgVmCSgGWAgQa7GFq0ppOQICVVtMOHsnM244' },
        ],
      },
      {
        title: '淘宝',
        items: [
          { name: '领券中心', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269805%40212ab4cc_0dfe_1a098ca8a6d_9c53%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020020616&e=m%3D2%26s%3DdofwPaEQFc9w4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0O2iwoeoDO941TWny6gsEi9SuewCsBSbS6oN95bG9f%2BFUZHYLBVvqBh2JFnLDKcohCUZ%2FJYwIzSxAGIx0oe2X2hZfJ7ZQxC1%2Fb%2BmvmXqUq2iEBnEBk3xaGylLmcSHKfaX1CIFRJhZoJ2keMqUwSQcLSwn1IXvusdyogaseAKBk0cEzJFLUun%2BFGDWrJcI%2B9mMkt2lYwodYMFf7Le49%2F8qY%2BP%2BRk9cvLur6lBjBYgj4%2Fi7QrH1tUnPyWfF2mNtOHXW%2B%2F9SMD5NOKOiuzH7pZzJf0rOVsz%2BkILKYgPh2VpbvcT8PwOkD4ulZfxvNaaibhIncDlE6H93yEw17wnkme1OdGDcT9IgYeWF%2FeiVvaEiF03Z3NEK3xpqJbw0Xjr6aTmzBqXZ8Yqn2bkhplvaBfrg%2B6seY1jg6ngqFhtB%2Fl3JjVuBcmuj8A3AXOK%2F7ip5Dhfd0Tkaz0EsryRaKfxHmzWgJfGDmntuH4VtA%3D%3D',deadline: '2124.1.1' },
          { name: '好货快抢', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269761%40212780ba_142c_1a098c9df99_2d40%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020017611&e=m%3D2%26s%3D5pqcP3DH9mVw4vFB6t2Z2iperVdZeJviPI5Rhak06vZnX1vWUft3ZaAnCybvFV75fIHLpoNx505J97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FiBN3iHUGXXBvepeUMJqnXEmN8RaA5ZjZnCUeIxjkboBkAUQdVyQjtvG26G5h5DbJ14RX4z5YTqZ8ariJP4O%2FnD8kvyptdUtaZGY3BGA2cpm%2B4M%2FroZ5yH8EjJyX%2FcVipF8FrkEmyToIzwKSPXo5M%2F6YYBaA3OUSKjQSbkn35W7wdWQ0CHeKpylJT9WjVeD0l5d3xdiTQf9LfHSeuOjffnzwVVxRYTFDDTjHmRkFd9K8osXyMV5Rv6bjOSebyVjHAd22K7%2FvPQBEn5d%2BHYkafQuJa7kfk0V5kdLhqIz7DLH1vkP9agwOf5HcGU56P3rHt7tQMiXjbIHsCW52rAoq%2BWEjN%2BjdRtE5KpistB58PQoRbeCIalhioeUDcbShJUCG%2Brx0nrjo33581pCxbiuWJXAKeVdO4OKexBEq5oFYUyjSfGgsRbryihsEwNTceGfKgvTQkKeWriynlcyAgWFR085NWSdDIulSOpxKmPmpIKZsA%3D%3D' ,deadline: '2026.12.31'},
          { name: '天猫超市福利攻略', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269828%40213ee446_0d68_1a098cae472_d9ee%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020022781&e=m%3D2%26s%3DuLmh7lM4fsFw4vFB6t2Z2iperVdZeJvilQZ%2Bodr2hRdBcCq04HXSj430ZFekjizveOzAsqz6HCgFAvjU8V96ZnGDYYeigkVal8qJFJ9OtqEg6bOUvgh9CzLiKFuhlcW6r4B7uVwqjQ7Zc8%2FbdezAQ0D4z7jWUkCBy0DxCSzwFgFd1le1%2FF%2FLHXyKwiqD2WK0Bmf7LSR66ai5FyDCeyBgIo5RNw7GWBXd47FHjfsActk7kJwmAcM4EscLnN75O919%2BhqU%2BYOU%2B9jWa%2B%2BdDcHjttBqvyxCArSGxiWQ9xAMfPYT%2B69uibTe2Web%2FSiwaYMKd1wExAAEI2M4hpwI4sm7XLsoSXpvjOTqobWnIMHOwewfZaUpyaa23VfeOyyvOYt9eiaa%2B4f87rHxUo9s%2F5ehVQ4j3wsQaigJFZdeE1TRoXu%2FT0nkUajBH0ZIrDWvWZgOWPQUs5CccI%2B1NJVwzvHwyzrPmjGUP8KlqzFu5gyY4Tx7eNTRMork7D0FLhAx%2FhvUe8KJ1TyosJ0qULfYCXOAU3AKkztvS7satEa%2FkAZYTUY5eaXRu9E1DmEFZY7xIX8RUeqAPwVXOPIjyQoND46YzvYvMQkPO6r4GeKkf0WtZCzSXbEQjRnEJ%2BOPxnAf2gXyWueX7nMsltF51sJ2zRMkD3JBUzXPDJUM5d0yfXiHH3HHg%2Bt9dAHDziWXGV4EhVCX%2FBnGH6lrfDPL0FY40XuIQbTJ6toEbSYoaURt8BBgS3M4Gz2hXIESCyGFCzYOOqAQ',deadline: '2029.3.28'},
          { name: '爱淘宝U选好价', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269868%40213c6ddd_1a08_1a098cb7f1f_644a%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020018243&e=m%3D2%26s%3DDhRAyNNLXmtw4vFB6t2Z2iperVdZeJviAMbqNcPEYg5o096vQWAemjLxqsKAeUFqovTCjOT8UuUWpIFXOotQwwPYd2JIcg8KNxtZhW1pGjuHpmTFoS5hnbglIm5R4efLMaHbvS4gHhagDufkXL27bJLL0QPsyT77slidLc%2FfR2bfW12dRBt0XJ7LmQijlljrM7kxpdONUAKgtf8I59Gmj7WOELdnGdZV3eHn14rW1PBrFNsq7YReJqyVxQ5d7qtmjuLqP0i2LDq4V%2FAZEoXIUpJCeY0WIuMhqNnA9ULGd8vpIZMrI2%2BwI2ndr18LuT62ELVTwyykRsD%2F5s%2FxzMCLPqnMKU%2BksP%2FURtMQrjt6XoOaLCJhTHAMYVMLlWIM5gWadgImHEeRG4S2T7%2BGR0p7k2ftBuy5xKcb3x8SMA9qu57up5TKVZzpNJfdzDItOUCGWDgLNGg4ZQ9hCHeAi4Yh%2Fvb8eBFkyd7rluigq15Vuux6eUVt7VdvFfKiBxCG6GIRFU0WtFxa%2FCbnYJ8p3RrGK2pUI7UUpZUComfkDJRs%2BhU%3D',deadline: '2027.3.31'},
          { name: '猫超省钱购', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269915%402104c30e_0dce_1a098cc3668_06e6%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020021872&e=m%3D2%26s%3DkiEv5fTBasNw4vFB6t2Z2iperVdZeJviUJuTV9u3Qr3Kcf63K0tpwzLxqsKAeUFqXaFXABjh1v8WpIFXOotQwwPYd2JIcg8KNxtZhW1pGjuHpmTFoS5hnbglIm5R4efLehLfHGLB2AC3lzMAb9F29ZLL0QPsyT77slidLc%2FfR2bfW12dRBt0XJ7LmQijlljrM7kxpdONUAKgtf8I59Gmj7WOELdnGdZV3eHn14rW1PBrFNsq7YReJnTnJNscJyCtKF3FWliUIcwm49qWxULt3lK57AKwFJtLqg33lsb1%2F4VRkdgsFW%2BoGHYkWcsMpyiEqx2x0BWcWiEfbffBdbEbIM39D599wq7n2ETKZKvnOtuu0GqK3gNetW%2FrHB9aiVckS6fqAUnbbChe7auY0HPYWszlTEcWhO9m2%2FL0sbZUfrAKr0mM%2FAAfTtj616Aa863AnnMXFyNlLJVt9knqZaOjWUIEg9NO7wdF%2FQ7VB%2F3K0pFWDuQR9YnjkfSnuneCL3VLq9Wovlk03nQgClEF5Y8bUYwMKdwG7CqNDs6GVUNMcpthuPb%2FOKes%2BRlrk9AJIHp%2FYGIfpu4zpQOyxqmEJ6AgejNop9tXCgMk6g7rE9C3DDSlUjD6XVkdO5IfEp5Ee1IWwz8X4Ip0tqM7CUJemDIudOb4Iv7FiFdis%2FiBoWnSEXnGJe8N%2FwNpGw%3D%3D',deadline: '2027.3.31'},
          { name: '淘宝签到领福利', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269948%400b5fe433_0ddf_1a098ccb765_afd3%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020016228&e=m%3D2%26s%3DN5XSSFvwUUhw4vFB6t2Z2iperVdZeJviasFb3jPCdt85Rogii3YtH430ZFekjizvWX6Lj5y8ERsFAvjU8V96ZnGDYYeigkVal8qJFJ9OtqEg6bOUvgh9CzLiKFuhlcW6mAC1VnK7P1GwYaRhatdffLrv%2Fl1gyhMGy0DxCSzwFgFd1le1%2FF%2FLHXyKwiqD2WK0Bmf7LSR66ahxYDtpEyeThuOxR437AHLZclNz5Cx6hNjfZwATwZMpRSfpIcsP14wkiuPC2sCaYwUsVZnDoEUuZ3QokEo%2BoeDP57DvZXhyINqi2qtmAtOxgTB3i09gPB8ix8kRHfsLzuWo7czlf9I75H6f8OCQSmeVeeoAfLKmNxFzSPP130RBzdNtpfNTQfMZDcbShJUCG%2Brx0nrjo3358xXnNP0DDaCpDoi0lqgezdrrMMmH6coAdwGXwHZ%2BLwlT7fpCGsQ5wGzIm8dtf9QBoAPbmffERmgfUUNd4wUQol1xKmPmpIKZsA%3D%3D',deadline: '2027.3.31'},
          { name: '淘宝秒杀福利攻略', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269983%4021660e40_0fd4_1a098cd3f58_0eb4%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020024199&e=m%3D2%26s%3DU3QReI5%2F7MJw4vFB6t2Z2iperVdZeJviAMbqNcPEYg6VPNdSusZCyjLxqsKAeUFqvK7QnAVfVsYWpIFXOotQwwPYd2JIcg8KNxtZhW1pGjuHpmTFoS5hnbglIm5R4efLMaHbvS4gHhY%2BZJCZmxLUjZLL0QPsyT77slidLc%2FfR2bfW12dRBt0XJ7LmQijlljrM7kxpdONUAJO%2BUYP1EdsAAxpZcrQgocwtY4Qt2cZ1lX%2BScqIfI2efAGlSouziL7im55ueBKUjkupLnU4%2Bi%2BR50mrjM%2BjytwFOGqnJVTjqMNxMW%2FKNdgpUbOrC2ox3DRJuyhJem%2BM5OpTr8KBxJSHMTotCehMwhg5NcwDbqGDeU2YXTvsewbNJ82hlnQUPQz5PGUvR2bxYPSAvxOfb3g%2BHaLFti4h47QWumNoN%2BFJZrA1zANuoYN5TbFXHX0kJnCwI%2Bdd%2Bfukxcz6h3w2dY9AECmrELWwLL21ThKF0o4A2eoxYAAB%2BgIoOGay2%2Bq5j7t5eAUkyW2QD9M0Djd413xhDsDlE6H93yEw17wnkme1OdGDcT9IgYeWF638oUZqN1%2BOnCYxhepIlvPou6f8Q2dZB280f0RUfeurrwXw4oEu9whvNH9EVH3rq7EQEkfgh1%2FyaaLuL5byU3TrcxJkzondtEgIPsEFBJAt7YnTG6SG9ALjHmRkFd9K8osXyMV5Rv6bjOSebyVjHAd22K7%2FvPQBEn5d%2BHYkafQuJa7kfk0V5kdLhqIz7DLH1vkP9agwOf5HcGU56P3rHt7tQMiXjbIHsCW52rAoq%2BWE0GIWZp1fKMUM%2B7XZOBKdtm1%2BMNutVMsdE%2BnzbZc8PhC%2BX0miyBwMR6RSnP%2Bjws5vQhHasD9Fw5nrQcI4gLvqcHD%2BtjiU1GCz7VoKTnhoVZzF9pmjr3A%2ByMYMXU3NNCg%2F',deadline: '2027.3.31'},
          { name: '百亿补贴福利攻略', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789270021%402104c3f0_0dff_1a098cdd3f5_d116%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020023429&e=m%3D2%26s%3DirTs%2Bp8oO99w4vFB6t2Z2iperVdZeJviAMbqNcPEYg6VPNdSusZCyjLxqsKAeUFqm%2BakExGFuBAWpIFXOotQwwPYd2JIcg8KNxtZhW1pGjuHpmTFoS5hnbglIm5R4efLMaHbvS4gHhY%2BZJCZmxLUjZLL0QPsyT77slidLc%2FfR2bfW12dRBt0XJ7LmQijlljrM7kxpdONUAJO%2BUYP1EdsAAxpZcrQgocwtY4Qt2cZ1lX%2BScqIfI2efGSU5VezQy%2B8Sry%2FfIWctIZ353QEOuri5AmYSF%2Bg6w5KDiPfCxBqKAkVl14TVNGhe79PSeRRqMEfRkisNa9ZmA5Y9BSzkJxwjydS5fhzsqHUlDjafUgTNqU1zANuoYN5TYgPh2VpbvcTG2fda9XI1CR59mlsNMqux2dDmufSs8E3y6QgokD7R2e5Q8ejROUAaIlPQOd55rQtMVoOf%2FGmc3O9Qq%2FJA0Ph7VK2ieBiiv%2F04TlTTFVgQTeyZgxYNQFCmDXMA26hg3lNu1nT4HFnvdiVf3fW2WlnnNMLIoCZEGuk391yyS7yuKIfJ17MycnRpbYHfyztyf2vMX8tYF3Z8NmzXpg9yzRxYQfxezQJXLiNX6gU29k7k77pwAi2s2uqa%2Ft1c%2FlshipPSZ6Us1AL8sLjkOUQ%2FOHRwG39gdLgduK%2B23tA3o2xbrg%2FAQLebH9F4U5GMb%2BuxKK8vze4IdzvwXOzel1pasU%2FAmK0ok025E%2FNWW4S9N7xFzwbphYc0fKR4g%3D%3D',deadline: '2027.3.31'},
          { name: '淘金币-首页', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789270135%402166ce8e_1af7_1a098cf94a2_2c1b%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020021239&e=m%3D2%26s%3D%2BkxPVm%2F3%2FzRw4vFB6t2Z2iperVdZeJviPI5Rhak06vZnX1vWUft3ZbmzyRzShjps9sPDIN%2B1k8BJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FiBN3iHUGXXBpZGXrmd%2F20Q8DNcowo52TG0GzdAMqThcEZtDKPoHWr7QBRB1XJCO2%2BfzWaXUI0sbt2M2aThuS8OeEV%2BM%2BWE6mfAUxBJ7QMuvLrH8G7ukt%2BGxBvFw9e%2FchuOiyeyYFk6I5LiUi7wG4pOxTHYMQUuvfnE9PLRcB6KMm%2FrHB9aiVckS6fqAUnbbCihtacgwc7B7HcBNmv0LWykt6Al0f1nOmezdBSLFmcRGGVODTK8rEVdvw1bmSfYOsiNjmxpznqqIJUDX1NkCoJTP2WiXpXS%2B3m7WdPgcWe92JV%2Fd9bZaWec0wsigJkQa6Tf3XLJLvK4oh8nXszJydGltgd%2FLO3J%2Fa8xfy1gXdnw2bNemD3LNHFhB%2FF7NAlcuI1fqBTb2TuTvunACLaza6pr%2B3Vz%2BWyGKk9JnpSzUAvywuOQ5RD84dHAPqWAVzgsoVgdT0h7zWA6REj5IuxaywmXTialeeKhDUssapmhEOIPlmrfoGyYVx1VSIF9%2Bh1aQq4MYUXSoKiLu5GIV2f8h%2FgL',deadline: '2026.12'},
          { name: '手机以旧换会场', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789270057%402104ba69_0e0f_1a098ce6333_35cb%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020020841&e=m%3D2%26s%3DPPAsS5k4ZwJw4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0GmrbRibtYMz4vIHJ4Vga3VSuewCsBSbS6oN95bG9f%2BFUZHYLBVvqBh2JFnLDKcohCUZ%2FJYwIzSxAGIx0oe2X2hZfJ7ZQxC1%2Fb%2BmvmXqUq2iEBnEBk3xaGylLmcSHKfaX1CIFRJhZoJ2keMqUwSQcLSwn1IXvusdyogaseAKBk0cEzJFLUun%2BFGDWrJcI%2B9mMkt2lYwodYMFf7Le49%2F8qY%2BP%2BRk9cvLur6qSzuDllkagHasOMC6lPkufF2mNtOHXW%2B%2F9SMD5NOKOiuzH7pZzJf1Al4Mu5%2BSzwYgPh2VpbvcT8PwOkD4ulZfxvNaaibhIncDlE6H93yEw17wnkme1OdGDcT9IgYeWF%2FeiVvaEiF03Z3NEK3xpqJbSI3BAxQUGQUh0cHOFM3Ao1kl92QDXZxeL9KTtwfNmuzWqJ3AzuilEdAPP%2FyzxI%2BtoozOG12Prbu65eUezHeXAUWGUkU8IbJzGDmntuH4VtA%3D%3D',deadline: '2026.12.31'},
          { name: '3c数码以旧换新会场', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789270090%40213f5ebe_1e6c_1a098cee2ba_0ee6%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020020704&e=m%3D2%26s%3DiZ2fGmubPHhw4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0GmrbRibtYMznvbcH6umLRlSuewCsBSbS6oN95bG9f%2BFUZHYLBVvqBh2JFnLDKcohCUZ%2FJYwIzSxAGIx0oe2X2hZfJ7ZQxC1%2Fb%2BmvmXqUq2iEBnEBk3xaGylLmcSHKfaX1CIFRJhZoJ2keMqUwSQcLSwn1IXvusdyogaseAKBk0cEzJFLUun%2BFGDWrJcI%2B9mMkt2lYwodYMFf7Le49%2F8qY%2BP%2BRk9cvLur6qSzuDllkagHasOMC6lPkufF2mNtOHXW%2B%2F9SMD5NOKOiuzH7pZzJf164dcwJh9C1IgPh2VpbvcT8PwOkD4ulZfxvNaaibhIncDlE6H93yEw17wnkme1OdGDcT9IgYeWF%2FeiVvaEiF03Z3NEK3xpqJabS3bkvjyCktEw%2BoDaXw44DFTPrQE%2FwYHY0Kv%2FZWfRX8IjLG4JKw5wY9yFt7q0Pepqe03JJ4BNkji6tmDO5FGniApBDxFNV2HGDmntuH4VtA%3D%3D',deadline:'2026.12.31' },
          { name: '淘宝省钱购', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789270208%402132a16d_168d_1a098d0b040_75ca%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020019405&e=m%3D2%26s%3DmNQ0ApnOnKVw4vFB6t2Z2iperVdZeJviAMbqNcPEYg76sTlfBitgxDLxqsKAeUFqBQ6e6wIPuKkWpIFXOotQwwPYd2JIcg8KNxtZhW1pGjuHpmTFoS5hnbglIm5R4efLMaHbvS4gHhY%2BB0zf4OD7u5LL0QPsyT77slidLc%2FfR2bfW12dRBt0XJ7LmQijlljrM7kxpdONUAKgtf8I59Gmj7WOELdnGdZV3eHn14rW1PBcfk1oQPCr5xDqzYVRkKA1NNRdkxXQuw4D2HdiSHIPCjcbWYVtaRo7h6ZkxaEuYZ24JSJuUeHny6P5nONact2X9hl0nxWy%2BeTjkOUQ%2FOHRwAPUBlppf%2Btjs7UNLsd2bI5z8saC7t5FlO9Zh8BraVZYKlC32AlzgFNwCpM7b0u7GrRGv5AGWE1GOXml0bvRNQ5hBWWO8SF%2FEVHqgD8FVzjyI8kKDQ%2BOmM72LzEJDzuq%2BBnipH9FrWQs0l2xEI0ZxCfjj8ZwH9oF8jsBZCgkXSfeqmElsSP3dMSYc4vPBfYgeWdzRCt8aaiWom%2FlyvbH2VstA6CfUbUcHof0gj4ooPdlt%2FzpIVa2KFQoZ1JnG7JucOU5IHgc0NtVeZTJx0BrHOPfg0cSaYCnGiD9FrwJZgXnxg5p7bh%2BFbQ%3D',deadline:'2027.3.31' },
          { name: '超级满减', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789270259%402104c361_1b74_1a098d177f2_6cbd%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020019468&e=m%3D2%26s%3DXJO%2FUQRROgdw4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0GmrbRibtYMzVIUOwLrt%2BYZSuewCsBSbS6oN95bG9f%2BFUZHYLBVvqBh2JFnLDKcohCUZ%2FJYwIzSxAGIx0oe2X2hZfJ7ZQxC1%2FROstmOE9LRyEBnEBk3xaGylLmcSHKfaX1CIFRJhZoJ2keMqUwSQcLSwn1IXvusdyogaseAKBk0cEzJFLUun%2BFG46AnjdArOn5fyjv0Go8KlRtpiXK2sVSP9pnV9qtK2WV9Jui1P6C6az5NWqJ5LsPcrOtp58OXWEYgPh2VpbvcT8PwOkD4ulZezeFvL3yy7MmdzRCt8aaiWom%2FlyvbH2Vt6OzUqBbyiQTazJrtZIk1ofFspG%2BcOKfNXKao%2BNvh8HiK4M2x129bN0l8z3tTODu5u6J20eGFDn4sxscpjUAjZxg5p7bh%2BFbQ%3D', deadline: '2028.8.31' },
        ],
      },
      {
        title: '拼多多',
        items: [
          { name: '多多福利券，天天有惊喜', link: 'https://mobile.yangkeduo.com/muti_coupon_rec.html?_pdd_fs=1&__page=ddjb_act_coupon_adv&__mav2=1&traffic=web_gen_url&pid=40353314_284993965&cpsSign=ZXMP_260908_40353314_284993965_59608ad4810c06f4f217e0510038efd6&_x_ddjb_act=%7B%22st%22%3A%22168%22%7D&traffic=prom&duoduo_type=2' },
          { name: '地区购物补贴', link: 'https://mobile.yangkeduo.com/muti_coupon_rec.html?__page=duo_tencent_subsidy&pid=40353314_284993965&cpsSign=CSC_260908_40353314_284993965_83994ef8f5fb49dc4c35a0fde0c635c5&_x_ddjb_act=%7B%22st%22%3A%2215%22%7D&duoduo_type=2' },
          { name: '领券中心', link: 'https://mobile.yangkeduo.com/duo_transfer_channel.html?resourceType=40000&pid=40353314_284993965&cpsSign=CE_260908_40353314_284993965_29cbbf0cd5b7f043827021781c59c6ac&_x_ddjb_act=%7B%22st%22%3A%226%22%7D&duoduo_type=2' },
          { name: '最优玩法', link: 'https://mobile.yangkeduo.com/duo_collection.html?__page=dynamic&pid=40353314_284993965&duoduo_type=2' },
          { name: '今日爆款推荐', link: 'https://mobile.yangkeduo.com/duo_today_burst.html?pid=40353314_284993965&cpsSign=CM_260908_40353314_284993965_cd9f0c56fa9affae067d07e91b6af9cd&_x_ddjb_act=%7B%22st%22%3A%223%22%7D&duoduo_type=2' },
        ],
      },
    ],
  },

  // ────────────── 酒店旅游 ──────────────
  {
    id:'xiecheng_travel',
    label: '🏨 携程旅行',
    sections: [
      {
        title: '携程旅行',
        items: [
          { name: '携程老友会，0购物0自费，100%严选安心服务！', link: 'https://t.ctrip.cn/xbFv7H5' },
          { name: '携程酒店，支持全球酒店预订！', link: 'https://t.ctrip.cn/pVufKgm' },
          { name: '携程酒店预售，爆款首选', link: 'https://t.ctrip.cn/5fvY571' },
          { name: '携程门票，当天可定！随买随玩！', link: 'https://t.ctrip.cn/qPkFGHj' },
          { name: '携程美食林！', link: 'https://t.ctrip.cn/9FQ85MG' },
          { name: '携程玩乐，当天可定！随买随玩！', link: 'https://t.ctrip.cn/d2cZc9I' },
          { name: '携程换汇，畅游全球。银行多，免预约，快速取钞！', link: 'https://t.ctrip.cn/iGNH1WJ' },
          { name: '携程机票，国内国际机票预订！', link: 'https://t.ctrip.cn/03rFSgB' },
          { name: '携程火车票，国内火车票随时预定！', link: 'https://t.ctrip.cn/j6tLSHH' },
          { name: '携程专车，国内国际接机不用等！', link: 'https://t.ctrip.cn/kt4ob9S' },
          { name: '携程汽车票，畅游到站无忧', link: 'https://t.ctrip.cn/aUIxzvI' },
          { name: '携程租车，海量车型任君挑选！', link: 'https://t.ctrip.cn/4QZwtEq' },
          { name: '携程自由行，支持预订全球自由行！', link: 'https://t.ctrip.cn/4CVaIQJ' },
          { name: '携程跟团游，一站式团队旅游服务，安全有保障！', link: 'https://t.ctrip.cn/q4dybUM' },
          { name: '携程助您签证无忧！在线办理，拒签全退！', link: 'https://t.ctrip.cn/cWEKyIc' },
          { name: '搜索全球旅行必买好物', link: 'https://t.ctrip.cn/wFoPPpD' },
          { name: '1V1定制|在线比价|代订资源|行程无忧', link: 'https://t.ctrip.cn/biN4TBJ' },
          { name: '1V1定制|在线比价|代订资源|行程无忧，定制师免费出行程方案，定制您的专属旅程', link: 'https://t.ctrip.cn/wwvOZ2x' },
        ],
      },
    ],
  },
  {
    id:'tongcheng_travel',
    label: '🏨 同程旅行',
    sections: [
      {
        title: '同程旅行',
        items: [
        { name: '同程酒店，让每段旅程，都邂逅家的温暖与美好', link: 'https://s.ly.com/Hsx2zm6eB' },
        { name: '国际酒店预订就选同程，让环球之旅，每一站都拥抱家的温馨与奢华', link: 'https://s.ly.com/6wnK8q6tS' },
        { name: '跨越传统观演界限，尊享顶级赛事殿堂级沉浸式盛宴', link: 'https://s.ly.com/2wAB8q6CJ' },
        { name: '【一张门票，开启无限精彩!】这不仅是入场凭证，更是通往奇妙世界的钥匙', link: 'https://s.ly.com/2wGM8q6IU' },
        { name: '预订民宿就上同程。让每一场奔赴，都有归家的温度', link: 'https://s.ly.com/vwbL8q6GT' },
        { name: '🛫同程旅行，让你便宜到爆炸的国内机票和酒店一键搞定！', link: 'https://s.ly.com/bw2N8q6dV' },
        { name: '🌍 想要游全球？同程旅行一键搞定！价实惠，省心到爆炸！', link: 'https://s.ly.com/Qt1lrn6RM' },
        { name: '🚄极速抢票神器，同程旅行承包你的火车出行！', link: 'https://s.ly.com/xscLym6Jj' },
        { name: '周末微度假神器，1小时直达山海湖林！不用抢票、不用纠结，轻松上车出发！', link: 'https://s.ly.com/jsHMym60k' },
        { name: '23元打车券免费送', link: 'https://s.ly.com/BuPBwo6q7' },
      ],
      },
    ],
  },
  {
    id: 'feizhu_travel',
    label: '🏨 飞猪出行',
    sections: [
      // {
      //   title: '携程旅行',
      //   items: [
      //     { name: '携程老友会，0购物0自费，100%严选安心服务！', link: 'https://t.ctrip.cn/xbFv7H5' },
      //     { name: '携程酒店，支持全球酒店预订！', link: 'https://t.ctrip.cn/pVufKgm' },
      //     { name: '携程酒店预售，爆款首选', link: 'https://t.ctrip.cn/5fvY571' },
      //     { name: '携程门票，当天可定！随买随玩！', link: 'https://t.ctrip.cn/qPkFGHj' },
      //     { name: '携程美食林！', link: 'https://t.ctrip.cn/9FQ85MG' },
      //     { name: '携程玩乐，当天可定！随买随玩！', link: 'https://t.ctrip.cn/d2cZc9I' },
      //     { name: '携程换汇，畅游全球。银行多，免预约，快速取钞！', link: 'https://t.ctrip.cn/iGNH1WJ' },
      //     { name: '携程机票，国内国际机票预订！', link: 'https://t.ctrip.cn/03rFSgB' },
      //     { name: '携程火车票，国内火车票随时预定！', link: 'https://t.ctrip.cn/j6tLSHH' },
      //     { name: '携程专车，国内国际接机不用等！', link: 'https://t.ctrip.cn/kt4ob9S' },
      //     { name: '携程汽车票，畅游到站无忧', link: 'https://t.ctrip.cn/aUIxzvI' },
      //     { name: '携程租车，海量车型任君挑选！', link: 'https://t.ctrip.cn/4QZwtEq' },
      //     { name: '携程自由行，支持预订全球自由行！', link: 'https://t.ctrip.cn/4CVaIQJ' },
      //     { name: '携程跟团游，一站式团队旅游服务，安全有保障！', link: 'https://t.ctrip.cn/q4dybUM' },
      //     { name: '携程助您签证无忧！在线办理，拒签全退！', link: 'https://t.ctrip.cn/cWEKyIc' },
      //     { name: '搜索全球旅行必买好物', link: 'https://t.ctrip.cn/wFoPPpD' },
      //     { name: '1V1定制|在线比价|代订资源|行程无忧', link: 'https://t.ctrip.cn/biN4TBJ' },
      //     { name: '1V1定制|在线比价|代订资源|行程无忧，定制师免费出行程方案，定制您的专属旅程', link: 'https://t.ctrip.cn/wwvOZ2x' },
      //   ],
      // },
      // {
      //   title: '同程旅行',
      //   items: [
      //     { name: '国庆全球游早鸟价，限时1000元大额券包', link: 'https://kurl08.cn/txhcfJ' },
      //     { name: '同程内部员工专享酒店优惠', link: 'https://kzurl18.cn/txhLe5' },
      //     { name: '爆款套餐5折起预售，超值囤货！', link: 'https://kzurl18.cn/txhL99' },
      //     { name: '领百元入住红包，订房特惠5折起再减', link: 'https://kurl05.cn/txhLTP' },
      //     { name: '酒店晚晚不过百', link: 'https://kurl05.cn/txhLk9' },
      //     { name: '天天特惠，百元住民宿', link: 'https://kurl04.cn/txhLyW' },
      //     { name: '66元起钟点房特惠', link: 'https://kurl06.cn/txhLOv' },
      //     { name: '境外酒店专享福利，领888元补贴红包', link: 'https://kzurl18.cn/txhLZx' },
      //     { name: '全球目的地随心探索，国际酒店一键轻松订', link: 'https://kurl08.cn/txhLIK' },
      //   ],
      // },
      {
        title: '飞猪出行',
        items: [
          { name: '办签证上飞猪，立减30元', link: 'https://a.feizhu.com/2qn6vC' },
          { name: '飞猪酒店热门精选、天天特惠', link: 'https://a.feizhu.com/3q16xL' },
          { name: '底价抢先订，领券下单低至3折起', link: 'https://a.feizhu.com/3lT77o' },
          { name: '飞猪酒店天天特惠，最高立减150元，订房6折起', link: 'https://a.feizhu.com/2QUOyd' },
          { name: '领政府文旅补贴，单笔最高立减600元', link: 'https://a.feizhu.com/3WFJeq' },
          { name: '88会员更优惠，大牌酒店85折起', link: 'https://a.feizhu.com/3q16xL' },
          { name: '飞猪特价门票，低至5折起', link: 'https://kurl06.cn/txhh54' },
          { name: '飞猪机票活动，不止5折', link: 'https://a.feizhu.com/3tKMcE' },
          { name: '全网严选高星酒店 好房5折起', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789274783%400b52291f_0db6_1a099167e2b_4079%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027618&e=m%3D2%26s%3Dxfo%2FALaM3olw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjps4b70r0fAnWdJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b5WH5moke253sYkY97mnO%2Fh4RX4z5YTqZ1dlc7ZjpFf6Hoa1Sr%2BxpXHRTitSXl54eV7VDiGWf5QXa4uMo5ttScj%2BmCgdowa4Jv3rXByHKCv5HjLzd%2FE%2BWVu%2B9nzZvOpT%2BEflLgrqP3hzRQBRwtGMduuAvxOfb3g%2BHSAmPO7PYxf4AQSUYEc3jX7L6V3pkWat61%2B2hPcX8rJGGtuiaMlJYk830GxxTiTbYZCRsY%2F8NVZaCJJHHcCf3Drup5TKVZzpNJfdzDItOUCGwBd29%2FS66hFhCHeAi4Yh%2FgivBTXkaMvFli%2BMV9FnYUEmvPRXnfm9BLTy7ksugmhNKYf5CNjlTlF%2FFq65eHHhxnoZRKchLMlAxiXvDf8DaRs%3D',deadline:'2126.8.31' },
          { name: '淘端酒店会场', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789274859%4021674880_0d10_1a09917a6bf_60f7%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027075&e=m%3D2%26s%3Do23AO1EwSSZw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpsUpL65%2Fulk1VJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b9XSpRlaJaElaJe2Xd4pkBlyeNAoQluSajK%2FmpnItMR0oVa05xHttSU4XWtTRmgWnCCW5iAZOzgO56oz2h0JSXizrmiLf7vt2sZ62EHkJNZyNmbPeXlRkt2IEi4Qw1bCnZbfieIyIblOkh5%2FZgU7Pi6MFy0Uq%2BYsHAz7tdk4Ep22bX4w261Uyx3Y4unVkj49ueMcgpR1lXsufAhn03tPGrBEepAKOhfA9107%2F%2BfNFtbp%2FgZb8yaXh5STnJpwZznOOk19MMaham4iZ9AQkrCl3Q8%3D',deadline:'2126.12.31' },
          { name: '闪购特价酒店', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789274910%402166e047_1ae5_1a099187046_dd80%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027074&e=m%3D2%26s%3DCzikrw7lv45w4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpsoJg2KvmoHmRJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b9XSpRlaJaElaJe2Xd4pkBlyeNAoQluSajK%2FmpnItMR0oVa05xHttSXTLOyX%2FAe9j6ZWg0DGwHSg7CzvptU%2B4ylZUntLJ%2B0PpxP3td72NHg9ErgNfAAXwUuID4dlaW73E%2FD8DpA%2BLpWXIqhj7dEOncVEOBbYZfcU971fDuQUfY9mKaNhph4aLh5%2FlzILFlmmleJnNi%2F7od8hNcwDbqGDeU3Dk9vFOQ3Ms1IMG9TIFQq2ZIFcHD4VkUk30GxxTiTbYQehqAEVMyutO40KHY7b8Bbup5TKVZzpNJfdzDItOUCG5opYXspgnEFhCHeAi4Yh%2Fk6NLZZdIw5CZJ2jiexVoYH0%2FSojh29GRQsLREpU%2FmU5OwlCXpgyLnS7jk3t3Uq8T1Kc%2FJqEq3%2FyxiXvDf8DaRs%3D', deadline: '2126.12.31' },
          { name: '酒店新人会场', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789274961%400b51a413_1a61_1a09919364a_dc59%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027073&e=m%3D2%26s%3DeKhAcleOQudw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpspTDPDUF0k4BJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b5WH5moke253sYkY97mnO%2Fh4RX4z5YTqZ1dlc7ZjpFf6Hoa1Sr%2BxpXHRTitSXl54eV7VDiGWf5QXa4uMo5ttScgdhLfz86WN4Ci5Yg62k3biWE3kTXCudvIEu%2Fw7izBSsstFGGiDRhwPQn7KXfNuyg1GSKw1r1mYDlj0FLOQnHCPV0RHBR9eibJ%2Fo6GUdzwLmaI3EB8yXhkKcHEERAA%2F%2FcPXM6lMeEwkDGY9UjoMaQeehym3fMfln9B2oZJMPio6kUmelLNQC%2FLC45DlEPzh0cCYl0dxouexvJJX79NWDb6V5FpoXtBEUX2F1r2sGrcsp3PDsv%2F0ZYofdQKUEG7r2RGpMIwdsjPmonyK9GiNISxJ7C%2B3ksjmHFyiZ%2BQMlGz6FQ%3D%3D',deadline:'2126.12.31'},
          { name: '飞猪特惠酒店主会场', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789274999%40213fdb13_0df0_1a09919cbdb_3317%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027072&e=m%3D2%26s%3D3TOBHj26Cwpw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpsWC8jzsbtoaZJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b5WH5moke253sYkY97mnO%2Fh4RX4z5YTqZ1dlc7ZjpFf6Hoa1Sr%2BxpXHRTitSXl54eV7VDiGWf5QXa4uMo5ttScgdhLfz86WN4Ci5Yg62k3biWfOQCldfxELZR%2Fsg3aAHOwI8wY57tuPwL2r8vGNhI%2F9nm%2F0osGmDCndcBMQABCNjzArxMoyWaFE9CgoF0dXKNhCGP4HQOfqjbCI%2BvWvBueUy8kuF8IwK5dNofjJaFOfxZU75uS4nz03cZLpyJFuH2mdzRCt8aaiWNKvTq4ePStlVDyWDmdo89XT8NOJo3I%2BMK3MaA80aC17HNfiENd%2BafAUWx5VVbUyJYw9clRNBWPHMVITJbrG4kQs%2FE8eYZwTAIYULNg46oBA%3D', deadline: '2126.12.31' },
          { name: '酒店百元会场', link: 'https://https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789275071%40212bd749_0d87_1a0991ae41d_71ac%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027071&e=m%3D2%26s%3Dul6v3MxNTo9w4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpsvP673UIn7PlJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b5WH5moke253sYkY97mnO%2Fh4RX4z5YTqZ1dlc7ZjpFf6Hoa1Sr%2BxpXHRTitSXl54eV7VDiGWf5QXa4uMo5ttScgdhLfz86WN4KAKGJO2zp5UrGvhtAwJkRSy2b%2BwQJ53FEQ4Fthl9xT3vV8O5BR9j2aID4dlaW73E%2FD8DpA%2BLpWXESyLaONuMurcq1u0haS3AttvOgRvWAIzhKTgEtZvJ0CPeZxvNcbtTJbfieIyIblOkh5%2FZgU7Pi6MFy0Uq%2BYsHAz7tdk4Ep22bX4w261Uyx3PCB%2BNYEFGzEJXvy192dgMIeUzLx9nqM46IhYxY6S2X%2B4TKtMMptFVQPvXolLcxjRh5dhyFxKcd51A7x2Lgp2TH%2Fc3TNHhwsE%3D', deadline: '2126.12.31' },
          { name: '酒店连锁会场', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789275106%40213ee14f_0d68_1a0991b6e27_83cf%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027070&e=m%3D2%26s%3D1JzSKO%2BF4Xtw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpsrXskoGLBJ7RJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b5WH5moke253sYkY97mnO%2Fh4RX4z5YTqZ1dlc7ZjpFf6Hoa1Sr%2BxpXHRTitSXl54eV7VDiGWf5QXa4uMo5ttScgdhLfz86WN4C6gVNJa07xufcB63Z2CJ8HLhCvPiWncxL72fNm86lP4R%2BUuCuo%2FeHNFAFHC0Yx264C%2FE59veD4dICY87s9jF%2FgBBJRgRzeNfsvpXemRZq3rX7aE9xfyskYKUB84JcX7%2FTfQbHFOJNthB6GoARUzK607jQodjtvwFu6nlMpVnOk0l93MMi05QIY0W0OY%2B%2FUaf2EId4CLhiH%2BUo5yIMhh6YQYfo0gbjMwhm%2FQve4zoJIoL%2BmuaNTvVYl62O6FzOqFZWh6WGLouqjiifYOyazcA48hhQs2DjqgEA%3D%3D' , deadline: '2126.12.31'},
          { name: '酒店亲子专享', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789275151%400b51e876_0d32_1a0991c1e37_7458%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020027069&e=m%3D2%26s%3DNXDpYx5tF1tw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpsy%2FSedUEvodlJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b5WH5moke253sYkY97mnO%2Fh4RX4z5YTqZ1dlc7ZjpFf6Hoa1Sr%2BxpXHRTitSXl54eV7VDiGWf5QXa4uMo5ttSci7IoM49qAJPoVHC8VcLL%2FgOYj%2B76mVRkUQWkyDcuVM0skR9HN3Q9Vis7UNLsd2bI5z8saC7t5FlEFD4gJaHxdg%2B6KF0BYBDz7i%2BHTUEqkLOsPALudx56V7e6RT9IWTDv1LiXhqhFTK9N7OEYnuTAS74R2aEu5RqWRVXRkZOvK%2FVyaa21c5k%2BY9vm29DWxTxbY%2FNDyar2lzxMcY77HrIRA6BJNUlPps4F1Vn8yqwWyt9fu6mOuBfUn8UqI%2BIv1uklfkohQ7oHq1BwBNygXKzKXo' },
          { name: '政府文旅补贴', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789275193%40213360ed_1eaa_1a0991cc20d_94e8%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020026027&e=m%3D2%26s%3DokRDcr%2FtJWRw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpseazMLV3yzlxJ97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7b5WH5moke253sYkY97mnO%2Fh4RX4z5YTqZyf0eQsmvNjEiVYjHskzwM19avia1WzDa%2FLmLbGlg%2Bl3xAwj6ouEw57Q5uvuSKu2BxHZxsMuS08uIg56diQUhdrx3lnJdRuLnzgcesbGACJSXjc9b4PJLBb8oqAR%2Fxya40nedZQlzRSKedbCds0TJA9pthrewRMTWSJ1HYYSxs2FlpFVoPJpQfEEOmV2orYgwZST7SUkD%2FF7JBMjt6GpwDVGtBQZagwe7YI9OEiCJd0Sg%2BCIKGINxvJxKmPmpIKZsA%3D%3D',deadline:'2035.10.25' },
          { name: '飞猪酒店特惠', link: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789275281%40213ede7b_1b97_1a0991e182c_b04d%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020013212&e=m%3D2%26s%3DrrTE%2BdFx5Sdw4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZbmzyRzShjpsf%2Fug5Q%2BuLr9J97zhtcSo6svPGLvBbfpKdx2L%2BhbrtHcAuD%2BepaUWbEF9QWNxdP%2F5qwgOWsQKa%2FjqVN6yUKh2837uq6sLYIqu0Q7QOybCaQxAFEHVckI7bx2Kuu%2Bq%2FpBOnaYpFBIfC%2F0TMkUtS6f4UVr77YmOz2493OVy%2FQx3hpiRHQkMDToB1dGEmB64c35h7%2F1IwPk04o6e%2FfKAsrm0GrZtKtQThrtKOf51IOPpaMJ%2Fs5VND2nbRjUTYF1OMWLwtdJz%2B66s0U0NxtKElQIb6vHSeuOjffnzhRbph%2BQAtrSGp8moYpS5rquVQxJVXLw77RnOB5x%2BW5sCteCnrCtruO1gf%2BgW%2BtQvdVPlNzXGAnPXq2OdOgPK48YMXU3NNCg%2F',deadline:'2126.12.31' },
        ],
      },
    ],
  },

  // ────────────── 出行 ──────────────
  {
    id:'didi_ride',
    label: '🚗 滴滴出行',
    sections: [
      {
        title: '滴滴出行',
        items: [
          { name: '滴滴酒店，最高可领200元抵扣券', link: 'https://kurl08.cn/txR5Jg' },
          { name: '南航机票立减券：满600元减20元', link: 'https://kurl07.cn/txR5Cx' },
          { name: '网约车用户可领取8折打车券，单笔最高抵扣10元', link: 'https://kurl06.cn/txRKjA' },
          { name: '网约车、顺风车、代驾优惠券', link: 'https://kzurl18.cn/txy3Fv' },
          { name: '滴滴打车红包天天领', link: 'https://kurl07.cn/txRW89' },
          { name: '每日领网约车&代驾大额红包', link: 'https://kurl07.cn/txRWhB' },
          { name: '滴滴代驾最高可领20元立减券', link: 'https://v.didi.cn/qvJwjMz?source_id=179175jutuikeh5mall&ref_from=dunion' },
        ],
      },
    ],
  },
  {
    id:'huaxiaozhu_ride',
    label: '🚗 花小猪出行',
    sections: [
      {
        title: '花小猪出行',
        items: [
          { name: '最高领128元优惠券包', link: 'https://kzurl18.cn/txRKXA' },
          { name: '新客最高可领100元券包', link: 'https://kurl07.cn/txRWeE' },
          { name: '老客最高可领100元券包', link: 'https://kurl04.cn/txRWyX' },
        ],
      },
    ],
  },

  // ────────────── 生活 ──────────────
  {
    id: 'life',
    label: '🎯 电影票 · 快递',
    sections: [
      {
        title: '电影票 · 快递',
        items: [
          { name: '电影票在线预订，最低19.9元', link: 'https://kurl04.cn/txh9iy' },
          { name: '寄件享4折起优惠，低至5元寄快递', link: 'https://kurl06.cn/txh9El' },
        ],
      },
    ],
  },
];
