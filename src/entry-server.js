import { createApp } from "./app";

export default async (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。

  const { app, router, store } = createApp();

  const meta = app.$meta();

  // 设置服务器端 router 的位置
  // context 由renderer.renderToString接受的参数提供
  router.push(context.url);

  context.meta = meta;

  /**
   * 等到 router 将可能的异步组件和钩子函数解析完
   *
   * router.onReady(() => {
   *   const matchedComponents = router.getMatchedComponents();
   *   // 匹配不到的路由，执行 reject 函数，并返回 404
   *   if (!matchedComponents.length) {
   *     return reject({ code: 404 });
   *   }
   *
   *   // Promise 应该 resolve 应用程序实例，以便它可以渲染
   *   resolve(app);
   * }, reject);
   */

  await new Promise(router.onReady.bind(router));

  context.rendered = () => {
    // 将context.state数据对象内联到页面模板中
    // 最终生成页面上会包含一段脚本: `window.__INITIAL_STATE_ = ...`
    // 客户端就会将window.__INITIAL_STATE_填充到客户端store容器中
    context.state = store.state;
  };

  return app;
};
