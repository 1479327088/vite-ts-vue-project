import api from "@/api/index";
import comm from "@/utils/comJs";
import { ElMessage } from 'element-plus'
export default function installPlugins(app:any){
    if(!app) return;
    app.config.globalProperties.$api = api;
    app.config.globalProperties.$comm = comm;
    app.config.globalProperties.$message = ElMessage;
}
