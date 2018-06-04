<template>
  <div class="pianhuaedit">
      <p class="title">渠道名称：{{name}}</p>
      <div class="display">
          <div class="trailer" v-for="(item,index) in videoList" :key="item.id">
              <div class="delete-pianhua"
                   @click="deletePianhua(item.id)">x</div>
              <p>{{item.name}}</p>
              <div class="video">
                  <video :src="item.paths[0]" 
                         controls="controls" 
                         preload="false"
                         :poster="item.poster"
                         style="background:black"></video>
              </div>
          </div>
      </div>
      <p class="title">增加片花</p>
      <el-row>
          <el-col :span="14">
              <el-col :span="16">
                  <div style="height:200px">
                      <video :src="videoURL" class="pianhua-video"
                         controls></video>
                  </div>
                   <div id="container2" class="upload">
                        <el-button type="warning" id="uploadPic2">上传片花</el-button>
                    </div>
              </el-col>
              <el-col :span="8">
                  <div style="height:200px;width:200px;margin-bottom:10px;">
                      <img :src="imgURL" alt="" class="pianhua-img">
                  </div>
                  <div id="container" class="upload">
                        <el-button type="warning" id="uploadPic">上传片花封面</el-button>
                    </div>
              </el-col>
          </el-col>
          <el-col :span="5">
              <el-form :model="form" label-width="40px" style="width:400px;">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="时长">
                    <el-input v-model="form.totalTime"></el-input>
                </el-form-item>
            </el-form>
          </el-col>
      </el-row> 
      <el-button type="primary" style="margin-top:30px;" @click="commit">提交</el-button>
  </div>
</template>

<script>
import { getTrailers } from '@/api/trailer';
import { postTrailers } from '@/api/trailer';
import { deleteTrailer } from '@/api/trailer';
import { getFilms } from '@/api/film';
import { getQiNiu2 } from '@/api/qiniu';
import { getQiNiu4 } from '@/api/qiniu';

