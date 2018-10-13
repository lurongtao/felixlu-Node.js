const signup = (data) => {
  return $.ajax({
    url: '/api/users/signup',
    data,
    type: 'post',
    success: (result) => {
      return result
    }
  })
}

const signin = (data) => {
  return $.ajax({
    url: '/api/users/signin',
    data,
    type: 'post',
    success: (result) => {
      return result
    }
  })
}

export default {
  signup,
  signin
}