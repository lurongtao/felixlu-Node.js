import Router from 'sme-router'

import homeController from '../controllers/home.controller'
import positionController from '../controllers/position.controller'
import userController from '../controllers/user.controller'

import {
  ActiveClass,
  NavLink
} from './action'

const register = () => {
  const router = new Router('router-view')

  // 用户功能绑定
  userController.render(router)

  // 路由导航链接事件绑定
  NavLink(router)

  // 路由切换时导航高亮设置
  router.use((req) => {
    ActiveClass()
  })

  // 路由定义
  router.route('/home', async (req, res, next) => {
    res.render(homeController.render())
  })

  router.route('/position', async (req, res, next) => {
    let {
      pageNo = 1,
      pageSize = 2,
      keywords = ''
    } = req.query || {}

    res.render(await positionController.list({
      pageNo,
      pageSize,
      keywords,
      router
    }))
    positionController.bindListEvents({router, req})
  })

  router.route('/save', (req, res, next) => {
    res.render(positionController.save())
    positionController.bindSaveEvents(router)
  })

  router.route('/update/:id/:pageNo', async (req, res, next) => {
    let {
      id,
      pageNo
    } = req.params
    let {
      keywords = ''
    } = req.query
    res.render(await positionController.update({
      id
    }))
    positionController.bindUpdateEvents({
      pageNo,
      router,
      keywords
    })
  })

  router.route('*', (req, res, next) => {
    res.redirect('/home')
  })
}

export default {
  register
}