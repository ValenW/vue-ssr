import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home";

Vue.use(VueRouter);

export const createRouter = () => {
  return new VueRouter({
    // 使用history模式兼容前后端, 绝大多数服务端不会处理hash
    mode: "history",
    routes: [
      {
        path: "/",
        name: "home",
        component: Home,
      },
      {
        path: "/about",
        name: "about",
        component: () => import("@/pages/About"), // 动态懒加载
      },
      {
        path: "/posts",
        name: "posts",
        component: () => import("@/pages/Posts"),
      },
      {
        path: "*",
        name: "404",
        component: () => import("@/pages/404"),
      },
    ],
  });
};
