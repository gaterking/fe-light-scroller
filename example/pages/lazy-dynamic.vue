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
        <infinite-loading @infinite="infiniteHandler"/>
    </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import FeLightScroller from 'dist/fe-light-scroller';
import { setTimeout } from 'timers';

export default {
    components: {
        InfiniteLoading,
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
                page: 0,

            },
        };
    },
    mounted() {
        this.loadData().then((data) => {
            this.lightScrollerData.list = data;
            this.dataOptions.page = 0;
        });
    },
    methods: {
        getRandomHeight(min = 25, max = 200) {
            return Math.random() * (max - min) + min;
        },
        loadData(page = 0) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const data = [];
                    const statrIndex = page * 20 + 0;
                    for (let i = statrIndex; i < statrIndex + 20; i += 1) {
                        data.push({ value: i });
                    }
                    resolve(data);
                }, 500);
            });
        },
        infiniteHandler($state) {
            this.loadData(this.dataOptions.page + 1).then((data) => {
                this.lightScrollerData.list = this.lightScrollerData.list.concat(data);
                this.dataOptions.page += 1;
                $state.loaded();
            });
        },
    },
};
</script>
