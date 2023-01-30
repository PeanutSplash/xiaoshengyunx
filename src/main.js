import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from 'axios'//引入axios
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.prototype.$axios = axios//将axios绑定到vue的原型上
Vue.prototype.$store = store//将axios绑定到vue的原型上


//设置基址
axios.defaults.baseURL = 'http://43.138.239.126:1208/xiaoshengcloud/';

//设置token
axios.defaults.headers['token'] = '';

//设置post请求的请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
