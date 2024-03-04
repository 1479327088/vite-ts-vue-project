import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import qs from 'qs'
import useUserStore from '@/store/index';
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import router from '@/router/index.ts'
import comm from '@/utils/comJs';
import CryptoJS from 'crypto-js';

const defaultConfig:AxiosRequestConfig = {
    timeout: 15000
}
let showMessageBox = false //处理并发请求，避免弹出多个询问框

interface loadingConfigType {
    isLoading:boolean
}
interface IApiBase{
    code:number | string,
    msg:string,
    flag:boolean,
    data:any
}

class Http {
    loadingConfig:loadingConfigType;
    myAxios:AxiosInstance;
    constructor() {
        this.loadingConfig = {
            isLoading: false
        }
        this.myAxios = axios.create(defaultConfig)
        this.interceptorsRequest()
        this.interceptorsResponse()
    }

    openLoading() {
        const op = {
            ...{
                text: '拼命加载中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.6)'
            }, ...this.loadingConfig
        }
        ElLoading.service(op)
    }

    closeLoading() {
        ElLoading.service().close()
        this.loadingConfig = {
            isLoading: false
        }
    }

    //请求拦截
    interceptorsRequest() {
        this.myAxios.interceptors.request.use((config:any) => {
            this.loadingConfig.isLoading && this.openLoading()
            const token = useUserStore().token || <string>sessionStorage.getItem('Admin-Token');
            const headers = {
                ...(config.headers ? config.headers : {})
            }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            //请求拦截对post进行密钥加密；
            let postData = config.data;
            if (postData && config.method == 'post') {

                let strParams = '';
                if (Object.prototype.toString.call(postData) === '[object String]') {
                    strParams = postData;
                } else {
                    strParams = JSON.stringify(postData);
                }

                const aesPostData = comm.aesEn(strParams, 'MIGfMA0GCSgGSIb3')
                const md5PostData = CryptoJS.MD5(aesPostData).toString();
                headers['zzk'] = md5PostData;
            }

            config.headers = headers
            return config
        }, error => {
            this.loadingConfig.isLoading && this.closeLoading()
            throw new Error(JSON.stringify(error))
        })
    }

    interceptorsResponse() {
        const handleSuccess = function(res:IApiBase):any{
            if (res && res.code === '401') {
                if (!showMessageBox) {
                    //处理请求并发，避免弹出多个询问框
                    showMessageBox = true
                    ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                        confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning'
                    })
                        .then(() => {
                            // todo 跳去登录页面
                            sessionStorage.clear() // 清理sessionStorage
                            useUserStore().$reset();
                            router.replace({ path: '/login' });
                        })
                        .catch(() => {})
                    setTimeout(() => {
                        //3秒后解开  可以继续弹框询问
                        showMessageBox = false
                    }, 3000)
                    return res
                }
                return res

            } else {
                return res
            }
        }
        // 响应拦截
        this.myAxios.interceptors.response.use((response:any) => {
            this.loadingConfig.isLoading && this.closeLoading()
            const res = handleSuccess(response.data)
            return res
        }, error => {
            this.loadingConfig.isLoading && this.closeLoading()
            // 用户没有网络情况 或者 timeout时间过期
            if (!error.response && JSON.stringify(error).includes('timeout of')) {
                ElMessage.warning('网络请求超时,请稍后再试。')
                return
            }

            const {status, data} = error.response
            if (status >= 500) {
                ElMessage.error("网络错误: " + status)
                // myMessage({
                //   type: 'error',
                //   message:httpCode[status]
                // })
            } else {
                // 返回体有数据返回的
                return handleSuccess(data)
            }
        })
    }

    /**
     * @method 请求
     * @param { string } method 发送的方式
     * @param { stinng } url 请求的url
     * @param { object } config 配置项，看readme.md文件，并且更详细的可以看axios文档
     * @returns
     */
    request(method:string, url:string, config:any = {}) {
        if (!method || !url) {
            console.error(`请传入${method ? 'url' : 'method'}`)
            return
        }
        /**
         * @param { any } data 发送的数据
         * @param { object } extraConfig 跟config传的参数一样，这个权重最大， 例如一个接口多个发送方式(method)，跟config传的参数一样，这个权重最大
         */
        return (data:string|number|object, extraConfig:any = {}) => {
            const params:any = {
                ...{
                    method, url
                }, ...config
            }

            // 处理业务层传进来额外的参数，例如一个接口多个发送方式(method)
            for (const key in extraConfig) {
                if (extraConfig.suffixUrl !== undefined || extraConfig.suffixUrl !== '') {
                    params.url += extraConfig.suffixUrl
                } else {
                    params[key] = extraConfig[key]
                }
            }
            // loading配置
            if (params.loadingConfig && params.loadingConfig.isLoading) {
                this.loadingConfig = {...{isLoading: true}, ...(params.loadingConfig ? params.loadingConfig : {})}
            }

            if (method.toLowerCase() === 'get') {
                if (data && typeof data === 'object') {
                    params.params = data
                } else if (typeof data === 'string' || typeof data === 'number') {
                    params.url += data
                }
            } else if (method.toLowerCase() === 'post') {
                if (config.headers && config.headers['content-type'].includes('application/x-www-form-urlencoded')) {
                    params.data = qs.stringify(data)
                } else if (typeof data === 'string' || typeof data === 'number') {
                    params.url += data
                } else {
                    params.data = data
                }
            } else if (method.toLowerCase() === 'delete') {
                if (data && typeof data === 'object') {
                    params.data = data
                } else if (typeof data === 'string' || typeof data === 'number') {
                    params.url += data
                }
            } else {
                params.data = data
            }
            return this.myAxios.request(params)
        }
    }
}

const http = new Http()
const request = http.request.bind(http)
export {request, http}
