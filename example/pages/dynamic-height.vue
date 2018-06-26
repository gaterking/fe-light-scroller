<template>
    <div>
        <fe-light-scroller
            :list="lightScrollerData.list"
            :item-height="lightScrollerData.itemHeight"
            :visible-height="screenHeight">
            <div
                v-if="props.item"
                slot-scope="props"
                :style="{height: getRandomHeight() + 'px'}"
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
            screenHeight: window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight,
            dataOptions: {
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
        getRandomHeight(min = 25, max = 200) {
            return Math.random() * (max - min) + min;
        },
    },
};
</script>
