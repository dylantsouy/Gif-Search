import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
    error:'./loading.gif',
   loading:'./loading.gif'
})
