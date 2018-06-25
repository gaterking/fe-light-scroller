import VueRouter from 'vue-router';
import FixedHeightComponent from './pages/fixed-height.vue';
import DynamicHeightComponent from './pages/dynamic-height.vue';
import LazyDynamicComponent from './pages/lazy-dynamic.vue';
import FixedHeightScrollDivComponent from './pages/fixed-heigt-scroll-div.vue';


const routes = [
    { path: '/', name: 'FixedHeight', component: FixedHeightComponent },
    { path: '/dynamic', name: 'DynamicHeight', component: DynamicHeightComponent },
    { path: '/lazydynamic', name: 'LazyDynamic', component: LazyDynamicComponent },
    { path: '/fixheightdiv', name: 'FixedHeightDiv', component: FixedHeightScrollDivComponent },

];
const router = new VueRouter({ routes });
export default router;
