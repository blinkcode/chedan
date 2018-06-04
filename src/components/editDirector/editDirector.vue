<template>
    <div class="editdirector">
        <el-row>
            <el-col :span="4">
                <p class="title">编辑导演信息</p>
                    <div class="touxiang">
                        <p style="line-height:200px;text-align:center;">暂无数据</p>
                        <img :src="actor.header" alt="">
                    </div>
                <div id="container" style="margin-bottom:10px;">
                    <el-button id="uploadPic" type="warning">点击上传导演头像</el-button>
                </div>
                <el-button type="primary" @click="commit" style="width:150px;">提交信息</el-button>
            </el-col>
            <el-col :span="8">
                <el-form :model="form" label-width="80px" style="padding-top:37px;">
                    <el-form-item label="导演名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="导演介绍">
                        <el-input type="textarea" v-model="form.introduction"
                                  :rows="4"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getQiNiu2 } from "@/api/qiniu";
import { editDirector } from "@/api/director";
import { addDirector } from "@/api/director";
import {getDirectorByID} from "@/api/director"

export default {
    data() {
        return {
            name:"",
            actor:{},
            qiniu2Data: {
                upToken: "",
                domain: ""
            },
            header: "",
            form: {
                name: "",
                introduction: ""
            },
            idArray: []
        };
    },
    created() {
        this.id = this.$route.params.id
        this._getQiNiu2();
        this._getDirector()
    },
    methods: {
        commit() {
            let id = this.$route.params.id;
            this.idArray = this.idArray.concat(id);
            let idArray = this.idArray;
            let headerKey = this.actor.header;
            let introduction = this.form.introduction;
            let name = this.form.name;

            if(!this.id){
                addDirector(headerKey, introduction, name).then(res => {
                    if (res.code == 0) {
                        this.$message.success("演员信息更新(添加)成功");
                        this.actor = res.result
                        this.form.name = this.actor.name
                        this.form.introduction = this.actor.introduction
                    } else {
                        this.$message.error("演员信息更新(添加)失败");
                    }
                });
            }else{
                editDirector(id, headerKey, introduction, name).then(res => {
                    if (res.code == 0) {
                        this.$message.success("演员信息更新(添加)成功");
                        this.actor = res.result
                        this.form.name = this.actor.name
                        this.form.introduction = this.actor.introduction
                    } else {
                        this.$message.error("演员信息更新(添加)失败");
                    }
                });
            }
        },
        _getDirector(){
            if(this.id){
                getDirectorByID(this.id).then(res =>{
                    this.actor = res.result
                    this.form.name = this.actor.name
                    this.form.introduction = this.actor.introduction
                })
            }  
        },
        _getQiNiu2() {
            getQiNiu2()
                .then(res => {
                    this.qiniu2Data.domain = res.result.fileHost;
                    this.qiniu2Data.upToken = res.result.upToken;
                })
                .then(() => {
                    this.qiniu2();
                }).catch(err =>{
                    if (err.response.status == 401) {
                        this.$router.replace({path:'/login'});
                    }
                });
        },
        qiniu2() {
            let token2 = this.qiniu2Data.upToken;
            let domain2 = this.qiniu2Data.domain;
            var that = this;
            let option1 = {
                disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
                runtimes: "html5,flash,html4", // 上传模式,依次退化
                browse_button: "uploadPic", // 上传选择的点选按钮，**必需**
                uptoken: token2, // uptoken 是上传凭证，由其他程序生成
                get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的 uptoken
                domain: domain2, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
                container: "container", // 上传区域 DOM ID，默认是 browser_button 的父元素，
                max_file_size: "100mb", // 最大文件体积限制
                flash_swf_url: "path/of/plupload/Moxie.swf", //引入 flash,相对路径
                max_retries: 3, // 上传失败最大重试次数
                dragdrop: false, // 开启可拖曳上传
                //drop_element: 'container', // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
                chunk_size: "4mb", // 分块上传时，每块的体积
                auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                init: {
                    FilesAdded: function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    BeforeUpload: function(up, file) {
                        // 每个文件上传前,处理相关的事情
                        console.log("up", up);
                        console.log("file", file);
                    },
                    UploadProgress: function(up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    FileUploaded: function(up, file, info) {
                        
                        let domain = up.getOption('domain');
       
                        let obj = JSON.parse(info.response);

                        let sourceLink = domain +'/' + obj.key; 
                        that.actor.header = sourceLink
                       
                        //that.choiceImages = that.choiceImages.concat(obj.key)
                        that.$message.success("上传成功");
                        that.header = obj.key;
                    },
                    Error: function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                        that.$message.success("上传失败");
                    },
                    UploadComplete: function() {
                        //队列文件处理完毕后,处理相关的事情
                        console.log("success");
                    },
                    Key: function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效

                        var key = "";

                        var index1 = file.name.lastIndexOf(".");
                        var index2 = file.name.length;
                        var postf = file.name.substring(index1, index2); //后缀名
                        key = `image_${file.id}${postf}`;
                        return key;
                    }
                }
            };
            var uploader = Qiniu.uploader(option1);
        }
    }
};
</script>

<style scoped lang="scss">
.editdirector {
    padding: 40px 40px 0;
    margin-bottom: 20px;
    .actor-name{
        margin-bottom:20px;
        font-weight:bold;
        text-align:center;
        display: block;
        width:150px;
    }
    .touxiang{
        height: 200px;
        width:150px;
        background:yellow;
        margin:20px 0;
        position: relative;
        img{
            width:100%;
            max-height:200px;
            position: absolute;
            left: 0;
            top:0;
            overflow:hidden;
        }
    }
    .title {
        font-weight: bold;
        text-align:center;
        display:block;
        width:150px;
    }
}
.bottom20 {
    margin-bottom: 20px;
}
</style>

