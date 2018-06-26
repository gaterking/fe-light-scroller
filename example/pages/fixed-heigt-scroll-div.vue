<template>
    <div
        id="box"
        class="m-fixed-heigt-scroll-div">
        <fe-light-scroller
            :list="lightScrollerData.list"
            :item-height="lightScrollerData.itemHeight"
            :visible-height="screenHeight"
            box-id="box">
            <div
                v-if="props.item"
                slot-scope="props"
                class="item-box">{{ props.item.item.value }}
            </div>
        </fe-light-scroller>
        <div class="m-option-bar">
            <label>列表数<input
                v-model="dataOptions.rowCount"
                type="number" ></label>
            <button @click="initByDataOptions">Reset</button>
        </div>
    </div>
</template>

<script>
import FeLightScroller from 'dist/fe-light-scroller';

export default {
    components: {
        FeLightScroller,
    },
    data() {
        return {
            lightScrollerData: {
                list: [],
                itemHeight: 50,

            },
            screenHeight: 500,
            dataOptions: {
                // isDymaticHeight: false,
                rowCount: 50,
            },
        };
    },
    mounted() {
        this.initByDataOptions();
    },
    methods: {
        initByDataOptions() {
            this.lightScrollerData.list = [];
            for (let i = 0; i < this.dataOptions.rowCount; i += 1) {
                this.lightScrollerData.list.push({ value: i });
            }
        },
    },
};
</script>
<style lang="scss">
.m-fixed-heigt-scroll-div {
    position: absolute;
    top: 20px;
    width: 100%;
    height: 500px;
    overflow: scroll;
    border: 1px solid #fff000;
}
</style>
