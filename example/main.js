import Vue from 'vue';
import app from './app.vue';

const vueConfig = {
    render: h => h(app),
};
new Vue(vueConfig).$mount('#app');
