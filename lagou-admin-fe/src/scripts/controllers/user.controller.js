import userModel from '../models/user.model'
import userTpl from '../views/user.html'

var isSignin = false

const _signup = async () => {
  let data = $('#userform').serialize()
  let result = await userModel.signup(data)
  if (result.ret) {
    alert('注册成功，请登录...')
  } else {
    alert(result.data.msg)
  }
}

const _signin = async () => {
  let data = $('#userform').serialize()
  let result = await userModel.signin(data)
  if (result.ret) {
    // localStorage
    localStorage.setItem('token', result.data.token)
    localStorage.setItem('username', result.data.username)

    _renderUserTpl({
      isSignin: true,
      userInfo: result.data.username
    })
  }
}

const _signout = (router) => {
  localStorage.removeItem('token')
  location.reload()
  router.go('/')
}

const render = (router) => {

  // 判断用户是否登录，如果登录，用isSignin做记录，用于渲染模板
  if (localStorage.getItem('token')) {
    isSignin = true
  }

  // 渲染用户区域
  _renderUserTpl({
    isSignin,
    userInfo: localStorage.getItem('username') || ''
  }, router)
}

const _renderUserTpl = (data, router) => {
  let html = template.render(userTpl, data)
  $('#user').html(html)

  $('#btn-user span').on('click', function() {
    $('#userform input').val('')
    if ($(this).hasClass('signin')) {
      $('#sign-submit').text('登录')
    } else if ($(this).hasClass('signup')) {
      $('#sign-submit').text('注册')
    }
  })

  $('#sign-submit').on('click', function() {
    if ($(this).text() === '注册') {
      _signup()
    } else if ($(this).text() === '登录') {
      _signin()
    } else if ($(this).text() === '退出') {
      _signout(router)
    }
  })
}

export default {
  render
}