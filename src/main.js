import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Naive UI 按需引入：组件由 unplugin-vue-components 自动导入，API 由各组件显式 import

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
