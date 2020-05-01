import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from '../server/router/index';
import vuetify from '../plugins/vuetify';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"
Vue.use(PerfectScrollbar);
Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3000'), //options object is Optional
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);
Vue.config.productionTip = false;

new Vue({
	store,
	vuetify,
	router,
	render: (h) => h(App)
}).$mount('#app');
