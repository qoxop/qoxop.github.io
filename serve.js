const Koa = require('koa')
const static = require('koa-static')

const app = new Koa()

//设置静态资源的路径 
app.use(static(__dirname))

app.use( ctx => {
  ctx.body = '<h1>404</h1>'
})

app.listen(80, () => {
  console.log('server is starting at port 80')
})