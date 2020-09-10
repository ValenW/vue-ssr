/**
 * 通用应用 Web 服务启动脚本
 */
const express = require("express");
const fs = require("fs");

const isProd = process.env.NODE_RNV === 'production';

if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  const template = fs.readFileSync("./index.template.html", "utf-8");
  // 生成一个渲染器
  const renderer = require("vue-server-renderer").createBundleRenderer(
    serverBundle,
    {
      template,
      clientManifest,
    }
  );
} else {
  // TODO: 监视打包构建, 完成后生成Renderer渲染器
}

const server = express();

// 因为渲染好的HTML中会请求dist目录下的client脚本, 需要将dist挂载为静态目录
server.use("/dist", express.static("./dist/"));

const render = async (req, res) => {
  try {
    // renderer会自动找到entry创建vue实例, 不需要手动创建
    const html = await renderer.renderToString({
      title: "自定义页面标题",
      meta: `<meta name="description" content="hello world">`,
    });
    res.setHeader("Content-Type", "text/html; charset=utf8");
    res.end(html);
  } catch (err) {
    res.status(500).end("Internal Server Error.");
  }
}

// 设置一个路由
server.get("/", isProd ? render : (req, res) => {
  // TODO: 等待有了renderer之后调用render进行渲染
  render(req, res)
});

server.listen(3000, () => {
  console.log("running at port 3000.");
});
