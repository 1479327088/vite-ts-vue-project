declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const vueComponent: DefineComponent<{}, {}, any>;
    export default vueComponent;
}

declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'jsencrypt/bin/jsencrypt.min.js'
declare module '@/store/index'
declare module '@/plugins/index'
declare module '@/router/index.ts'
declare module '@/layout/index.vue'
declare module '@/utils/comJs'
declare module '@/utils/const'
declare module '@/api/index'
declare module 'crypto-js'
declare module 'qs'
declare module 'lodash'