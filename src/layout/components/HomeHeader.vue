<template>
    <section class="layout_header_index">
        <div class="layout_header_left">{{sysName}}</div>
        <div class="layout_header_right">
            <div class="layout_header_avatar">
                <el-dropdown size="large" @command="handleAvatarCommand">
                    <div class="layout_header_img">
                        <el-image v-if="userStore.userConfig.iconImg?.url" :src="userStore.userConfig.iconImg?.url" fit="fill" />
                        <img v-else src="@/assets/image/person.jpg" alt="">
                        <div class="layout_header_fullName">{{ userStore.userConfig.fullName || ''}}</div>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="personCenter">个人中心</el-dropdown-item>
                            <el-dropdown-item command="loginOut">
                                <el-icon><SwitchButton /></el-icon>退出
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <el-divider direction="vertical" style="border-color: var(--title-right-text-color);"/>
            <div class="layout_header_roles">
                <el-dropdown size="large" @command="handleRolesCommand">
                    <div class="layout_header_roleName">
                        <span>{{ roleList ? roleList[0].roleValue : '--' }}</span>
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item,index) in roleList" :index="index" :command="item.id">{{item.roleValue}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <!-- <el-switch 
                v-model="bgSwitch" 
                inline-prompt 
                active-icon="Sunny" 
                inactive-icon="Moon" 
                class="bg_switch"
                @change="handleSwitchBg">
            </el-switch> -->
            <div class="layout_header_switch" @click="handleSwitchBg">
                <div class="layout_Sunny" :class="{'isShow':bgSwitch}">
                    <el-icon><Sunny /></el-icon>
                </div>
                <div  class="layout_moon" :class="{'isShow':!bgSwitch}">
                    <el-icon><Moon /></el-icon>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { sysName } from '@/utils/const'
import  useCounterStore  from '@/store/index'
import { computed, ref } from 'vue';
const userStore = useCounterStore();
import { useRouter } from 'vue-router'
const router = useRouter();
import api from '@/api/index'

const roleList = computed(()=>userStore.userConfig.roleList);

const handleAvatarCommand = function(command: string | number | object){
    if(command === 'personCenter'){
        router.push('/personCenter')
    }else if(command === 'loginOut'){
        ElMessageBox.confirm('是否退出登录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            api.logout().then( (res:any)  => {
                const { flag } = res;
                if( flag ){
                    userStore.token = "";
                    sessionStorage.clear();
                    userStore.$reset();
                    router.replace({ path: '/login' });
                }
            })
        })
    }
}
const handleRolesCommand = function(command: string | number | object){ 
    ElMessageBox.confirm('确认切换角色？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            console.log(command);
        })
}

//模式切换
const bgSwitch = ref<boolean>(false);
const handleSwitchBg = function(){
    bgSwitch.value = !bgSwitch.value
    const html  = <HTMLElement>document.getElementById('html')
    html.classList.toggle('zt_dark');
    html.classList.toggle('dark');
}

</script>
<style scoped lang="scss">
.layout_header_index{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .layout_header_left{
        font-size: 20px;
        color: var(--title-text-color);
    }
    .layout_header_right{
        display: flex;
        align-items: center;
        gap: 10px;
        .layout_header_avatar{
            .layout_header_img{
                display: flex;
                align-items: center;
                cursor: pointer;
                .layout_header_fullName{
                    font-size: 16px;
                    margin-left: 10px;
                    color: var(--title-right-text-color);
                }
                :deep(img){
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
            }
        }
        .layout_header_roles{
            display: flex;
            align-items: center;
            cursor: pointer;
            .layout_header_roleName{
                font-size: 16px;
                display: flex;
                align-items: center;
                color: var(--title-right-text-color);
            }
        }
        .bg_switch{
            :deep(.el-switch__core){
                .el-switch__inner{
                    i{
                        color: var(--title-right-text-color);
                    }
                }
            }
        }
        .layout_header_switch{
            display: flex;
            background-color: var(--switch-bg-color);
            border: 1px solid var(--switch-border-color);
            border-radius: 12px/50%;
            padding: 1px 1px;
            cursor: pointer;
            transition: border-color .25s,background-color .25s;
            .layout_Sunny{
                display: flex;
                padding: 3px;
                border-radius: 50%;
                background-color: #FFF;
                color: #000;
            }
            .layout_moon{
                display: flex;
                padding:3px;
                border-radius: 50%;
                background-color: #000;
                color: #FFF;
            }
            .isShow{
                visibility: hidden;
                transition: visibility 5;
            }
        }
    }
}
</style>