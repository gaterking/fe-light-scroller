<!-- 列表节点容器 -->
<template>
    <div ref="item">
        <slot/>
    </div>
</template>

<script>
export default {
    name: 'ItemContainer',
    props: {
        showIndex: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            size: {
                height: 0,
                width: 0,
            },
        };
    },
    methods: {
        /**
         * 计算节点高宽
         */
        caculateSize(itemDom) {
            if (itemDom
                && itemDom.ownerDocument
                && itemDom.ownerDocument.defaultView
                && itemDom instanceof itemDom.ownerDocument.defaultView.HTMLElement
            ) {
                const itemRect = itemDom.getBoundingClientRect();
                this.size = {
                    height: itemRect.height,
                    width: itemRect.width,
                };
            }
            return this.size;
        },
        getSize() {
            return this.caculateSize(this.$refs.item);
        },
    },
};
</script>
