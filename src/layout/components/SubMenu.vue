<template>
        <template v-for="item of propMenuList">
            <!-- 菜单 -->
            <template v-if="item.type == 1">
                <el-menu-item :index="item.dataUrl" :data-index="item.dataUrl">
                    <i :class="item.menuClass"></i>
                    <template #title>
                        <div class="layout_directory_name">{{item.menuName}}</div>
                    </template>
                </el-menu-item>
            </template>
            <!-- 目录 -->
            <template v-else-if="item.type == 0">
                <el-sub-menu popper-class="zt_sub_menu" :index="item.dataUrl" :data-index="item.dataUrl">
                    <template #title>
                        <i :class="item.menuClass"></i>
                        <div class="layout_directory_name">{{item.menuName}}</div>
                    </template>
                    <SubMenuVue v-if="item.subAuthorityList && item.subAuthorityList.length" :propMenuList="item.subAuthorityList"></SubMenuVue>
                </el-sub-menu>
            </template>
        </template>
</template>
<script lang="ts" setup>
import SubMenuVue  from './SubMenu.vue';
import { defineProps } from 'vue'
defineProps({
    propMenuList: {
        type: Object,
        default() {
            return []
        }
    },
})
</script>