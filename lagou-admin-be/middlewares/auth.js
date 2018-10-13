const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const auth = (req, res, next) => {
  let token = req.header('X-Access-Token')
  let cert = fs.readFileSync(path.resolve(__dirname, '../keys/public.key'))
  jwt.verify(token, cert, (err, decoded) => {
    if (decoded) {
      next()
    } else {
      res.render('position.view.ejs', {
        ret: JSON.stringify(false),
        data: JSON.stringify({msg: '你没有权限访问此页面.'})
      })
    }
  })
}

module.exports = {
  auth
}