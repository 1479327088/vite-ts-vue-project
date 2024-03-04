import { defineStore } from 'pinia'
import { reactive, ref} from 'vue'
import type { Ref } from 'vue'
import api from '@/api/index'

const useCounterStore  = defineStore('counter',()=>{
    //state
    const token:Ref<string> = ref('');
    const sysConfig = reactive({})
    const userConfig = reactive({})
    const menuConfig = reactive({
        list:[],
        isCollapse:false
    })
    const currentActive = ref<string>('/index');

    const titleConfig = reactive({
        matched:[],
        tagList:[
            {
                menuName:'首页',
                dataUrl:'/index',
                closable: false,
            }
        ],
        activeMenu:'/index'
    })

    // 获取菜单
    const getMenuByUser = function(){
        api.getMenuByUser('backstage').then( (res:any) => {
            const { flag , data } = res;
            if( flag && data ){
                menuConfig.list = data || [];
            }
        })
    }
    return {
        token,
        sysConfig,
        userConfig,
        menuConfig,
        titleConfig,
        currentActive,
        getMenuByUser
    }
},{
    persist:{
        enabled: true,
        strategies: [{
            // 自定义存储的 key，默认是 store.$id
            key: "Admin-Tag-Breadcrumb",
            // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
            storage: sessionStorage,
            // state 中的字段名，按组打包储存
            paths: ["titleConfig",'currentActive']
        },{
            // 自定义存储的 key，默认是 store.$id
            key: "Admin-Menu-list",
            // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
            storage: sessionStorage,
            // state 中的字段名，按组打包储存
            paths: ["menuConfig"]
        }]
    }
})
export default useCounterStore 