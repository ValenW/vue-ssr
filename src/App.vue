<template>
  <!-- 客户端渲染的入口节点 -->
  <div id="app">
    <h1>Hello Vue SSR</h1>
    <h2>{{ msg }}</h2>
    <input type="text" v-model="msg" />
    <button @click="clickHandler">click</button>

    <br />

    <ul>
      <li>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </li>
    </ul>

    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    // data must be a function that return data object to avoid conflict on different vue instance
    return {
      msg: "test vue data",
    };
  },
  methods: {
    clickHandler() {
      console.log("click!");
    },
  },
};
</script>
<style>
</style>
