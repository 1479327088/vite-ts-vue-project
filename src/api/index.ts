import { request } from "../axios/axios";
const systemUrl = "/dpa-cloud";

export default {
    //登录接口
    getVerifyCodeImg: request('get', systemUrl + '/system/getVerifyCodeImg'), //获取验证码图片
    logout: request('post', systemUrl + '/system/logout'), // 退出登录
    login: request('post', systemUrl + '/system/login', {
        loadingConfig: {
          isLoading: true,
          text: "登录中..."
        }
    }),
    sendVerifyCode:request('post', systemUrl + '/system/getVerifyCode'),     //获取短信验证码
    mobileLogin:request('post', systemUrl + '/system/messageLogin'), // 短信验证码登录

    //获取配置
    getSystemCurrConfig: request("get", systemUrl + "/sysConfig/getSystemCurrConfig"), // 获取系统当前配置信息
    getCurrentUser: request('get', systemUrl +'/system/getCurrentUser'), //获取当前登录用户

    getMenuByUser: request('get', systemUrl +'/sys/authority/queryMenuByUser/'), //根据选择系统ID，获取相关菜单树
}