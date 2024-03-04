<script setup lang="ts">
import { isDone ,isNum,r,a ,list, warnUser} from './hello';
import { reactive, ref } from 'vue'
import type { Ref } from 'vue';
defineProps<{ msg: string }>()

//ref标注类型
const num:Ref<string | number> = ref(200);
const num2 = ref<string | number>('2000');

//reactive标注类型
interface O {
  title:number | string,
  content:string
}
const obj:O = reactive({
  title:'Vue3 TS 标注类型',
  content:''
})

warnUser()


const count = ref(0)
</script>

<template>
  <h1>{{ msg + num + num2}}</h1>
  <h2>{{obj.title}}{{isDone}}{{isNum}}{{r+a}}</h2>
  <h3>{{list.join(',')}}</h3>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
