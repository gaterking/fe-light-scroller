import VueRouter from 'vue-router';
import FixedHeightComponent from './pages/fixed-height.vue';
import DynamicHeightComponent from './pages/dynamic-height.vue';
import LazyDynamicComponent from './pages/lazy-dynamic.vue';


const routes = [
    { path: '/', name: 'FixedHeight', component: FixedHeightComponent },
    { path: '/dynamic', name: 'DynamicHeight', component: DynamicHeightComponent },
    { path: '/lazydynamic', name: 'LazyDynamic', component: LazyDynamicComponent },

];
const router = new VueRouter({ routes });
export default router;
