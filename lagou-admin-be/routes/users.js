var express = require('express');
var router = express.Router();

const userController = require('../controllers/user.controller')

// 注册
router.post('/signup', userController.signup)

// 登录
router.post('/signin', userController.signin)

module.exports = router;
