const moment = require('moment')

const {
  mongoose
} = require('../utils/database')

// 定义数据库集合的域的数据格式
const positionSchema = new mongoose.Schema({
  companyName: String,
  positionName: String,
  city: String,
  createTime: String,
  salary: String,
  companyLogo: String
})

// 创建一个集合，集合名字用名词复数
const Position = mongoose.model('positions', positionSchema)

// 插入操作
const save = (data) => {
  data.createTime = moment().format('YYYY年MM月DD日 HH:mm');
  let {
    positionName,
    companyName,
    city,
    salary,
    createTime,
    companyLogo
  } = data

  const position = new Position({
    positionName,
    companyName,
    salary,
    city,
    createTime,
    companyLogo
  })

  return position.save()
    .then((result) => {
      return true
    })
    .catch((err) => {
      return false
    })
}

// 查询全部
const listall = ({keywords}) => {
  const reg = new RegExp(keywords, 'i')
  return Position.find({
    $or: [{
        companyName: {
          $regex: reg
        }
      },
      {
        positionName: {
          $regex: reg
        }
      }
    ]
  }).sort({
      _id: -1
    })
    .then((result) => {
      return result
    })
}

// 查询单条
const listone = (id) => {
  return Position.findById(id)
    .then((result) => {
      return result
    })
}

// 分页查询
const list = ({
  pageNo,
  pageSize,
  keywords
}) => {
  const reg = new RegExp(keywords, 'i')
  return Position.find({
      $or: [{
          companyName: {
            $regex: reg
          }
        },
        {
          positionName: {
            $regex: reg
          }
        }
      ]
    }).skip((pageNo - 1) * pageSize).limit(pageSize).sort({
      _id: -1
    })
    .then((result) => {
      return result
    })
}

// 删除
const remove = (id) => {
  return Position.findByIdAndRemove(id)
    .then((result) => {
      return true
    })
    .catch((err) => {
      return false
    })
}

// 编辑
const update = (body) => {
  let {
    id,
    positionName,
    companyName,
    salary,
    city,
    companyLogo
  } = body

  let options = body.companyLogo ? {
    positionName,
    companyName,
    salary,
    city,
    companyLogo
  } : {
    positionName,
    companyName,
    salary,
    city
  }

  return Position.findByIdAndUpdate(id, options)
    .then((result) => {
      return true
    })
    .catch((err) => {
      return false
    })
}

module.exports = {
  save,
  listall,
  list,
  listone,
  remove,
  update
}