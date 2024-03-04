<script  setup  lang="ts">
import api from "@/api/index";
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import  useCounterStore  from '@/store/index'
import { sysName } from '@/utils/const'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const userStore = useCounterStore();
const router = useRouter();

const html  = <HTMLElement>document.getElementById('html')
html.classList.remove('zt_dark');
html.classList.remove('dark');

//*************************** 切换登录方式 ***************************//
const typeFlag = ref<boolean>(true);
const handleLoginType = function():void{
    typeFlag.value = !typeFlag.value
}

//*************************** 密码登录 ***************************//
interface RuleType {
    param1:string;
    param2:string;
    verifyCode?:string;
    source?:number | string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm:RuleType = reactive({
    param1: '',
    param2: '',
    verifyCode:'',
    source:'1'
})
const rules = reactive<FormRules>({
    param1: [
        { required: true, message: '请输入帐号或手机号码', trigger: 'blur' }
    ],
    param2: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    verifyCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ],
})
const handleUserLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (!userStore.sysConfig.bk) return ElMessage.warning("获取系统配置失败，无法加密登录。");
          //加密开始
          let params:RuleType = {
            param1: ruleForm.param1,
            param2: comm.rsaEn(
                ruleForm.param2,
                userStore.sysConfig.bk
            ),
            verifyCode: ruleForm.verifyCode
          }
          api.login(params).then((res:any)=>{
            if (res.code == 200 && res.data) {
                // userStore.$reset();
                let token = res.data.accessToken;
                userStore.token = token;
                sessionStorage.setItem('Admin-Token' , token)
                router.replace("/index");
            } else {
                getVerifyCodeImg();
                ElMessage.warning(res.msg);
            }
          })
    }
  })
}

//*************************** 短信登录 ***************************//
const btnText = ref<string>('发送验证码');
const sendMessageTime = ref<number>(60);
const timer = ref<number>(0);
const codeFormRef = ref<FormInstance>();
interface codeFormType {
    phone:string;
    code:string;
}
const codeForm:codeFormType = reactive({
    phone: "", //用户名
    code: "", //验证码
})
const codeRules = reactive<FormRules>({
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
})
const handleNoteCode = function(){
    if (sendMessageTime.value != 60) return;
      let regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (!regPhone.test(codeForm.phone)) {
        return ElMessage.warning("请输入正确的手机号码");
      }
      sendMessageTime.value -= 1;
      btnText.value = `已发送( ${sendMessageTime.value}s )`
      timer.value = setInterval(() => {
            sendMessageTime.value -= 1;
            btnText.value = `已发送( ${sendMessageTime.value}s )`
            if (sendMessageTime.value <= 0) handleClearSetInterval(); //停止
      }, 1000);

      let param = {
        phone:comm.aesCbcEn(codeForm.phone)
      }
      api.sendVerifyCode(param).then( (res:any)=>{
        if (res.code == 200) {
            ElMessage.success('发送成功');
        } else {
            ElMessage.warning(res.msg);
            handleClearSetInterval(); //停止
        }
      });
}
//清除定时器
const handleClearSetInterval = function(){
    clearInterval(timer.value);
    timer.value = 0;
    sendMessageTime.value = 60;
    btnText.value = '发送验证码'
}
const handleCodeLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
          let param = {
            phone: comm.aesCbcEn(codeForm.phone),
            verificationCode: codeForm.code
          };
          api.mobileLogin(param).then((res:any)=>{
            if (res.code == 200 && res.data) {
                let token = res.data.accessToken;
                userStore.token = token;
                sessionStorage.setItem('Admin-Token' , token)
                router.replace("/index");
          } else {
            ElMessage.warning(res.msg);
          }
          })
          
    }
  })
}
    

//*************************** 验证码图片 ***************************//
const verifyCodeImg = ref<string>('')
const getVerifyCodeImg = function():void {
    api.getVerifyCodeImg().then((res:any)=>{
        if (res && res.code == 200) {
            verifyCodeImg.value = res.data;
        } else {
            ElMessage.warning(res.msg);
        }
    });
}
getVerifyCodeImg()

//*************************** 获取当前配置 ***************************//
const getSystemCurrConfig = function():void{
    api.getSystemCurrConfig().then((res:any)=>{
        if (res && res.code == 200) {
            userStore.sysConfig = Object.assign({},res.data)
            sessionStorage.setItem('Admin-System-config',JSON.stringify(res.data))
        } else {
            ElMessage.warning(res.msg);
        }
    });
}
getSystemCurrConfig()

//*************************** 记住密码 ***************************//
import comm from '@/utils/comJs';
const rememderP = ref<boolean>(false);
const handleRemederP = function(v:string | number | boolean):void{
    let A_REM_P:RuleType = {
        param1: ruleForm.param1,
        param2: ruleForm.param2,
    }
    if(v && A_REM_P.param1 && A_REM_P.param2){
        let pStr = comm.aesEn(JSON.stringify(A_REM_P), 'MIGfMA0GCSgGSIb3')
        localStorage.setItem('A_REM_P',pStr)
    }else{
        localStorage.setItem('A_REM_P','')
    }
}
</script>

