
import raf from 'raf';
/**
 * 容器窗口滚动事件
 */
class BoxScroller {
    /**
     * @param {boxScrollCallback} scrollCallback 滚动回调事件
     */
    constructor(scrollCallback, boxNode) {
        this.scrollCallback = scrollCallback;
        this.boxNode = boxNode;
        this.initScroll();
        this.scrollTop = 0;
        this.rafId = 0; // raf id
    }

    getScrollY() {
        // window.pageYOffset 兼容android
        const scrollY = this.boxNode && typeof this.boxNode.scrollTop === 'number' ? this.boxNode.scrollTop : 0;
        return scrollY;
    }

    /**
     * 创建一个RAF回调，回调结束后检查是否有等待的scroll，如果有，重新触发
     */
    createRAF(scrollTop) {
        if (this.rafId) {
            // 有正在执行的回调时间
            return;
        }
        const newRafId = raf(() => {
            this.scrollTop = scrollTop || this.getScrollY();
            if (this.scrollCallback) {
                this.scrollCallback({
                    scrollTop: this.scrollTop,
                });
            }
            this.rafId = null;
        });
        if (!this.rafId) {
            this.rafId = newRafId;
        }
    }

    /**
     * 初始化window滚动
     */
    initScroll() {
        if (!this.scrollEventInited) {
            this.scroll = this.bodyScroll.bind(this);
            this.boxNode.addEventListener('scroll', this.scroll);
            this.scrollEventInited = true;
        }
    }

    bodyScroll() {
        this.createRAF();
    }

    dispose() {
        this.boxNode.removeEventListener('scroll', this.scroll);
        this.scrollEventInited = false;
        raf.cancel(this.rafId);
        this.rafId = 0;
    }
}
/**
 * 滚动回调callback
 * @callback boxScrollCallback
 * @param {float} scrollTop 距离窗口顶部高度
 */

export default BoxScroller;
