<template>
    <div>
        <fe-light-scroller
            :list="lightScrollerData.list"
            :item-height="lightScrollerData.itemHeight"
            :dynamic-item-height="false"
            :visible-height="screenHeight">
            <div
            v-if="props.item"
            slot-scope="props">{{props.item.item.value}}
            </div>
        </fe-light-scroller>
        <div class="m-option-bar">
            <label>是否动态高度<input
                type="check"
                v-model="dataOptions.isDymaticHeight"></label>
            <label>列表数<input type="number" v-model="dataOptions.rowCount" /></label> 
            <button @click="initByDataOptions">Reset</button>
        </div>
    </div>
</template>

<script>
import FeLightScroller from 'dist/bundle';

export default {
    name: 'App',
    components: {
        FeLightScroller,
    },
    data() {
        return {
            lightScrollerData: {
                list: [],
                itemHeight: 50,

            },
            screenHeight: window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight,
            dataOptions: {
                isDymaticHeight: false,
                rowCount: 50
            },
        };
    },
    methods: {
        initByDataOptions () {
            this.lightScrollerData.list = [];
            for (var i = 0; i< this.dataOptions.rowCount; i++) {
                this.lightScrollerData.list.push({value: i});
            }
        }
    },
    mounted () {
        this.initByDataOptions();
    }
};
</script>
<style lang="scss" scoped>
.m-option-bar {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #8f8f8f;
}
</style>
