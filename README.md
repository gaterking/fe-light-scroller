# FE-LIGHT-SCROLLER

[fe-light-scroller] 是一个独立的Vue组件，用于优化大列表的显示性能。

## 原理

v-for 能够渲染页面列表，但如果列表数据超大，会产生庞大的dom，对浏览器的渲染压力非常大。fe-light-scroller通过对屏幕或容器的现实区域进行计算，只渲染可视范围的列表节点，使浏览器dom数量大大减少，从而加快浏览器性能。
对于非固定高度的列表，通过动态计算节点的高度进行计算，适用于固定高度、动态高度等多种场景。

## Demo

```shell
npm install
npm run dev
```

[http://localhost:8080/index.htm](http://localhost:8080/index.htm)
具体代码参考[/example](/example)

## 安装

```shell
npm i fe-light-scroller -S
```

## 使用

Import all components.

```javascript
import FeLightScroller from 'fe-light-scroller';
```

```html
<fe-light-scroller
    :list="lightScrollerData.list"
    :item-height="lightScrollerData.itemHeight"
    :dynamic-item-height="false"
    :visible-height="screenHeight">
    <!-- content goes here. e.g.
    <div
        v-if="props.item"
        slot-scope="props"
        class="item-box">{{props.item.item.value }}
    </div>
    -->
</fe-light-scroller>
```

## API

### component attributes

| 属性名称 | 描述 | Required | 默认值 |
|-----|-----|-----|-----|
| list | 所有的列表数据Array< Object > | Y | - |
| item-height | 每行节点高度 Number | Y | - |
| visible-height | 可是范围高度 Number，屏幕高度或容器高度 | Y | true |
| box-id | 外层容器id String, 如果是在div容器里滚动，需要传递div的id | N | false |

## RoadRoadmap

### 1.0 实现垂直方向屏幕滚动和容器滚动

### next version

1. 实现水平方向滚动
2. 实现垂直 + 水平方向滚动
