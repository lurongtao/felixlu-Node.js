import bodyTpl from './views/body.html'
import userTpl from './views/user.html'
import router from './router'

$('#root').html(bodyTpl)
$('#user').html(userTpl)

router.register()