const Koa = require('koa')
const router = require('koa-router')()
const session = require('koa-session')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const app = new Koa();

// 跨域请求处理
app.use(cors({
  credentials: true
}))
app.keys = ['some secret'];
app.use(static(__dirname + '/'));
app.use(bodyParser())
//配置session的中间件
app.use(session(app));

app.use((ctx, next) => {
  if (ctx.url.indexOf('login') > -1) {
    next()
  } else {
    console.log('session', ctx.session.userinfo)
    if (!ctx.session.userinfo) {
      ctx.body = {
        message: "登录失败"
      }
    } else {
      next()
    }
  }
})

router.post('/login', async (ctx) => {
  const {
    body
  } = ctx.request
  console.log('body', body)
  // 登陆成功，创建Session并保存
  ctx.session.userinfo = body.username;
  ctx.body = {
    message: "登录成功"
  }
})
router.post('/logout', async (ctx) => {
  // 登出系统后，清除 Session
  delete ctx.session.userinfo
  ctx.body = {
    message: "登出系统"
  }
})
router.get('/getUser', async (ctx) => {
  // 从 Session 中获取用户信息
  ctx.body = {
    message: "获取数据成功",
    userinfo: ctx.session.userinfo
  }
})

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);