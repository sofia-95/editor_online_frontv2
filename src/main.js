import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use( CKEditor );
new Vue({
  render: h => h(App),
}).$mount('#app')
