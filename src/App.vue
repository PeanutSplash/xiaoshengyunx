<template>
  <div id="app">
    <!-- 非登录页面 -->
    <div v-if="!(path === '/login' || path === '/reg')" class="app">
      <leftNavigationBar></leftNavigationBar>
      <div style="display: flex;flex-direction: column;">
        <router-view class="router"></router-view>
      </div>

    </div>
    <!-- 登录页面 -->
    <div v-if="(path === '/login' || path === '/reg')">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import leftNavigationBar from '@/components/leftNavigationBar'
import topFileBar from '@/components/topFileBar'

export default {
  name: 'App',
  data() {
    return {
      path: ''
    }
  },
  components: {
    leftNavigationBar,
    topFileBar
  },
  // 判断路由
  mounted() {
    this.path = this.$route.path;
    // console.log(this.$route.path)
  },
  watch: {
    $route(to, from) {
      this.path = to.path
    }
  }

}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.app {
  display: flex;
  flex-direction: row;
}

.router {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
