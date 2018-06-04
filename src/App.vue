<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import Home from "@/components/home/home"
    export default {
        components: {

        }
    }
</script>

<style lang="scss">
    @import "~@/assets/scss/reset.scss";
    body,html,#app{
        height:100%;
        overflow: hidden;
        font-family:"Hiragino Sans GB";
    }
    .el-menu{
        border-right:0;
    }
    .el-table{
        text-align: center;
        th{
            text-align: center;
        }
    }
</style>
