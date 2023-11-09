import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import ClickOutside from 'vue-click-outside'
import router from './router'
import { EmojiPickerPlugin } from 'vue-emoji-picker'
import store from './store'
import { BASEURL } from './constants'
import './registerServiceWorker'
import VueTextareaAutosize from 'vue-textarea-autosize'
import VueSocketIO from 'vue-socket.io'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// import { RecycleScroller } from 'vue-virtual-scroller'

Vue.use(VueTextareaAutosize)
Vue.use(EmojiPickerPlugin)
Vue.use(VueResource)
Vue.use(ClickOutside)
Vue.use(VueVirtualScroller)

// Vue.component('RecycleScroller', RecycleScroller)

Vue.http.interceptors.push((request, next) => {
    request.headers.set('x-auth-token', localStorage.token)
    // request.headers.set('Accept', 'application/json')
    next()
})

Vue.config.productionTip = false

new Vue({
    el: '#app-main',
    router,
    store,
    render: createElement => createElement(App)
})