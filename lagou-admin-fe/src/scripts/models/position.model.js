const list = ({
  pageNo,
  pageSize,
  keywords
}) => {
  return $.ajax({
    url: `/api/position/list?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords||''}`,
    headers: {
      'X-Access-Token': localStorage.getItem('token')
    },
    success: (result) => {
      return result
    }
  })
}

const listall = ({
  keywords
}) => {
  return $.ajax({
    url: `/api/position/listall?keywords=${keywords||''}`,
    headers: {
      'X-Access-Token': localStorage.getItem('token')
    },
    success: (result) => {
      return result
    }
  })
}

const listone = (id) => {
  return $.ajax({
    url: '/api/position/listone',
    data: {
      id
    },
    success: (result) => {
      return result
    }
  })
}

const remove = ({
  id
}) => {
  return $.ajax({
    url: '/api/position/remove',
    type: 'delete',
    data: {
      id
    },
    success: (result) => {
      return result
    }
  })
}

export default {
  list,
  remove,
  listone,
  listall
}