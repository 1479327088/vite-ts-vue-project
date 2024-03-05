<template>
    <section class="layout_index">
        <header class="layout_header">
            <home-header></home-header>
        </header>
        <article class="layout_menu" :style="{ width: userStore.menuConfig.isCollapse ? '60px' : '200px' }">
            <el-scrollbar class="layout_scrollbar">
                <Menu></Menu>
            </el-scrollbar>
        </article>
        <article class="layout_content">
            <content-title></content-title>
            <div class="content_router">
                <div class="menu_router_view">
                    <el-scrollbar noresize class="scroll-content">
                        <router-view v-slot="{ Component , route  }">
                            <transition :name="route.meta.transition || 'slideLeft'" mode="out-in">
                                <component :is="Component" />
                            </transition>
                        </router-view>
                    </el-scrollbar>
                </div>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';
const { proxy }:any = getCurrentInstance();
import  useCounterStore  from '@/store/index'
const userStore = useCounterStore();
import Menu from './components/Menu.vue'
import HomeHeader from './components/HomeHeader.vue'
import ContentTitle from './components/ContentTitle.vue'

//获取当前登录用户
proxy.$api.getCurrentUser().then( (res:any)=>{
    if (res.code == 200) {
        userStore.userConfig = res.data
    } else {
        proxy.$message.warning(res.msg);
    }
});
userStore.getMenuByUser();
</script>

<style scoped lang="scss">
.layout_index{
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    .layout_header{
        width: 100%;
        height: 70px;
        padding: 0 20px;
        background-color: var(--bg-color);
    }
    .layout_menu{
        height: calc(100% - 70px);
        border-right: 1px solid var(--border-color);
        .layout_scrollbar{
            :deep(.el-scrollbar__view){
                height: 100%;
                height: 100%;
            }
        }
    }
    .layout_content{
        flex: 1;
        height: calc(100% - 70px);
        .content_router{
            width: 100%;
            height: calc(100% - 91px);
            background-color: var(--content-bg-color);
            border-top: 1px solid var(--content-bg-color);
            .menu_router_view{
                width: calc(100% - 50px);
                height: calc(100% - 30px);
                margin: 15px 25px;
                // background-color: var(--content-router-color);
                overflow: auto;
                border-top: 1px solid var(--content-router-color);
                .scroll-content{
                    width: 100%;
                    height: 100%;
                    :deep(.el-scrollbar__view){
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}

.slideLeft-enter-active,
.slideLeft-leave-active{
    transition: all 0.5s;
}
.slideLeft-enter-from,
.slideLeft-leave-to{
    opacity: 0;
    transform: translateX(100px)
}

.slideRight-enter-active,
.slideRight-leave-active{
    transition: all 0.5s;
}
.slideRight-enter-from,
.slideRight-leave-to{
    opacity: 0;
    transform: translateX(-100px)
}

.slideTop-enter-active,
.slideTop-leave-active{
    transition: all 0.5s;
}
.slideTop-enter-from,
.slideTop-leave-to{
    opacity: 0;
    transform: translateY(100px)
}

</style>