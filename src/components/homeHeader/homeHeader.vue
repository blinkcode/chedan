<template>
    <el-row :gutter="10" type="flex">
        <el-col :span="10">
            
        </el-col>

        <el-col :span="14">
            <div class="exit">
                <el-button size="small" round @click="exit">退出登录</el-button>
            </div>
            <div class="name">{{name}}</div>
            <div class="img">
                <img :src="img" alt="">
            </div>

        </el-col>
    </el-row>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
            name: '',
            img: ''
        };
    },
    created() {
        this.getUser();
    },
    methods: {
        getUser() {
            this.name = localStorage.getItem('chedan_name');
            this.img = localStorage.getItem('touxiang');
        },
        exit() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('chedan_name');
            localStorage.removeItem('touxiang');
            this.$router.replace({path:'/login'});
        },
        addFilm() {
            this.$router.replace('edit');
        }
    }
};
</script>

<style scoped lang="scss">
.el-row {
    justify-content: space-between;
}
.name,
.img,
.exit {
    float: right;
    width: 40px;
    line-height: 40px;
    height: 40px;
}
.img {
    border-radius: 50%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
}
.name {
    margin: 0 10px;
    width: auto;
}
.exit {
    margin-right: 30px;
    margin-left: 10px;
}
.title {
    margin-right: 20px;
}
</style>