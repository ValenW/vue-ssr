const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()
const express = require('express')

const server = express()

server.get('/', (req, res) => {
  const app = new Vue({
    template: `
    <div id="app">
      <h1>{{ message }}</h1>
    </div>
  `,
    data: {
      message: 'home'
    }
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      return res.status(500).end('Interal Server Error')
    }
    res.setHeader('Context-Type', 'text/html; charset=utf8')
    res.end(html)
  })
})

server.listen(3000, () => {
  console.log(('server running at port 3000'));
})
