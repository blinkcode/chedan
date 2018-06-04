<template>
    <div>
        <el-row class="header">
            <el-col :span="24">
                <img src="../../assets/img/logo.png" alt="">
            </el-col>
        </el-row>
        <el-menu
                :default-active="currentIndex"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                @select="handleSelect"
                background-color="#30333A"
                text-color="#fff"
                active-text-color="#ffd04b"
                :router="true"
                >
            <el-menu-item index="/film">
                <i class="el-icon-menu"></i>
                <span slot="title">电影</span>
            </el-menu-item>
            <el-menu-item index="/style">
                <i class="el-icon-menu"></i>
                <span slot="title">风格</span>
            </el-menu-item>
            <el-menu-item index="/pianhua">
                <i class="el-icon-menu"></i>
                <span slot="title">片花</span>
            </el-menu-item>
            <el-menu-item index="/comment">
                <i class="el-icon-menu"></i>
                <span slot="title">评论</span>
            </el-menu-item>
            <el-menu-item index="/actor">
                <i class="el-icon-menu"></i>
                <span slot="title">演员</span>
            </el-menu-item>
            <el-menu-item index="/director">
                <i class="el-icon-menu"></i>
                <span slot="title">导演</span>
            </el-menu-item>
            <el-menu-item index="/package">
                <i class="el-icon-menu"></i>
                <span slot="title">安装包</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return{
                isCollapse:true,
                index:'',
            }
        },
        created() {
           
        },
        methods: {
            handleOpen(key, keyPath) {
                // this.currentIndex = key
            },
            handleClose(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleSelect(key,keyPath){

                this.index = key
            },
        },
        computed:{
            currentIndex(){
                let weburl = this.$route.path
                var urlReg=/\/[a-zA-Z]+/; 
                let domain = weburl.match(urlReg);
                return domain[0];
            }
        },
    }
</script>

<style scoped lang="scss">
    .header{
        height:70px;
        vertical-align: center;
        text-align: center;
        img{
            width:100px;
            height:auto;
            margin:0 auto;
            margin-top:20px;
        }
        p,i{
            line-height:70px;
            text-align: center;
            color:#ffd04b;
        }
        p{
            font-size:16px;
        }
    }

</style>