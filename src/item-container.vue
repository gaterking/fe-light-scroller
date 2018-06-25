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
    mounted() {
        // this.$nextTick(()=> {
        //     this.caculateSize(this.$refs.item);
        // });
    },
    methods: {
        caculateSize(itemDom) {
            if (itemDom
                && itemDom.ownerDocument
                && itemDom.ownerDocument.defaultView
                && itemDom instanceof itemDom.ownerDocument.defaultView.HTMLElement
            ) {
                // let parentNode = itemDom.parentNode;
                const itemRect = itemDom.getBoundingClientRect();
                this.size = {
                    height: itemRect.height,
                    width: itemRect.width,
                };
                // this.$emit('sizeUpdated', this.showIndex, this.size);
            }
            return this.size;
        },
        getSize() {
            return this.caculateSize(this.$refs.item);
        },
    },
};
</script>
