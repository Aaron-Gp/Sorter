// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  return await db.collection('china')
    // .where({
    //   gdp: _.gt(3000)
    // })
    // .field({
    //   _id:false,
    //   city:true,
    //   province: true,
    //   gdp: true
    // })
    // .orderBy('gdp', 'desc')
    // .skip(0)
    // .limit(10)
    // .get()
    .where({
      province: '广东'
    })
    .remove()
}