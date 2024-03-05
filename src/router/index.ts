import { createRouter , createWebHashHistory, createWebHistory } from 'vue-router';
import login from '@V/login.vue'
import layout from '@/layout/index.vue'
import NotFound from '@V/NotFound.vue'
import  useCounterStore  from '@/store/index'

const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/index',
        name: 'index',
        component: layout,
        meta:{
            title: "首页",
            content: "disable-no", 
        },
        children:[
            {
                path:'/index',
                component:() => import('@V/index.vue'),
                meta:{
                    title: "主页",
                    content: "disable-no", 
                },
            }
        ]
    },
    {
        path: '/personCenter',
        name: 'personCenter',
        component: layout,
        meta:{
            title: "个人中心",
            content: "disable-no", 
        },
        children:[
            {
                path:'/personCenter',
                component:() => import('@V/personCenter.vue'),
                meta:{
                    title: "个人中心",
                    content: "disable-no",
                    transition:"slideRight"
                },
            }
        ]
    },
    //系统管理
    {
        path: '/sysManage',
        name: 'sysManage',
        component: layout,
        meta:{
            title: "系统管理",
            content: "disable-no", 
        },
        children:[
            {
                path:'accountManage',
                component:() => import('@V/sysManagement/accountManage.vue'),
                meta: {
                    title: "用户管理",
                    content: "disable-no",
                    transition:"slideTop"
                }
            },
            {
                path:'departmentManage',
                component:() => import('@V/sysManagement/departmentManage.vue'),
                meta: {
                    title: "部门管理",
                    content: "disable-no",
                    transition:"slideLeft"
                }
            }
        ]
    },

    //404
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
router.beforeEach((to) => {
    const userStore = useCounterStore();
    const matched = to.matched;
    const fullPath = to.fullPath;
    if(fullPath && fullPath !== '/login' && userStore.titleConfig.tagList.length) {
        let isExist = false
        userStore.titleConfig.tagList.forEach((item:any) => {
            if(item.dataUrl == fullPath){
                userStore.titleConfig.activeMenu = item.dataUrl;
                isExist = true;
            }
        })
        if(!isExist){
            userStore.titleConfig.tagList.push({
                menuName:to.meta.title,
                dataUrl:fullPath,
                closable:true
            })
            userStore.titleConfig.activeMenu = fullPath;
            userStore.currentActive = fullPath;
        }
    }
    if(Array.isArray(matched) && matched.length){
        let arr:object[] = []
        matched.forEach( (item:any)=>{
            arr.push({
                "title":item.meta.title,
                "path":item.path
            })
        })
        userStore.titleConfig.matched = arr;
    }
    
    // ...
    // 返回 false 以取消导航
    return true
})

export default router