const multer = require('multer')
const path = require('path')

const fileupload = (req, res, next) => {
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
      let originalname = file.originalname
      let dotpos = originalname.lastIndexOf('.')
      let extendName = originalname.substr(dotpos)
      let filefullname = file.fieldname + '-' + Date.now() + extendName
      req.body.companyLogo = filefullname
      cb(null, filefullname)
    }
  })

  let fileFilter = (req, file, cb) => {
    const mimetype = file.mimetype
    if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].indexOf(mimetype) != -1 ) {
      cb(null, true)
    } else {
      cb(new Error('I don\'t have a clue!'))
    }
  }
  
  let upload = multer({ storage, fileFilter }).single('companyLogo')

  upload(req, res, function (err) {
    if (err) {
      res.render('position.view.ejs', {
        ret: JSON.stringify(false),
        data: JSON.stringify({msg: 'fail'})
      })
    }
    next()
  })
}

module.exports = {
  fileupload
}