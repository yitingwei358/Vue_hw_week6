/* eslint-disable camelcase */
import { createApp } from 'vue'
import './assets/all.scss'

import axios from 'axios'
import VueAxios from 'vue-axios'

// import './style.css'
import App from './App.vue'
import router from './router'

// veevalidate
// https://vee-validate.logaretm.com/v4/guide/i18n#localizing-field-names

import { defineRule, configure, Form, Field, ErrorMessage } from 'vee-validate'
import AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zh_TW from '@vee-validate/i18n/dist/locale/zh_TW.json'
Object.keys(AllRules).forEach(rule => {
  defineRule(rule, AllRules[rule])
})

configure({
  generateMessage: localize({ tw: zh_TW }),
  validateOnInput: true // 調整為：輸入文字時，就立即進行驗證
})
setLocale('tw')
const app = createApp(App)
app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)

app.use(VueAxios, axios)
app.use(router)
app.mount('#app')
