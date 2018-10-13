const ActiveClass = () => {
  let hash = location.hash
  let $a = $('#menu li').has('a')
  let target
  switch(hash) {
    case '':
    case '#/':
    case '#/home':
      target = $a.eq(0)
      break
    default:
      target = $a.eq(1)
      break
  }
  target.addClass('active').siblings().removeClass('active')
}

const NavLink = (router) => {
  let $a = $('#menu li').has('a')
  $a.on('click', function() {
    let to = $(this).attr('to')
    router.go(to)
  })
}

export {
  ActiveClass,
  NavLink
}