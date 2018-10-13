// 生成私钥：
// ssh-keygen -t rsa -b 2048 -f private.key

// 生成公钥：
// openssl rsa -in private.key -pubout -outform PEM -out public.key

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const fs = require('fs')
const path = require('path')
// const randomstring = require('randomstring')

const signup = async (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf8')
  let { username, password } = req.body
  let user = await userModel.findOne(username)
  if (user) {
    res.render('user.view.ejs', {
      ret: JSON.stringify(false),
      data: JSON.stringify({msg: '用户名存在.'})
    })
  } else {
    let result = await userModel.save({
      username,
      password: await genBcryptPwd(password)
    })
  
    if (result) {
      res.render('user.view.ejs', {
        ret: JSON.stringify(true),
        data: JSON.stringify({
          username
        })
      })
    } else {
      res.render('user.view.ejs', {
        ret: JSON.stringify(false),
        data: JSON.stringify({msg: 'fail'})
      })
    }
  }
}

const signin = async (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf8')
  const { username, password } = req.body
  let user = await userModel.findOne(username)
  if (user) {
    if(await comparePassword({password, userPassword: user.password})) {
      let token = genToken(username)
      res.render('user.view.ejs', {
        ret: JSON.stringify(true),
        data: JSON.stringify({
          token,
          username
        })
      })
    } else {
      res.render('user.view.ejs', {
        ret: JSON.stringify(false),
        data: JSON.stringify({msg: '用户名或密码错误.'})
      })
    }
  } else {
    res.render('user.view.ejs', {
      ret: JSON.stringify(false),
      data: JSON.stringify({msg: '用户名或密码错误.'})
    })
  }
}

function genBcryptPwd(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        resolve(hash)
      })
    })
  })
}

function comparePassword({password, userPassword}) {
  return new Promise((resovle, reject) => {
    bcrypt.compare(password, userPassword, function(err, res) {
      resovle(res)
    })
  })
}

function genToken(username) {
  let cert = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'))
  let token = jwt.sign({ username }, cert, { algorithm: 'RS256'})
  return token
}

module.exports = {
  signup,
  signin
}