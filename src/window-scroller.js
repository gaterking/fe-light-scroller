
import raf from 'raf';
/**
 * Window窗口滚动事件
 */
class WindowScroller {
    /**
     * @param {windowScrollCallback} scrollCallback 滚动回调事件
     */
    constructor(scrollCallback) {
        this.scrollCallback = scrollCallback;
        this.initScroll();
        this.scrollTop = 0;
        this.rafId = 0; // raf id
    }

    static getScrollY() {
        // window.pageYOffset 兼容android
        const parentNode = document.documentElement || document.body.parentNode;
        const scrollY = window.pageYOffset || (parentNode && typeof parentNode.scrollTop === 'number' ? parentNode : document.body).scrollTop;
        return scrollY;
    }

    /**
     * 创建一个RAF回调，回调结束后检查是否有等待的scroll，如果有，重新触发
     */
    createRAF(scrollTop) {
        const newRafId = raf(() => {
            this.scrollTop = scrollTop || WindowScroller.getScrollY();
            if (this.scrollCallback) {
                this.scrollCallback({
                    scrollTop: this.scrollTop,
                });
            }
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
            window.addEventListener('scroll', this.scroll);
            this.scrollEventInited = true;
        }
    }

    bodyScroll() {
        this.createRAF();
    }

    dispose() {
        window.removeEventListener('scroll', this.scroll);
        this.scrollEventInited = false;
        raf.cancel(this.rafId);
        this.rafId = 0;
    }
}
/**
 * 滚动回调callback
 * @callback windowScrollCallback
 * @param {float} scrollTop 距离窗口顶部高度
 */

export default WindowScroller;
