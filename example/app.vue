<template>
    <div>
        <router-view/>
        <ul class="page-navigater">
            <li><router-link to="/">固定高度</router-link></li>
            <li><router-link to="/dynamic">动态高度</router-link></li>
            <li><router-link to="/lazydynamic">异步加载</router-link></li>
            <li><router-link to="/fixheightdiv">容器滚动</router-link></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>
<style lang="scss">
html, body {
    padding: 0;
    margin: 0;
}
.page-navigater {
    position: fixed;
    top: 0;
    left: 0;
    background: #8f8f8f;
    opacity: .6;
    padding: 0;
    margin: 0;
}
.m-option-bar {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #8f8f8f;
}
.item-box {
    height: 50px;
    box-sizing: border-box;
    border-bottom: 1px solid chocolate;
}
</style>
