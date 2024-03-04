import { createApp } from 'vue'
import './style.css'
import './assets/sass/public.scss'
import '@/assets/icon/iconfont.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { dayjs } from 'element-plus'
dayjs.en.weekStart = 1;

import router from './router';

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import lodash from 'lodash'

// const storeReset = ({ store })=>{
//     const initialState = lodash.cloneDeep(store.$state);
//     store.$reset = ()=> store.$patch(lodash.cloneDeep(initialState));
// }
const pinia = createPinia()
pinia.use(({ store })=>{
    const initialState = lodash.cloneDeep(store.$state);
    store.$reset = ()=> store.$patch(lodash.cloneDeep(initialState));
});
pinia.use(piniaPersist);

import App from './App.vue'
const app = createApp(App);
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import plugins from '@/plugins/index'
app.use(plugins);

// const files = import.meta.glob("./components/iconFile/*.vue",{eager:true,import:'default'}) as any;
// for(const path in files){
//     app.component(files[path].__name, files[path])   
// }

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}



app.use(ElementPlus,{ 
    size: 'default', 
    zIndex: 3000,
    locale: zhCn,
})
app.use(router)
app.use(pinia)
app.mount('#app')
