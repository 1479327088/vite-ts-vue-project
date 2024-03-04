<template>
    <section class="content-title">
        <div class="title-menu-breadcrumb">
            <div class="title-breadcrumb-icon" @click="handleCollapse">
                <el-icon v-if="userStore.menuConfig.isCollapse" ><Expand /></el-icon>
                <el-icon v-else><Fold /></el-icon>
            </div>
            <div class="title-breadcrumb-name">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item 
                        v-for="(item,index) in matchedList"
                        :key="index">{{ item.title }}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="title-menu-tag">
            <el-tag
                v-for="tag in tagList"
                :key="tag.dataUrl"
                @click="handleTagClick(tag)"
                @close="handleTagClose(tag)"
                size="large"
                :class="{'active-tag':userStore.titleConfig.activeMenu == tag.dataUrl}"
                class="tag-item"
                effect="plain"
                style="margin-right: 10px;cursor: pointer;"
                :closable="tag.closable">{{ tag.menuName }}</el-tag>
        </div>
    </section>
</template>
<script lang="ts" setup>
import  useCounterStore  from '@/store/index'
const userStore = useCounterStore();
import {  computed  } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();

const matchedList = computed(() => [ ...userStore.titleConfig.matched]);
const tagList = computed(() => [ ...userStore.titleConfig.tagList]);
const handleCollapse = function(){
    userStore.menuConfig.isCollapse = !userStore.menuConfig.isCollapse
}
const handleTagClick = function(item:any){
    userStore.titleConfig.activeMenu = item.dataUrl
    router.push({path:item.dataUrl});
    userStore.currentActive = item.dataUrl
}

interface tagType {
    menuName:string,
    dataUrl:string,
    closable:boolean
}
const handleTagClose = function(tag:tagType){
    let index:number = userStore.titleConfig.tagList.findIndex((item:tagType)=>item.dataUrl == tag.dataUrl);
    if( (index == userStore.titleConfig.tagList.length-1) 
        &&  (tag.dataUrl == userStore.currentActive)){
        userStore.titleConfig.tagList.splice(index,1);
        router.push({path:userStore.titleConfig.tagList[index-1].dataUrl});
        userStore.currentActive = userStore.titleConfig.tagList[index-1].dataUrl
    }else{
        userStore.titleConfig.tagList.splice(index,1)
    }
    
    
}
</script>
<style scoped lang="scss">
.content-title{
    background-color: var(--menu-bg-color);
}
.title-menu-breadcrumb{
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    background-color: var(--menu-bg-color);
    .title-breadcrumb-icon{
        color: var(--text-menu-color);
        display: flex;
        margin-right: 20px;
        i{
            font-size: 20px;
            cursor: pointer;
        }
    }
}
.title-menu-tag{
    height: 40px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    .tag-item{
        color: var(--tag-color);
        border-color: var(--tag-color);
    }
    .active-tag{
        background-color: var(--tag-active-color);
    }
}
</style>