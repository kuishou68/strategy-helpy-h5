import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/main.css'

// import apiFun from "./utils/api.js"
// Vue.prototype.$apiFun = apiFun // 请求接口api

const app = createApp(App);
app.use(Antd);
app.mount('#app')
