<template>
    <el-menu
        :default-active="userStore.currentActive"
        :data-active="userStore.currentActive"
        class="el-menu-vertical-demo"
        style="width: 100%;height: 100%;"
        :collapse="userStore.menuConfig.isCollapse"
        @open="handleOpen"
        @close="handleClose"
        @select="handleMenuSelect">
        <template v-for="item of menuList">
            <!-- 目录 -->
            <template v-if="item.type == 0">
                <el-sub-menu popper-class="zt_sub_menu" :index="item.dataUrl" :data-index="item.dataUrl">
                    <template #title>
                        <i :class="item.menuClass"></i>
                        <div class="layout_directory_name">{{item.menuName}}</div>
                    </template>
                    <SubMenuVue v-if="item.subAuthorityList && item.subAuthorityList.length" :propMenuList="item.subAuthorityList"></SubMenuVue>
                </el-sub-menu>
            </template>
            <!-- 菜单 -->
            <template v-else-if="item.type == 1">
                <el-menu-item :index="item.dataUrl" :data-index="item.dataUrl">
                    <i :class="item.menuClass"></i>
                    <template #title>
                        <div class="layout_directory_name">{{item.menuName}}</div>
                    </template>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</template>
<script setup lang="ts">
import SubMenuVue  from './SubMenu.vue';

import { computed, reactive } from 'vue'
import  useCounterStore  from '@/store/index'
const userStore = useCounterStore();
const DEFAULTINDEX:any = reactive({
    menuName: "首页",
    dataUrl: "/index",
    onlyRead: true,
    id: "首页",
    menuClass:"iconfont icon-shouyejianying",
    description: "首页",
    type:1,
})
const menuList = computed(() => [ DEFAULTINDEX, ...userStore.menuConfig.list]);
import { useRouter } from 'vue-router'
const router = useRouter();


const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleMenuSelect = function(key: string){
  userStore.currentActive = key
  router.push({path:key});
}

</script>
<style scoped lang="scss"> 
.el-menu-vertical-demo{
  min-height: 400px;
  background-color: var(--menu-hover-bg-color);
  border-right: none !important;
  :deep(.layout_directory_name){
    padding-left: 22px;
  }
  :deep(.el-sub-menu){
    i{
        font-size: 18px;
    }
    .el-icon{
      margin-top: -9px;
    }
  }
  :deep(.el-menu-item){
    i{
        font-size: 18px;
    }
  }
}
</style>