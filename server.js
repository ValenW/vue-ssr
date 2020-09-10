/**
 * 通用应用 Web 服务启动脚本
 */
const express = require("express");
const Vue = require("vue");
const VueServerRenderer = require("vue-server-renderer");
const fs = require("fs");
// 创建一个 express 实例
const server = express();
// 生成一个渲染器
const renderer = VueServerRenderer.createRenderer({
  // 渲染器就会自动把渲染的结果注入到模板中
  template: fs.readFileSync("./index.html", "utf-8"),
});
const createApp = () => {
  const app = new Vue({
    template: `
      <div id="app">
      <h1>Hello {{ message }}</h1>
      <input v-model="message">
      </div>
      `,
    data: {
      message: "World",
    },
  });
  return app;
};
server.get("/foo", (req, res) => {
  const app = createApp();
  app.message = "世界";
  res.end("foo");
});
// 设置一个路由
server.get("/", async (req, res) => {
  // const app = new Vue({
  // template: `
  // <div id="app">
  // <h1>Hello {{ message }}</h1>
  // <input v-model="message">
  // </div>index.template.html

  // `,
  // data: {
  // message: 'World'
  // }
  // })
  try {
    const app = createApp();
    const ret = await renderer.renderToString(app, {
      title: "自定义页面标题",
      meta: `
<meta name="description" content="hello world">
`,
    });
    res.end(ret);
  } catch (err) {
    res.status(500).end("Internal Server Error.");
  }
});
// 监听端口，启动 Web 服务
server.listen(3000, () => {
  console.log("running at port 3000.");
});
