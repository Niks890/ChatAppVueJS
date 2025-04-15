/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import {
    Button,
    Card,
    message,
    Popconfirm,
    Table
} from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
// font
loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins phải use từng dòng
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(Button);
app.use(Card);
app.use(Popconfirm);
app.use(Table);
app.use(message);
app.use(createPinia())
app.use(router)

// Mount vue app
app.mount('#app')
