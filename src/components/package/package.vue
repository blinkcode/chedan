<template>
    <div class="package">
        <el-row>
            <el-col :span="3">
                <el-button @click="_addPackage" type="primary">添加安装包</el-button>
            </el-col>
            <el-col :span="3">
                  <el-select v-model="value" placeholder="请选择" @change="changeSelect">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <div class="package-item" v-for="item in packageList" :key="item.id">
            
             <el-row>
                <el-col :span="8">
                    <el-form label-width="80px">
                        <el-form-item label="版本号:">
                            <p>{{item.versionCode}}</p>
                        </el-form-item>
                        <el-form-item label="版本名称:">
                            <p>{{item.versionName}}</p>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" style="padding:8px 0">
                        <el-button @click="download(item.path)">点击下载</el-button>
                        <el-button type="warning" @click="editPackage(item.id)">编辑</el-button>
                    </el-form>
                </el-col>
                <el-col :span="8">
                    <el-input
                    type="textarea"
                    :rows="6"
                    placeholder="请输入内容"
                    v-model="item.introduction"
                    style="margin-top:20px">
                    </el-input>
                </el-col>
            </el-row>
        </div>
       <pagination :page="packagePage" :total-page="totalPage" @pageChange="pageChange"
                    v-if="havePage"></pagination>
    </div>
</template>

<script>
import pagination from '@/components/pagination/pagination';
import { getPackage } from '@/api/package';
import { commitPackage } from '@/api/package';
import { deletePackage } from '@/api/package';
import { getQiNiu2 } from '@/api/qiniu';

export default {
    data() {
        return {
            packageList: [],
            form: {
                VersionName: '',
                VersionCode: '',
                Introduction: ''
            },
            fileList: [],
            dialogTableVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            qiniu2Data: {
                upToken: '',
                domain: ''
            },
            havePage: false,
            totalPage: 0,
            packagePage: 1,
            options: [
                {
                    value: 1,
                    label: '顺序'
                },
                {
                    value: 2,
                    label: '逆序'
                }
            ],
            value: 2
        };
    },
    created() {
        this._getPackage();
        this._getToken();
        // this._getQiNiu2();
    },
    computed: {
        pac_name: function() {
            return this.form.VersionName;
        }
    },
    methods: {
        _addPackage() {
            this.$router.push({ path: '/packageEdit' });
        },
        changeSelect(){
            this._getPackage()
        },
        editPackage(id) {
            this.$router.push({
                path: `/packageEdit/${id}`,
                params: { id: id }
            });
        },
        addPackageItem() {
            this.dialogFormVisible = true;
        },
        download(path) {
            window.location.href = path;
        },
        pageChange(e) {
            this.packagePage = e;
            this._getPackage();
        },
        _deletePackage(id, data) {
            deletePackage(id)
                .then(res => {
                    console.log(res);
                })
                .then(() => {
                    getPackage().then(res => {
                        this.packageList = res.result.list;
                    });
                });
        },
        _getPackage() {
            if(this.value == 1){
                getPackage(this.packagePage)
                .then(res => {
                    this.packageList = res.result.list;
                    this.totalPage = res.result.totalPages;
                    this.havePage = true;
                    console.log(this.packageList);
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace({ path: '/login' });
                    }
                });
            }else if(this.value == 2){
                let order = '-Id'
                getPackage(this.packagePage,order)
                .then(res => {
                    this.packageList = res.result.list;
                    this.totalPage = res.result.totalPages;
                    this.havePage = true;
                    console.log(this.packageList);
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace({ path: '/login' });
                    }
                });
            }
            
        },
        _commitPackage(vname, vcode, introduction, path) {
            commitPackage(vname, vcode, introduction, path)
                .then(res => {
                    console.log(res);
                    if (res.code != 0) {
                        this.$message.error(`上传错误：${res.message}`);
                    } else {
                        this.$message.success(`上传成功`);
                    }
                })
                .then(res => {
                    getPackage().then(res => {
                        this.packageList = res.result.list;
                    });
                });
        },
        _getToken() {
            this.token = localStorage.getItem('accessToken');
        },
        _getQiNiu2() {
            getQiNiu2()
                .then(res => {
                    this.qiniu2Data.domain = res.result.fileHost;
                    this.qiniu2Data.upToken = res.result.upToken;
                })
                .then(() => {
                    // this.qiniu();
                });
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length +
                    fileList.length} 个文件`
            );
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
                        let vname = obj.key;
                        let vcode = Number(that.form.VersionCode);
                        let introduction = that.form.Introduction;
                        let path = obj.path;
                        console.log('success', info.response);

                        that._commitPackage(vname, vcode, introduction, path);
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
                        let packageName = that.form.VersionName;
                        key = packageName;
                        return key;
                    }
                }
            });
        }
    },
    components: {
        pagination
    }
};
</script>

<style scoped lang="scss">
.package {
    padding: 40px 40px 60px;
    margin-bottom: 40px;
    .input {
        width: 400px;
    }
    .add {
        margin-bottom: 30px;
    }
    .package-item {
        box-sizing: border-box;
        width: 100%;
        height: 180px;
        padding: 0 0 20px;
        border-bottom: 1px solid #d8dce5;
    }
}

.el-table {
    margin-bottom: 50px;
}
.el-form-item {
    margin-bottom: 0;
    padding: 8px 0;
}
</style>