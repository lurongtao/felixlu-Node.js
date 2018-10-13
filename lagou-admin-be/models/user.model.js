const { mongoose } = require('../utils/database')

// 定义数据库集合的域的数据格式
const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

// 创建一个集合，集合名字用名词复数
const User = mongoose.model('users', userSchema)

// 插入操作
const save = (data) => {
  let {
    username,
    password
  } = data

  const user = new User({
    username,
    password
  })

  return user.save()
    .then((result) => {
      return true
    })
    .catch((err) => {
      return false
    })
}

const findOne = (username) => {
  return User.findOne({username})
    .then((result) => {
      return result
    })
    .catch((err) => {
      return false
    })
}

module.exports = {
  save,
  findOne
}