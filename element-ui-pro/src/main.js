import Vue from 'vue'
import App from './App.vue'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router/index.js";
// import { YlForm, YlTable } from "./components/YlElementUIPro/src/index";
import YlElementUIPro from "yl-element-ui-pro";
Vue.use(ElementUI);
Vue.use(YlElementUIPro);
Vue.config.productionTip = false
new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
