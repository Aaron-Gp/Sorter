const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  if(event.array=='array1'){
    return await db.collection('Sorter').doc('test').update({
      data: {
        array1: _.push({
          each: [{'nickName':event.nickName,'imgUrl':event.imgUrl}],
          position: event.order
        }),
        num1: _.inc(1)
      }
    })
  }
  if(event.array=='array2'){
    return await db.collection('Sorter').doc('test').update({
      data: {
        array2: _.push({
          each: [{'nickName':event.nickName,'imgUrl':event.imgUrl}],
          position: event.order
        }),
        num2: _.inc(1)
      }
    })
  }
}