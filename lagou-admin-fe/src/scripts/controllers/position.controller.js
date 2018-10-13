import posListTpl from '../views/position.list.html'
import posSaveTpl from '../views/position.save.html'
import posUpdateTpl from '../views/position.update.html'

import posModel from '../models/position.model'

const _genID = () => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}

const _handleAddSubmitClick = () => {
  let options = {
    "success": (result, status) => {
      if (result.ret) {
        $("#possave").get(0).reset()
      } else {
        alert('插入失败')
      }
    },
    "resetForm": true,
    "dataType": "json"
  };
  $("#possave").ajaxSubmit(options)
}

const _handleUpdateSubmitClick = (router, pageNo, keywords) => {
  let options = {
    "success": (result, status) => {
      if (result.ret) {
        $("#posupdate").get(0).reset()
      } else {
        alert('修改失败')
      }
    },
    "resetForm": true,
    "dataType": "json"
  };
  $("#posupdate").ajaxSubmit(options)
  router.go(`/position?pageNo=${pageNo}&keywords=${keywords || ''}`)
}

const _handleRemoveBtnClick = async ({
  id,
  router,
  pageNo,
  pageCount,
  pageSize,
  keywords
}) => {
  const result = await posModel.remove({
    id
  })
  if (result.ret) {
    let newPageNo = await _doWhenLastPage({
      pageNo,
      pageCount,
      pageSize,
      keywords
    })
    if (newPageNo !== 0) {
      router.go(`/position?pageNo=${newPageNo}&keywords=${keywords || ''}&_=${_genID()}`)
    } else {
      router.go(`/position?keywords=${keywords || ''}`)
    }
  } else {
    alert('删除失败，请与管理员联系.')
  }
}

// 删除最后一页处理：
// 当最后一页全部删除时，需要跳转到上一页
// 如何只剩一页，全部删除后显示没有记录了
const _doWhenLastPage = async ({
  pageNo,
  pageCount,
  pageSize,
  keywords
}) => {
  if (pageNo == pageCount) {
    let total = (await posModel.listall({
      keywords
    })).data.length
    let newPageCount = Math.ceil(total / ~~pageSize)
    return newPageCount < ~~pageCount ? newPageCount : ~~pageCount
  } else {
    return ~~pageNo
  }
}

const bindListEvents = ({
  router,
  req
}) => {
  // 添加事件绑定
  $('#addbtn').on('click', () => router.go('/save'))

  // 修改事件绑定
  $('.pos-update').on('click', function () {
    let id = $(this).attr('posid')
    let pageNo = $(this).attr('pageno')
    let keywords = $(this).attr('keywords')
    router.go(`/update/${id}/${pageNo}?keywords=${keywords}`)
  })

  // 删除事件绑定
  $('.pos-remove').on('click', function () {
    let id = $(this).attr('posid')
    let pageNo = $(this).attr('pageno')
    let pageCount = $(this).attr('pagecount')
    let pageSize = $(this).attr('pagesize')
    let keywords = $(this).attr('keywords')
    _handleRemoveBtnClick({
      router,
      id,
      pageNo,
      pageCount,
      pageSize,
      keywords
    })
  })

  // 搜索事件绑定
  $('#possearch').on('click', function () {
    let keywords = $('#keywords').val()
    let {
      pageNo = 1,
      _ = 0
    } = req.query || {}

    router.go(`/position?pageNo=${pageNo}&keywords=${keywords}&_=${_}`)
  })
}

const bindSaveEvents = (router) => {
  $('#posback').on('click', () => router.go('/position'))
  $('#possubmit').on('click', _handleAddSubmitClick)
}

const bindUpdateEvents = ({
  router,
  pageNo,
  keywords
}) => {
  $('#posback').on('click', () => router.go(`/position?pageNo=${pageNo}&keywords=${keywords||''}`))
  $('#possubmit').on('click', _handleUpdateSubmitClick.bind(this, router, pageNo, keywords))
}

const list = async ({
  pageNo,
  pageSize,
  router,
  keywords
}) => {
  let result = await (posModel.list({
    pageNo,
    pageSize,
    keywords
  }))
  if (result.ret) {
    let total = result.data.total
    let pageCount = Math.ceil(total / ~~pageSize)
    let html = template.render(posListTpl, {
      list: result.data.result,
      pageArray: new Array(pageCount),
      pageCount,
      pageSize,
      total,
      keywords,
      pageNo: ~~pageNo
    })

    return html
  } else {
    router.go('/')
    return
  }
}

const save = () => {
  return posSaveTpl
}

const update = async ({
  id
}) => {
  const pos = (await posModel.listone(id))['data']
  let html = template.render(posUpdateTpl, {
    pos
  })

  return html
}

export default {
  list,
  bindListEvents,
  save,
  bindSaveEvents,
  update,
  bindUpdateEvents
}