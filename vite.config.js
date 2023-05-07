import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 检查代码格式
    // eslintPlugin({
      // include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    // })
  ],
  server: {
    // 默认打开的端口和本地
    // host: '0.0.0.0',
    // port: 8080,
    https: false, // 不支持https
    proxy: {
      '/api': {
        target: 'https://kdweb.seek-data.com:9696',	// 实际请求地址
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 对什么类的服务器匹配
      },
    }
  }
})