export default {
    data() {
        return {
            id: '',
            name: '',
            videoList: [],
            form: {
                name: '',
                totalTime: ''
            },
            qiniu2Data: {
                domain: '',
                upToken: ''
            },
            qiniu4Data: {
                domain: '',
                upToken: ''
            },
            videoKey: [],
            imageKey: '',
            videoURL:'',
            imgURL:''
        };
    },
    created() {
        this.id = this.$route.query.id;
        this.name = this.$route.query.name;
        this._getTrailers();
        this._getQiNiu2();

        this.primaryDomain();
    },
    methods: {
        primaryDomain() {
            // let weburl = this.$route.path
            // console.log('all',weburl)
            // var urlReg=/(^\/)(\w+$)/;
            // let domain = weburl.match(urlReg);
            // let path = ((domain != null && domain.length>0)?domain[0]:"");
            // console.log('primaryDomain',domain)
        },
        commit() {
            let id = parseInt(this.id);
            let name = this.form.name;
            let total = parseInt(this.form.totalTime);
            let trailer = this.videoKey;
            let poster = this.iamgeKey;
            postTrailers(id, name, total, trailer, poster).then(res => {
                if(res.code == 0){
                    this.$message.success('片花提交成功');
                    this._getTrailers();
                }else{
                    this.$message.error(res.message);
                }
            });  
        },
        deletePianhua(id){
            deleteTrailer(id).then(res=>{
                this._getTrailers()
            })
        },
        _getTrailers() {
            getTrailers(this.id)
                .then(res => {
                    this.videoList = res.result;
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace({ path: '/login' });
                    }
                });
        },
        _getQiNiu2() {
            getQiNiu2()
                .then(res => {
                    this.qiniu2Data.domain = res.result.fileHost;
                    this.qiniu2Data.upToken = res.result.upToken;
                })
                .then(() => {
                    this.qiniu2();
                    this.qiniu4();
                });
        },
        // _getQiNiu4() {
        //     getQiNiu4()
        //         .then(res => {
        //             this.qiniu4Data.domain = res.result.fileHost;
        //             this.qiniu4Data.upToken = res.result.upToken;
        //         })
        //         .then(() => {
        //             this.qiniu4();
        //         });
        // },
        qiniu2() {
            getQiNiu2().then(res => {
                this.qiniu2Data.domain = res.result.fileHost;
                this.qiniu2Data.upToken = res.result.upToken;
            });
            let token2 = this.qiniu2Data.upToken;
            let domain2 = this.qiniu2Data.domain;
            var that = this;
            let option1 = {
                disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
                runtimes: 'html5,flash,html4', // 上传模式,依次退化
                browse_button: 'uploadPic', // 上传选择的点选按钮，**必需**
                uptoken: token2, // uptoken 是上传凭证，由其他程序生成
                get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的 uptoken
                domain: domain2, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
                container: 'container', // 上传区域 DOM ID，默认是 browser_button 的父元素，
                max_file_size: '100mb', // 最大文件体积限制
                flash_swf_url: 'path/of/plupload/Moxie.swf', //引入 flash,相对路径
                max_retries: 3, // 上传失败最大重试次数
                dragdrop: false, // 开启可拖曳上传
                //drop_element: 'container', // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', // 分块上传时，每块的体积
                auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                init: {
                    FilesAdded: function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    BeforeUpload: function(up, file) {
                        // 每个文件上传前,处理相关的事情
                        console.log('up', up);
                        console.log('file', file);
                    },
                    UploadProgress: function(up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    FileUploaded: function(up, file, info) {
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                        let domain = up.getOption('domain');
                        let obj = JSON.parse(info.response);
                        // document.getElementById(
                        //     "uploadPicList"
                        // ).innerHTML = `<p>${obj.key}</p>`;
                        // that.posterKey = obj.key;

                        let sourceLink = domain + obj.key;
                        // that.film.poster = sourceLink;
                        that.poster_key = obj.key;
                        that.posterKey = sourceLink;
                        that.imageKey = obj.key;
                        that.imgURL = sourceLink
                        that.$message.success(`上传成功  ${obj.key}`);
                    },
                    Error: function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    UploadComplete: function() {
                        //队列文件处理完毕后,处理相关的事情
                        console.log('success');
                    },
                    Key: function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效

                        var key = '';

                        var index1 = file.name.lastIndexOf('.');
                        var index2 = file.name.length;
                        var postf = file.name.substring(index1, index2); //后缀名
                        key = `image_${file.id}${postf}`;
                        return key;
                    }
                }
            };

            var uploader = Qiniu.uploader(option1);
        },
        qiniu4() {
            var Qiniu2 = new QiniuJsSDK();

            getQiNiu4().then(res => {
                this.qiniu4Data.domain = res.result.fileHost;
                this.qiniu4Data.upToken = res.result.upToken;
            });
            let token4 = this.qiniu2Data.upToken;
            let domain4 = this.qiniu2Data.domain;
            var that = this;
            let option2 = {
                disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
                runtimes: 'html5,flash,html4', // 上传模式,依次退化
                browse_button: 'uploadPic2', // 上传选择的点选按钮，**必需**
                uptoken: token4, // uptoken 是上传凭证，由其他程序生成
                get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的 uptoken
                domain: domain4, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
                container: 'container2', // 上传区域 DOM ID，默认是 browser_button 的父元素，
                max_file_size: '100mb', // 最大文件体积限制
                flash_swf_url: 'path/of/plupload/Moxie.swf', //引入 flash,相对路径
                max_retries: 3, // 上传失败最大重试次数
                dragdrop: false, // 开启可拖曳上传
                //drop_element: 'container', // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', // 分块上传时，每块的体积
                auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                init: {
                    FilesAdded: function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    BeforeUpload: function(up, file) {
                        // 每个文件上传前,处理相关的事情
                        console.log('up', up);
                        console.log('file', file);
                    },
                    UploadProgress: function(up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    FileUploaded: function(up, file, info) {
                        let domain = up.getOption('domain');
                        let obj = JSON.parse(info.response);
                        let sourceLink = domain + obj.key;
                        that.videoURL = sourceLink;
                        that.videoKey = that.videoKey.concat(obj.key);
                        that.$message.success(`上传成功  ${obj.key}`);
                    },
                    Error: function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    UploadComplete: function() {
                        //队列文件处理完毕后,处理相关的事情
                        console.log('success');
                    },
                    Key: function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效

                        var key = '';

                        var index1 = file.name.lastIndexOf('.');
                        var index2 = file.name.length;
                        var postf = file.name.substring(index1, index2); //后缀名
                        key = `video_trailer_${file.id}${postf}`;
                        return key;
                    }
                }
            };

            var uploader2 = Qiniu2.uploader(option2);
        }
    }
};
</script>

<style scoped lang="scss">
.pianhuaedit {
    padding: 40px;
    width: 1142px;
    .pianhua-video {
       
        width: 350px;
        max-height: 200px;
        margin-bottom:10px;
    }
    .pianhua-img {
       
        width: 150px;
        max-height: 200px;
        margin-bottom:10px;
    }
    .title {
        line-height: 40px;
        font-weight: bold;
    }
    .upload {
        float: left;
        margin-right: 10px;
    }
    .display {
        height: auto;
        width: 1142px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        overflow: auto;
        .trailer {
            height: 100%;
            width: 400px;
            margin-right: 20px;
            position: relative;
            .delete-pianhua{
                position: absolute;
                right: -2px;
                top:36px;
                z-index: 99;
                width:15px;
                height:15px;
                font-size:8px;
                color:white;
                background: #fa5555;
                border-radius:100%;
                text-align: center;
                line-height:13px;
            }
            p {
                line-height: 40px;
            }
            .video {
                width: 400px;
                height: auto;
                video {
                    width: 100%;
                    max-height: 300px;
                }
            }
        }
    }
}
</style>