<template>
    <section class="login_section">
        <div class="login_box">
            <div class="login_title">{{ sysName }}</div>
            <div class="login_content">
                <div class="login_img">
                    <img src="@/assets/image/loginImg.jpg" alt="" srcset="">
                </div>
                <div class="login_user">
                    <div class="login_type" @click="handleLoginType">
                        <div :class="{'login_type_text':true,'login_type_active':typeFlag}">密码登录</div>
                        <div :class="{'login_type_text':true,'login_type_active':!typeFlag}">短信登录</div>
                    </div>
                    <div class="login_user_pwd">
                        <template v-if="typeFlag">
                            <el-form
                                ref="ruleFormRef"
                                :model="ruleForm"
                                :rules="rules"
                                label-width="0"
                                size="large">
                                <el-form-item prop="param1">
                                    <el-input prefix-icon="User" v-model="ruleForm.param1" placeholder="请输入帐号"/>
                                </el-form-item>
                                <el-form-item prop="param2">
                                    <el-input prefix-icon="Lock" type="password" v-model="ruleForm.param2" placeholder="请输入密码"/>
                                </el-form-item>
                                <el-form-item prop="verifyCode" class="login_code_box">
                                    <el-input class="login_code_input" prefix-icon="Cellphone" @keyup.enter.native="handleUserLogin(ruleFormRef)" v-model="ruleForm.verifyCode" placeholder="验证码"/>
                                    <div class="login_code" @click="getVerifyCodeImg">
                                        <img style="width: 100%;height: 100%;" :src="verifyCodeImg" alt="">
                                    </div>
                                </el-form-item>
                                <el-form-item style="margin-bottom: 0;">
                                    <el-checkbox v-model="rememderP" @change="handleRemederP" label="记住密码" size="large" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" style="width: 100%;" @click="handleUserLogin(ruleFormRef)">登录</el-button>
                                </el-form-item>
                            </el-form>
                        </template>
                        <template v-else>
                            <el-form
                                ref="codeFormRef"
                                :model="codeForm"
                                :rules="codeRules"
                                label-width="0"
                                size="large">
                                <el-form-item prop="phone">
                                    <el-input prefix-icon="User" v-model="codeForm.phone" maxlength="11" placeholder="请输入手机号码"/>
                                </el-form-item>
                                <el-form-item prop="verifyCode" class="login_code_box" style="margin-bottom: 22px;">
                                    <el-input class="login_code_input" prefix-icon="Cellphone" v-model="codeForm.code" @keyup.enter.native="handleCodeLogin(ruleFormRef)" placeholder="请输入验证码"/>
                                    <div class="login_code" @click="handleNoteCode">
                                        <el-button style="width: 100%;" type="primary" :disabled="btnText !='发送验证码'">{{btnText}}</el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" style="width: 100%;" @click="handleCodeLogin(codeFormRef)">登录</el-button>
                                </el-form-item>
                            </el-form>
                        </template>
                    </div>
                </div>
            </div>
            <div class="login_verson">版本号：V1.0.0</div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.login_section{
    width: 100%;
    height: 100%;
    background-color: #4268c5;
    background-size: 100% 100%;
    .login_box{
        width: 50%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .login_title{
            font-size: 20px;
            text-align: center;
            margin-bottom: 20px;
            color:#FFF;
        }
        .login_content{
            border-radius: 10px;
            background-color: #FFF;
            display: flex;
            .login_img{
                width: 43%;
                img{
                    width: 100%;
                    vertical-align: top;
                    border-bottom-left-radius: 10px;
                    border-top-left-radius: 10px;
                }
            }
            .login_user{
                width: 57%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .login_type{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 400;
                    margin-bottom: 30px;
                    .login_type_text{
                        padding: 5px 0;
                        cursor: pointer;
                        margin: 0 20px;
                        font-size: 22px;
                        border-bottom: 2px solid #FFF;
                        color: #606266;
                    }
                    .login_type_active{
                        color: #409eff;
                        border-color: #409eff;
                    }
                    
                }
                .login_user_pwd{
                    margin: 0 auto;
                    width: 70%;
                    :deep(input){
                        box-shadow: 0 0 0 1000px #fff inset !important;
                    }
                    .login_code_box{
                        margin-bottom: 12px;
                        :deep(.el-form-item__content){
                            flex-wrap: nowrap;
                            .login_code_input{
                                width: calc(100% - 120px);
                            }
                            .login_code{
                                width: 100px;
                                margin-left: 20px;
                                height: 100%;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
        .login_verson{
            color:#FFF;
            text-align: center;
            margin-top: 40px;
            opacity: 0.2;
        }
    }
}
</style>