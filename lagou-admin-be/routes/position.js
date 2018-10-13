const express = require('express')

const router = express.Router()

const positionController = require('../controllers/position.controller')
const fsUploadMiddleware = require('../middlewares/fileupload')
const authMiddleware = require('../middlewares/auth.js')

router.get('/list', positionController.list)

router.post('/save', fsUploadMiddleware.fileupload, positionController.save)

router.delete('/remove', positionController.remove)

router.get('/listone', positionController.listone)

router.get('/listall', positionController.listall)

router.post('/update', fsUploadMiddleware.fileupload, positionController.update)

module.exports = router