## 问题背景

在`vue`里面我们一般使用`v-for`指令进行列表`Array`渲染，在大部分的场景使用中，该指令非常简单、高效，但如果列表的数量超过一定的量或者每行数据的渲染非常复杂，浏览器的性能会快速下降。这主要是因为浏览器的资源占用会随着列表数目和行复杂度递增，网页文档中Dom的数据占用了内存和CPU渲染，导致滚动时会出现卡顿现象，特别是在一些中低端的移动设备。

## 如何在滚动中降低内存

在前端优化的方法中，有一个优化方式是Lazy Loading（延迟加载），原理是在只显示用户可视范围内的界面，例如将不加载非可视区域的Img，等到Img滚动到再进行加载。同样的原理，针对列表渲染，我们可以计算列表中某个区间的子列表可以显示在可视区域（Viewport），对于其他的区域，使用空白进行占位。

## 实现

实现的核心是计算可视区域的区间列表`{startIndex, endIndex}`：
1. 维护一份sizeList，记录列表各节点的{height, width, Y}
2. 列表节点使用固定的itemHeight作为第一次计算的高度；
3. 通过滚动scrollTop和Viewport的高度确定`{startIndex, endIndex}`

```javascript
scrollTop > itemHeight * startIndex && itemHeight * (startIndex + 1) > scrollTop;
(scrollTop + ViewportHeight) < itemHeight * endIndex && itemHeight * (startIndex - 1) < (scrollTop + ViewportHeight);
```
4. 渲染`{startIndex, endIndex}`区间的showList
5. 渲染完毕后记录showList各节点的{height, width, Y}，作为之后各计算的依据

### 计算过程中的小技巧

1. 第二次滚动基于第一次的`{startIndex, endIndex}`进行调整，不再需要从0开始重新计算，可以减少计算量;
2. 使用`window.requestAnimationFrame`合并scroll事件,使滚动的显示更加流畅。

基于上面的这些理论，这里实现了一个vue组件`fe-light-scroller`，可以直接向v-for那样简单地进行列表的渲染。