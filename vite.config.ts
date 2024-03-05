import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'          //提供 Vue 3 单文件组件支持。
import vueJsx from '@vitejs/plugin-vue-jsx'   //提供 Vue 3 JSX 支持（通过 专用的 Babel 转换插件）。 
import legacy from '@vitejs/plugin-legacy'    //为打包后的文件提供传统浏览器兼容性支持。

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      // 设置路径
      '~': path.resolve(__dirname, './'),
      // // 设置别名
      '@': path.resolve(__dirname, "src"),
      '@V': path.resolve(__dirname, "src/view"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    port: 4444,
    host: true,
    open: true,
    proxy: {
      "^/dpa-cloud/": {
        target: "http://10.255.33.127:7067",
        changeOrigin: true,
      },
      "^/dpa-file/": {
        target: "http://10.255.33.127:7068",
        changeOrigin: true,
      },
      "^/dpafile/": {
        target: "https://mdajtest.szzt.com.cn",
        changeOrigin: true,
      },
    }
  },
  build: {
    outDir: 'vueTs', // this line place index.html in the public folder
  },
  css:{
    preprocessorOptions:{

    }
  }
})
