/**
 * 通用应用 Web 服务启动脚本
 */
const express = require("express");
const fs = require("fs");
const server = express();
const { createBundleRenderer } = require("vue-server-renderer");
const setupDevServer = require("./build/setup-dev-server");

// 因为渲染好的HTML中会请求dist目录下的client脚本, 需要将dist挂载为静态目录
server.use("/dist", express.static("./dist/"));

const isProd = process.env.NODE_ENV === "production";

let renderer;
let rendererReady;
if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  const template = fs.readFileSync("./index.template.html", "utf-8");
  // 生成一个渲染器
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  });
  rendererReady = Promise.resolve();
} else {
  // 监视打包构建, 完成后生成Renderer渲染器
  rendererReady = setupDevServer(
    server,
    (serverBundle, template, clientManifest) => {
      renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest,
      });
    }
  );
}

const render = async (req, res) => {
  try {
    // renderer会自动找到entry创建vue实例, 不需要手动创建
    const html = await renderer.renderToString({
      title: "自定义页面标题",
      url: req.url,
    });
    res.setHeader("Content-Type", "text/html; charset=utf8");
    res.end(html);
  } catch (err) {
    console.log(err);
    res.status(500).end("Internal Server Error.");
  }
};

// 设置一个路由
server.get(
  "*",
  isProd
    ? render
    : async (req, res) => {
        // 等待有了renderer之后调用render进行渲染
        await rendererReady;
        render(req, res);
      }
);

server.listen(3000, () => {
  console.log("running at port 3000.");
});
