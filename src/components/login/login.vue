<template>
    <div class="login">
        <div class="header">
            <div class="left">
                <img src="./logo-text.png" alt="">
            </div>
            <div class="right">扯弹app，弹幕社交第一平台</div>
        </div>
        <div class="login-box">
            <el-form ref="form" :model="form" label-width="0">
                <h3 class="title" style="font-weight:bold;">扯弹后台管理系统</h3>
                <el-form-item>
                    <el-input v-model="form.name" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item style="width:100%">
                    <el-button 
                    style="width:100%;margin-top:20px;background:linear-gradient(to right, #ff8c61, #fe4c91);color:white;"
                            @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { getToken } from "@/api/login";

export default {
    data() {
        return {
            form: {
                name: "",
                password: ""
            }
        };
    },
    methods: {
        onSubmit() {
            getToken(this.form.name, this.form.password).then(res => {
                if (res.code == 0) {
                    let accessToken = res.result.accessToken;
                    let refreshToken = res.result.refreshToken;
                    let touxiang = res.result.user.background;
                    let chedan_name = res.result.user.name;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("touxiang", touxiang);
                    localStorage.setItem("chedan_name", chedan_name);

                    this._loginSuccess();
                    this._goHome();
                } else {
                    this.$message.error("用户名或密码错误");
                }
            });
        },
        _goHome() {
            this.$router.push("home");
        },
        _loginSuccess() {
            this.$message.success("登录成功");
        }
    }
};
</script>

<style lang="scss" scoped>
.login {
    position:relative;
    height:100%;
    .header{
        height:95px;
        background:linear-gradient(to right, #ff8c61, #fe4c91);
        display: flex;
        flex-flow:row nowrap;
        justify-content: space-between;
        align-items: center;
        .left{
            width:125px;
            height: 57px;
            margin-left:40px;
            img{
                width:100%;
                height:100%;
            }
        }
        .right{
            margin-right:40px;
            color:white;
        }
    }
    .login-box {
        width: 350px;
        height: 350px;
        margin: auto;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        padding: 40px;
        border: 1px solid #eaeaea;
        border-radius: 5px;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            text-align: center;
            margin-bottom: 40px;
        }
    }
}
</style>