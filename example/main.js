import Vue from 'vue';
import VueRouter from 'vue-router';
import app from './app.vue';
import router from './router';

Vue.use(VueRouter);
const vueConfig = {
    render: h => h(app),
    router,
};
new Vue(vueConfig).$mount('#app');
