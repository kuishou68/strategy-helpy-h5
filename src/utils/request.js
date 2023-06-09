import axios from 'axios' // 引入
import { getToken, setToken, removeToken } from '../utils/auth';

// 这一步的目的是判断出当前是开发环境还是生成环境，方法不止一种，达到目的就行
// if(process.env.NODE_ENV=='development'){
//   baseURL=''
// }else{
//   baseURL=''
// }
let token = "";
let baseURL = 'https://kdweb.seek-data.com:9696';
const config = {
  baseURL: baseURL,
  // 因为跨域了，所以这里如果写的话会自动拼接，会有两份，所以隐藏了
  timeout: 30000 // 设置最大请求时间
}
const _axios = axios.create(config)

// /* 请求拦截器（请求之前的操作） */
_axios.interceptors.request.use(config => {
    // 如果有需要在这里开启请求时的loading动画效果
    if(getToken()){
      config.headers.Authorization = getToken()  //添加token,需要结合自己的实际情况添加，
    }
    return config
  },
  err => Promise.reject(err)
)

// /* 请求之后的操作 */
_axios.interceptors.response.use((res) => {
  token = res.headers['authorization'];
  if(token){
    setToken(token);
  }
  // 在这里关闭请求时的loading动画效果
  // 这里用于处理返回的结果，比如如果是返回401无权限，可能会是跳回到登录页的操作，结合自己的业务逻辑写
  // 一定结合自己的后端的返回代码进行操作
  // if (res.data.code === 401) {
  //   console.log('无权限操作')
  // }
  return res
},
err => {
  if (err) {
    // 在这里关闭请求时的loading动画效果
    console.log('请求网络失败')
  }
  return Promise.reject(err)
}
)

// 封装post,get方法
// 按理来说应该也可以封装其他的方法
const http = {
  get (url = '', params = {}) {
    return new Promise((resolve, reject) => {
      _axios({
        url,
        params,
        headers: { 'Content-Type': 'application/jsoncharset=UTF-8' },
        method: 'GET',
        Authorization: getToken()
      }).then(res => {
        resolve(res.data)
        return res
      }).catch(error => {
        reject(error)
      })
    })
  },
  post (url = '', params = {}) {
    return new Promise((resolve, reject) => {
      console.log(token);
      _axios({
        url,
        data: params,
        headers: { 'Content-Type': 'application/jsoncharset=UTF-8' },
        method: 'POST'
      }).then(res => {
        resolve(res.data)
        return res
      }).catch(error => {
        reject(error)
      })
    })
  }
}

// 暴露所写的内容
export default http
