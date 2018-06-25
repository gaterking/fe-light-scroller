<template>
    <div
        ref="scrollBox"
        :style="boxStyle"
        class="m-virtual-scroller">
        <item-container
            v-for="(item, index) in showList"
            ref="itemBox"
            :show-index="index"
            :key="item.oIndex">
            <slot
                v-if="true || item.isEstimated"
                :item="item"/>
        </item-container>
    </div>
</template>

<script>
import offset from './utils/offset';
import WindowScroller from './window-scroller';
import BoxScroller from './box-scroller';
import RANGE_TYPE from './enum/range-type';
import SizeManager from './size-manager';
import ItemContainer from './item-container.vue';

export default {
    name: 'LightScroller',
    components: {
        ItemContainer,
    },
    props: {
        /**
         * vId，调试使用
         */
        vId: {
            type: String,
            default: '',
        },
        /**
         * 待渲染列表数组
         */
        list: {
            type: Array,
            required: true,
        },
        /**
         * 可视区域高度，px
         */
        visibleHeight: {
            type: Number,
            required: true,
        },
        /**
         * 固定行高，px
         */
        itemHeight: {
            type: Number,
            required: true,
        },
        /**
         * 是否动态高度，如果true，itemHeight将作为预估高度使用
         */
        dynamicItemHeight: {
            type: Boolean,
            default: false,
        },
        /**
         * 容器Id
         */
        boxId: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            boxStyle: {
                // 外层盒子样式
                paddingTop: '0px',
                paddingBottom: '0px',
            },
            /**
             * 可视区域渲染列表，是list的子集
             */
            showList: [],
            /**
             * showList索引 {startIndex: 0, endIndex: 4}
             */
            showIndex: {
                startIndex: -1,
                endIndex: -1,
            },
            listSizeManager: null,
            scrollerManager: null,
            containerSize: { // 容器Rect
                top: 0,
            },
            virtualScrollTimes: 0,
            renderStartTime: 0,
            orignScrollTop: -1,
            lastUpdatedIndex: null,
        };
    },
    watch: {
        list: {
            handler(newVal, oldVal) {
                const oldLength = oldVal ? oldVal.length : 0;
                if (newVal) {
                    // 新数据
                    this.listSizeManager.appendCount(newVal.length - oldLength);
                } else if (!newVal || newVal.length === 0) {
                    this.listSizeManager.clear();
                }
                this.virtualScroll({
                    scrollTop: this.scrollerManager.scrollTop,
                }, true);
            },
        },
        itemHeight(newVal) {
            this.listSizeManager.updateEstimatedHeight(newVal);
        },
    },
    mounted() {
        this.initScroller();
        // 初始化SizeManager
        this.listSizeManager = new SizeManager({
            count: this.list.length,
            itemSizeGetter: this.dynamicItemHeight ? this.getItemDomSize : this.itemHeight,
            estimatedHeight: this.itemHeight,
        });
    },
    updated() {
        this.debug(`${this.vId} updated event enter: ${new Date().getTime()}`);

        if (
            !this.$refs.itemBox || (this.lastUpdatedIndex
            && this.showIndex.startIndex === this.lastUpdatedIndex.startIndex
            && this.showIndex.endIndex === this.lastUpdatedIndex.endIndex)
        ) {
            return;
        }

        // let s = new Date().getTime();
        for (let showIndex = 0; showIndex < this.$refs.itemBox.length; showIndex += 1) {
            const i = this.showIndex.startIndex + showIndex;
            const boxSize = this.$refs.itemBox[showIndex].getSize();
            let updateNext = false;
            if (i === this.showIndex.endIndex) {
                // 最后一个加载
                updateNext = true;
            }
            this.listSizeManager.updateSize(i, boxSize, updateNext);
            if (i === this.showIndex.endIndex) {
                // 重新刷新显示
                this.virtualScroll({
                    scrollTop: this.scrollerManager.scrollTop,
                }, true);
            }
        }
        this.lastUpdatedIndex = {
            startIndex: this.showIndex.startIndex,
            endIndex: this.showIndex.endIndex,
            total: this.list.length,
        };
        this.$emit('listUpdated', this.lastUpdatedIndex);
        const endTime = new Date().getTime();
        this.debug(`${this.vId} updated event: ${endTime}`);
    },
    destroyed() {
        this.destoryScroller();
        this.listSizeManager.clear();
    },
    methods: {

    /**
         * 计算可视列表范围
         * @param {number} boxScrollTop 父容器滚动高度
         * @param {number} currentStartIndex 目前显示列表初始索引，-1表示没有showList.length === 0
         * @param {number} vHeight 可视高度
         * @returns {Object}
         */
        getVisibleList(boxScrollTop, currentStartIndex, vHeight) {
            let startIndex = -1;
            let endIndex = -1;

            if (this.listSizeManager.getTotalCount() === 0) {
                // 部分情况下出现cache无值，但list仍有缓存
                return null;
            }
            if (currentStartIndex === -1) {
                // 未进行过显示或showList.length === 0
                startIndex = this.list.length === 0 ? -1 : 0;
            } else {
                startIndex = currentStartIndex;
            }
            // let iterativeIndex = startIndex;
            // let maxListIndex = this.list.length - 1;
            if (startIndex >= 0) {
                startIndex = this.getStartIndex(startIndex, boxScrollTop, vHeight);
            }
            endIndex = startIndex;
            if (startIndex >= 0) {
                endIndex = this.getEndIndex(startIndex, boxScrollTop, vHeight);
            }
            if (startIndex === -1) {
                // this.debug(`${this.vId} VisibleList null`);
                return null;
            }
            // this.debug(`${this.vId} VisibleList ${startIndex} ${endIndex}`);
            return {
                startIndex,
                endIndex,
            };
        },
        /**
         * 查找起始startIndex，-1表示找不到
         */
        getStartIndex(baseIndex, boxScrollTop, vHeight) {
            const listLength = this.list.length;
            let startIndex = -1;
            let iterativeIndex = listLength === 0 ? -1 : baseIndex;
            let preRangeType = null;
            let startIndexFixed = false;
            while (!startIndexFixed && iterativeIndex >= 0 && iterativeIndex < this.list.length) {
                const iterativeSize = this.listSizeManager.getSize(iterativeIndex);
                const iterativeRangeType = this.isInVisibleRange(iterativeSize,
                    boxScrollTop,
                    vHeight);
                switch (iterativeRangeType) {
                case RANGE_TYPE.LEFT:
                    if (preRangeType === RANGE_TYPE.MIDDLE
                    || preRangeType === RANGE_TYPE.MIDDLE_RIGHT) {
                        // 右节点完全覆盖可视范围
                        startIndex = iterativeIndex + 1;
                        startIndexFixed = true;
                    }
                    iterativeIndex += 1;
                    break;
                case RANGE_TYPE.MIDDLE_LEFT:
                    startIndex = iterativeIndex;
                    startIndexFixed = true;
                    break;
                case RANGE_TYPE.MIDDLE:
                    if (iterativeIndex === 0) {
                        startIndex = 0;
                        startIndexFixed = true;
                    }
                    iterativeIndex -= 1;
                    break;
                default:
                    iterativeIndex -= 1;
                    break;
                }
                preRangeType = iterativeRangeType;
            }
            return startIndex;
        },
        /**
         * 查找起始endIndex，-1表示找不到
         */
        getEndIndex(startIndex, boxScrollTop, vHeight) {
            const listLength = this.list.length;
            let iterativeIndex = listLength === 0 ? -1 : startIndex;
            let endIndex = iterativeIndex;
            let preRangeType = null;
            let endIndexFixed = false;

            while (!endIndexFixed && iterativeIndex >= 0 && iterativeIndex < listLength) {
                const iterativeSize = this.listSizeManager.getSize(iterativeIndex);
                const iterativeRangeType = this.isInVisibleRange(iterativeSize,
                    boxScrollTop,
                    vHeight);
                switch (iterativeRangeType) {
                case RANGE_TYPE.LEFT:
                case RANGE_TYPE.MIDDLE_LEFT:
                    iterativeIndex += 1;
                    break;
                case RANGE_TYPE.MIDDLE:
                    if (iterativeIndex === listLength - 1) {
                        endIndex = iterativeIndex;
                        endIndexFixed = true;
                    }
                    iterativeIndex += 1;
                    break;
                case RANGE_TYPE.MIDDLE_RIGHT:
                    endIndex = iterativeIndex;
                    endIndexFixed = true;
                    break;
                case RANGE_TYPE.RIGHT:
                    if (preRangeType !== null) {
                        endIndex = iterativeIndex - 1;
                    }
                    endIndexFixed = true;
                    break;
                default:
                    break;
                }
                preRangeType = iterativeRangeType;
            }
            return endIndex;
        },
        /**
         * 是否在显示范围
         */
        isInVisibleRange(size, boxScrollTop, vHeight) {
            // console.log(boxScrollTop);
            // console.log(vHeight);
            const sizeY = size.Y;
            const sizeBottomY = sizeY + size.height;
            const boxVisibleBottomY = vHeight + boxScrollTop + 700; // 可视范围前后增加50px缓冲区
            let inRangeType = RANGE_TYPE.MIDDLE;
            let boxScrollTopExtented = boxScrollTop - 700;
            boxScrollTopExtented = boxScrollTopExtented >= 0 ? boxScrollTopExtented : 0;
            if (boxScrollTop >= 0) {
                if (sizeY >= boxScrollTopExtented && sizeBottomY <= boxVisibleBottomY) {
                    inRangeType = RANGE_TYPE.MIDDLE;
                }
                if (sizeY < boxScrollTopExtented
                && sizeBottomY >= boxScrollTopExtented
                && sizeBottomY < boxVisibleBottomY) {
                    inRangeType = RANGE_TYPE.MIDDLE_LEFT;
                } else if (sizeBottomY < boxScrollTopExtented) {
                    inRangeType = RANGE_TYPE.LEFT;
                }
                if (sizeY >= boxScrollTopExtented
                && sizeY <= boxVisibleBottomY
                && sizeBottomY > boxVisibleBottomY) {
                    inRangeType = RANGE_TYPE.MIDDLE_RIGHT;
                } else if (sizeY > boxVisibleBottomY) {
                    inRangeType = RANGE_TYPE.RIGHT;
                }
            } else {
                if (sizeY === 0) {
                    inRangeType = RANGE_TYPE.MIDDLE_LEFT;
                }
                if (sizeY > 0 && sizeBottomY <= boxVisibleBottomY) {
                    inRangeType = RANGE_TYPE.MIDDLE;
                }
                if (sizeY > 0 && sizeY <= boxVisibleBottomY && sizeBottomY > boxVisibleBottomY) {
                    inRangeType = RANGE_TYPE.MIDDLE_RIGHT;
                } else if (sizeY > boxVisibleBottomY) {
                    inRangeType = RANGE_TYPE.RIGHT;
                }
            }
            return inRangeType;
        },
        /**
         * 计算padding
         */
        refreshPadding() {
            const { startIndex, endIndex } = this.showIndex;
            // this.debug(`${this.vId} list length ${this.list.length}`);
            let paddingTop = 0;
            let paddingBottom = 0;
            if (this.listSizeManager.getTotalCount() === 0) {
                // 部分情况下出现cache无值，但list仍有缓存
                return {
                    paddingTop,
                    paddingBottom,
                };
            }
            let lastSize = this.listSizeManager.getSize(this.list.length - 1);

            if (startIndex === -1 && this.list.length > 0) {
                paddingBottom = lastSize.Y + lastSize.height;
            } else if (startIndex >= 0) {
                const startSize = this.listSizeManager.getSize(startIndex);
                const endSize = this.listSizeManager.getSize(endIndex);
                lastSize = this.listSizeManager.getSize(this.list.length - 1);
                paddingTop = startSize.Y;
                paddingBottom = lastSize
                    ? (lastSize.Y + lastSize.height - (endSize.Y + endSize.height))
                    : 0;
            }
            // this.debug(`padding ${this.vId} ${paddingTop} ${paddingBottom}`);
            return {
                paddingTop,
                paddingBottom,
            };
        },
        getShowList(startIndex, endIndex) {
            let itemSize = null;
            let oIndex = -1;

            return this.list.slice(startIndex, endIndex).map((item, index) => {
                itemSize = this.listSizeManager.getSize(startIndex + index);
                oIndex = startIndex + index;

                return {
                    item,
                    size: {
                        width: itemSize.width,
                        height: itemSize.height,
                    },
                    oIndex,
                };
            });
        },
        /**
         * 滚动事件回调
         */
        virtualScroll({ scrollTop = 0 }, force = false) {
            this.virtualScrollTimes += 1;
            if (this.orignScrollTop === scrollTop && !force) {
                return;
            }
            this.orignScrollTop = scrollTop;

            this.renderStartTime = new Date().getTime();
            this.debug(`${this.vId} scrollTop ${force} ${scrollTop} ${this.renderStartTime}`);
            this.caculateContainerSize();
            const boxScrollTop = scrollTop - this.containerSize.top;
            const vListIndex = this.getVisibleList(boxScrollTop,
                this.showIndex.startIndex,
                this.visibleHeight);
            // 获取显示的列表itemSizeGetter
            // let showListUpdated = false;
            if (vListIndex
            && this.showIndex
            && (this.showIndex.startIndex !== vListIndex.startIndex
            || this.showIndex.endIndex !== vListIndex.endIndex)) {
                this.showList = [].concat(this.getShowList(vListIndex.startIndex,
                    vListIndex.endIndex + 1));
                this.showIndex = vListIndex;
                this.scrollStoped();
            } else if (!vListIndex && this.showIndex && this.showIndex.startIndex !== -1) {
                this.showList = [];
                this.showIndex = {
                    startIndex: -1,
                    endIndex: -1,
                };
                this.scrollStoped();
            }
        },
        scrollStoped() {
            // 解决抖动问题
            const { paddingTop, paddingBottom } = this.refreshPadding();

            this.boxStyle.paddingTop = `${paddingTop}px`;
            this.boxStyle.paddingBottom = `${paddingBottom}px`;
            this.debug(`${this.vId} showList: ${new Date().getTime()}`);

            this.$nextTick(() => {
                const {
                    paddingTop: _paddingTop,
                    paddingBottom: _paddingBottom,
                } = this.refreshPadding();

                this.boxStyle.paddingTop = `${_paddingTop}px`;
                this.boxStyle.paddingBottom = `${_paddingBottom}px`;
            });
        },
        getItemDomSize() {
            const size = null;
            return size;
        },
        caculateContainerSize() {
            this.containerSize = offset(this.$refs.scrollBox);
            if (this.boxId) {
                this.containerSize.top = 0;
            }
        },
        initScroller() {
            if (this.boxId) {
                this.scrollerManager = new BoxScroller(this.virtualScroll,
                    document.getElementById(this.boxId));
            } else {
                this.scrollerManager = new WindowScroller(this.virtualScroll);
            }
            this.caculateContainerSize();
        },
        destoryScroller() {
            this.scrollerManager.dispose();
        },
        debug(log) {
            // if (clear) {
            //     logs = [];
            // }
            // eslint-disable-next-line no-console
            console.log(log);
            // if (logs.length > 20) {
            //     logs.splice(0, 5);
            // }
            // logs.push(log);
            // document.getElementById('debuglist').innerHTML = logs.map(l => {
            //     return `<li>${l}</li>`;
            // }).join('');
        },
    },
};
</script>
