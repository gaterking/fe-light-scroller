/**
 * size类型
 * @typedef {Object} Size
 * @property {number} height
 */
/**
 * 列表项大小计算
 */
class SizeManager {
    /**
   *
   * @param {Object} param0 构造参数
   * @param {number} param0.count 节点总数
   * @param {Object|function} param0.itemSizeGetter 节点大小
   * @param {string|number} param0.estimatedHeight 节点预计高度，动态计算节点大小时，
   * 节点的高度需要Dom添加到document才能获得，在这之前，可用这个值作为假高度
   */
    constructor({
        count,
        itemSizeGetter,
        estimatedHeight,
    }) {
        this.count = count;
        this.itemSizeGetter = itemSizeGetter;
        this.estimatedHeight = estimatedHeight;
        this.itemSizeCache = []; // 节点大小数据缓存
        this.explicitTotalHeight = 0; // 明确高度的节点合计高度
    }

    getTotalCount() {
        return this.itemSizeCache.length;
    }

    updateEstimatedHeight(newVal) {
        this.estimatedHeight = newVal;
    }

    /**
     * 更新节点大小
     * @param {number} rowIndex 列表索引
     */
    updateSize(rowIndex, newSize, updateNext = false) {
        const oldSize = this.itemSizeCache[rowIndex];
        if (newSize && (!oldSize || (oldSize.height !== newSize.height || oldSize.isEstimated))) {
            let preSize = this.getSize(rowIndex - 1);
            this.itemSizeCache[rowIndex] = {
                ...newSize,
                isEstimated: false,
                Y: preSize ? (preSize.Y + preSize.height) : 0,
            };
            // 更新后续节点
            let nextIndex = rowIndex + 1;
            preSize = this.itemSizeCache[rowIndex];
            if (updateNext) {
                while (nextIndex < this.itemSizeCache.length) {
                    preSize = this.updateNextSize(nextIndex, preSize);
                    nextIndex += 1;
                }
            }
        }
    }

    updateNextSize(nextRowIndex, preSize) {
        const nextSize = this.getSize(nextRowIndex);
        nextSize.Y = preSize.Y + preSize.height;
        this.itemSizeCache[nextRowIndex] = nextSize;
        return this.itemSizeCache[nextRowIndex];
    }

    /**
     * 获取节点大小
     * @param {number} rowIndex 列表索引
     */
    getSize(rowIndex) {
        if (this.itemSizeCache[rowIndex]) {
            return this.itemSizeCache[rowIndex];
        }
        return null;
    }

    /**
     * 动态增加列表节点
     */
    appendCount(countToAppend) {
        const preIndex = this.itemSizeCache.length - 1;
        for (let i = 0; i < countToAppend; i += 1) {
            const preSize = this.getSize(preIndex + i);
            this.itemSizeCache.push({
                Y: preSize ? (preSize.Y + preSize.height) : 0,
                height: this.estimatedHeight,
                isEstimated: true,
            });
        }
        this.count += countToAppend;
        return this.itemSizeCache.length;
    }

    /**
     * 清空
     */
    clear() {
        this.itemSizeCache = [];
    }
}
export default SizeManager;
