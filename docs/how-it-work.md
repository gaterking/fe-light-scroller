# 前端大数据列表渲染优化策略

## 问题背景

在`vue`里面我们一般使用`v-for`指令进行列表`Array`渲染，在大部分的场景使用中，该指令非常简单、高效，但如果列表的数量超过一定的量或者每行数据的渲染非常复杂，浏览器的性能会快速下降。这主要是因为浏览器的资源占用会随着列表数目和行复杂度递增，网页文档中Dom的数据占用了内存和CPU渲染，导致滚动时会出现卡顿现象，特别是在一些中低端的移动设备。

## 如何在滚动中降低内存

在前端优化的方法中，有一个优化方式是Lazy Loading（延迟加载），原理是在只显示用户可视范围内的界面，例如将不加载非可视区域的Img，等到Img滚动到再进行加载。同样的原理，针对列表渲染，我们可以计算列表中某个区间的子列表可以显示在可视区域（Viewport），对于其他的区域，使用padding进行占位。

## 实现

实现的核心是计算可视区域的区间列表`{startIndex, endIndex}`：
1. 维护一份sizeList，记录列表各节点的
```javascript
{
    height, // dom width
    width, // dom height
    Y // dom 左上角距离顶部Y轴距离
}
```
2. 列表节点使用固定的itemHeight作为第一次计算的高度；
3. 通过滚动scrollTop和Viewport的高度确定`{startIndex, endIndex}`

```javascript
scrollTop > itemHeight * startIndex && itemHeight * (startIndex + 1) > scrollTop;
(scrollTop + ViewportHeight) < itemHeight * endIndex && itemHeight * (startIndex - 1) < (scrollTop + ViewportHeight);
```
4. 渲染`{startIndex, endIndex}`区间的showList
5. 渲染完毕后记录showList各节点的{height, width, Y}，作为之后各计算的依据
6. 记录`{startIndex, endIndex}`
7. 触发下一次滚动事件，基于`{startIndex, endIndex}`和滚动方向，继续计算新的`{startIndexNext, endIndexNext}`，重复步骤4的渲染

### 滚动性能优化
可视区域列表的计算是通过scroll事件触发，在浏览器中scroll事件发生时，触发的频次非常高，间隔很近，如果事件中涉及到大量的位置计算、DOM 操作、元素重绘等工作且这些工作无法在下一个 scroll 事件触发前完成，就会造成浏览器掉帧，对于这种情况，在高级浏览器，可以采用`rAF(requestAnimationFrame)`执行scroll回调函数。
```javascript
function createRAF () {
        if (this.rafId) {
            return;
        }
        const newRafId = raf(() => {
            // 执行回调，进行大量计算
            this.rafId = null;
        });
        if (!this.rafId) {
            this.rafId = newRafId;
        }
}
function scroll () {
    createRAF();
}
window.addEventListener('scroll', scroll);
```
通常来说，rAF 被调用的频率是每秒 60 次，也就是 1000/60 ，触发频率大概是 16.7ms，在低端浏览器中，我们可以使用setTimeout来模拟这个触发频率。

### fe-light-scroller
基于上面的这些理论，这里实现了一个vue组件[`fe-light-scroller`](https://github.com/gaterking/fe-light-scroller)，可以直接向v-for那样简单地进行列表的渲染。