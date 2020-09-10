<template>
  <!-- 客户端渲染的入口节点 -->
  <div id="app">
    <h1>拉勾教育</h1>
    <h2>{{ msg }}</h2>
    <input type="text" v-model="msg" />
    <button @click="clickHandler">click</button>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    // data must be a function that return data object to avoid conflict on different vue instance
    return {
      msg: "test",
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
