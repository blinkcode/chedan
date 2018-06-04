<template>
  <div class="packageEdit">
      <p class="title">添加/编辑安装包信息</p>
      <el-row :gutter="20">
          <el-col :span="3">
              <div class="left">版本号：</div>
              <div class="left">版本名称：</div>
              <div class="left">
                  <div id="packageContainer">
                      <el-button type="warning" id="uploadPackage">上传安装包</el-button>
                  </div>
              </div>
              <div class="left">版本介绍：</div>
          </el-col>
          <el-col :span="10">
              <div class="right">
                  <el-input placeholder="请输入内容" v-model="packageDetail.versionCode"></el-input>
              </div>
              <div class="right">
                  <el-input placeholder="请输入内容" v-model="packageDetail.versionName"></el-input>
              </div>
              <div class="right">
                  <div class="upload-path">{{packageDetail.path}}</div>
              </div>
              <div class="right intro">
                  <el-input placeholder="请输入内容"
                            type="textarea"
                            v-model="packageDetail.introduction"
                            :rows="6"></el-input>
              </div>
          </el-col>
      </el-row>
      <el-row>
          <el-col :span="3" :offset="3">
              <el-button type="primary" @click="editPackage">保存</el-button>
          </el-col>
          <el-col :span="3" :offset="4">
              <el-button type="danger" @click="_deletePackage"
              style="position:relative;left:20px;">删除安装包</el-button>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import { getPackageByID } from '@/api/package';
import { commitPackage } from '@/api/package';
import { editPackage } from '@/api/package';
import { deletePackage } from '@/api/package';
import { getQiNiu2 } from '@/api/qiniu';

export default {
    data() {
        return {
            id: 0,
            packageDetail: {
                versionName: '',
                versionCode: 0,
                path: '',
                id: 0,
                production: ''
            },
            uploadPath: '',
            qiniu2Data: {
                upToken: '',
                domain: ''
            }
        };
    },
    created() {
        this.id = this.$route.params.id;
        if (this.id) {
            this._getPackageByID();
        }

        this._getQiNiu2();
    },
    methods: {
        editPackage() {
            let vname = this.packageDetail.versionName;
            let vcode = parseInt(this.packageDetail.versionCode);
            let introduction = this.packageDetail.introduction;
            let path = this.packageDetail.path;
            if(!this.id){
                commitPackage(vname, vcode, introduction, path).then(res => {
                    if(res.code == 0){
                        this.$message.success('成功添加安装包')
                        this.id = res.result.id
                        this._getPackageByID()
                    }else{
                        this.$message.error(res.message)
                    }
                });
            }else{
                editPackage(this.id,vname, vcode, introduction, path).then(res => {
                    if(res.code == 0){
                        this.$message.success('成功修改安装包')
                        this.id = res.result.id
                        this._getPackageByID()
                    }else{
                        this.$message.error(res.message)
                    }
                });
            }

            
        },
        _deletePackage() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    deletePackage(this.id).then(res=>{
                        this.$router.replace({path:'/package'})
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                    
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        _getPackageByID() {
            getPackageByID(this.id).then(res => {
                this.packageDetail = res.result;
            });
        },
        _getQiNiu2() {
            getQiNiu2()
                .then(res => {
                    this.qiniu2Data.domain = res.result.fileHost;
                    this.qiniu2Data.upToken = res.result.upToken;
                })
                .then(() => {
                    this.qiniu();
                });
        },
        qiniu() {
            getQiNiu2().then(res => {
                this.qiniu2Data.domain = res.result.fileHost;
                this.qiniu2Data.upToken = res.result.upToken;
            });
            let token = this.qiniu2Data.upToken;
            let domain = this.qiniu2Data.domain;
            var that = this;
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4', // 上传模式，依次退化
                browse_button: 'uploadPackage', // 上传选择的点选按钮，必需
                // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                uptoken: token, // uptoken是上传凭证，由其他程序生成
                // uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                // uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
                //    // do something
                //    return uptoken;
                // },
                get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                //unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: domain, // bucket域名，下载资源时用到，必需
                container: 'packageContainer', // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '100mb', // 最大文件体积限制
                flash_swf_url: 'path/of/plupload/Moxie.swf', //引入flash，相对路径
                max_retries: 3, // 上传失败最大重试次数
                dragdrop: true, // 开启可拖曳上传
                drop_element: 'packageContainer', // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', // 分块上传时，每块的体积
                auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                //x_vars : {
                //    查看自定义变量
                //    'time' : function(up,file) {
                //        var time = (new Date()).getTime();
                // do something with 'time'
                //        return time;
                //    },
                //    'size' : function(up,file) {
                //        var size = file.size;
                // do something with 'size'
                //        return size;
                //    }
                //},
                init: {
                    FilesAdded: function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后，处理相关的事情
                        });
                    },
                    BeforeUpload: function(up, file) {
                        // 每个文件上传前，处理相关的事情
                    },
                    UploadProgress: function(up, file) {
                        // 每个文件上传时，处理相关的事情
                    },
                    FileUploaded: function(up, file, info) {
                        // 每个文件上传成功后，处理相关的事情
                        // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 查看简单反馈
                        // var domain = up.getOption('domain');
                        // var res = parseJSON(info.response);
                        // var sourceLink = domain +"/"+ res.key; 获取上传成功后的文件的Url
                        let obj = JSON.parse(info.response);
                        //that.packageDetail.versionName = obj.key
                        //let vcode = Number(that.form.VersionCode);
                        //let introduction = that.form.Introduction;
                        that.packageDetail.path = obj.key;
                        console.log('success', info.response);
                        that.uploadPath = obj.key;
                        //that._commitPackage(vname, vcode, introduction, path);
                    },
                    Error: function(up, err, errTip) {
                        //上传出错时，处理相关的事情
                    },
                    UploadComplete: function() {
                        //队列文件处理完毕后，处理相关的事情
                    },
                    Key: function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在unique_names: false，save_key: false时才生效
                        var key = '';
                        let packageName = that.packageDetail.versionName;
                        key = `package_${packageName}.apk`;
                        return key;
                    }
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
.packageEdit {
    padding: 40px 40px 40px;
    .upload-path {
        line-height: 50px;
    }
    .title {
        padding-bottom: 20px;
        font-weight: bold;
        font-size: 18px;
    }
    .left {
        margin: 8px 0;
        height: 50px;
        line-height: 50px;
        text-align: right;
    }
    .right {
        margin: 8px 0;
        height: 50px;
    }
    .intro {
        height: 150px;
    }
}
</style>

