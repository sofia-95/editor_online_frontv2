import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(CKEditor)
new Vue({
   el: '#app',
  render: h => h(App),
})
