<template>
    <div class="edit">
        <div class="detail">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="poster">
                        <div v-if="!film.poster">暂无数据</div>
                        <img :src="film.poster" alt="">
                    </div>
                    <div id="container">
                        <el-button id="uploadPic" type="warning" class="poster-btn">上传海报</el-button>
                        <div id="uploadPicList"></div>
                    </div>
                </el-col>
                <el-col :span="20">
                    <el-col :span="8">
                        <el-input placeholder="请输入内容" v-model="name">
                            <template slot="prepend">名称</template>
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-input placeholder="请输入内容" v-model="recommend">
                            <template slot="prepend">推荐程度</template>
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-input placeholder="请输入内容" v-model="firstShow">
                            <template slot="prepend">首映时间</template>
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <el-col :span="6" class="label">状态：</el-col>
                            <el-col :span="18">
                                <el-select v-model="status" placeholder="请选择" class="select">
                                    <el-option
                                    v-for="item in options1"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <el-col :span="6" class="label" style="font-size:14px;">是否受赏：</el-col>
                            <el-col :span="18">
                                <el-select v-model="reward" placeholder="请选择" class="select">
                                    <el-option
                                    v-for="item in options2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        <el-input placeholder="请输入内容" v-model="totalTime">
                            <template slot="prepend">总时间</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" style="margin-top:10px;">
                        <el-col :span="2" class="label">演员：</el-col>
                        <el-col :span="6">
                            <el-autocomplete
                                class="inline-input"
                                v-model="actor"
                                :fetch-suggestions="querySearchActor"
                                placeholder="请输入演员姓名"
                                @select="handleSelectActor"
                            >
                                <template slot-scope="props">
                                    <div class="name">{{ props.item.name }}</div>
                                </template>
                            </el-autocomplete>
                        </el-col>
                        <el-col :span="3">
                            <el-button @click="deleteActor">删除</el-button>
                        </el-col>
                        <el-col :span="13">
                            <span class="label" v-for="item in actorNameList" :key="item">{{item}}、</span>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="2" class="label">导演：</el-col>
                        <el-col :span="6">
                            <el-autocomplete
                                class="inline-input"
                                v-model="director"
                                :fetch-suggestions="querySearchDirector"
                                placeholder="请输入导演姓名"
                                @select="handleSelectDirector"
                            >
                                <template slot-scope="props">
                                    <div class="name">{{ props.item.name }}</div>
                                </template>
                            </el-autocomplete>
                        </el-col>
                        <el-col :span="3">
                            <el-button @click="deleteDirector">删除</el-button>
                        </el-col>
                        <el-col :span="13">
                            <span class="label" v-for="item in directorNameList" :key="item">{{item}}、</span>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="2" class="label">风格：</el-col>
                        <el-col :span="6">
                            <el-autocomplete
                                class="inline-input"
                                v-model="style"
                                :fetch-suggestions="querySearchStyle"
                                placeholder="请输入风格"
                                @select="handleSelectStyle"
                            >
                                <template slot-scope="props">
                                    <div class="name">{{ props.item.name }}</div>
                                </template>
                            </el-autocomplete>
                        </el-col>
                        <el-col :span="3">
                            <el-button @click="deleteStyle">删除</el-button>
                        </el-col>
                        <el-col :span="13">
                            <span class="label" v-for="item in styleNameList" :key="item">{{item}}、</span>
                        </el-col>
                    </el-col>
                </el-col>
            </el-row>
        </div>
        

        <el-row class="pic" :gutter="20" style="padding-top:10px;border-top:1px solid #d8dce5;margin-bottom:20px;">
            <el-col :span="4" style="line-height:160px;">
                <div id="container2">
                    <el-button id="uploadPic2" type="warning">上传电影图片</el-button>
                    <div id="uploadPicList2"></div>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="film-img">
                        <div class="img-box">
                            <div v-if="!film.images">暂无数据</div>
                            <template v-for="img in film.images">
                                <img :src="img" alt="" :key="img">
                            </template>
                        </div>
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="20" style="padding:20px 0;border-top:1px solid #d8dce5;">
            <el-col :span="4" class="label" style="line-height:96px;">简介：</el-col>
            <el-col :span="20">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 10}"
                    placeholder="请输入内容"
                    v-model="introduction">
                </el-input>
            </el-col>
        </el-row>

        <el-row style="padding-top:20px;border-top:1px solid #d8dce5;">
            <el-col :span="4">
                <el-button type="primary" @click="commit">保存</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getFilm } from '@/api/edit';
import { editFilms } from '@/api/edit';
import { getActor } from '@/api/film';
import { getDirector } from '@/api/director';
import { getStyle } from '@/api/style';
import { getQiNiu2 } from '@/api/qiniu';
import { getQiNiu4 } from '@/api/qiniu';
import {addFilm} from '@/api/edit'

import md5 from 'js-md5';
import SparkMD5 from 'spark-md5';
import { filemd5 } from '@/api/qiniu';

export default {
    data() {
        return {
            qiniu2Data: {
                domain: '',
                upToken: ''
            },
            options: [
                {
                    value: '1',
                    label: '电影'
                },
                {
                    value: '2',
                    label: '电视'
                }
            ],
            value: '1',
            options1: [
                {
                    value: '1',
                    label: '即将上映'
                },
                {
                    value: '2',
                    label: '在播放'
                },
                {
                    value: '4',
                    label: '已下架'
                }
            ],
            status: '',
            options2: [
                {
                    value: true,
                    label: '接收打赏'
                },
                {
                    value: false,
                    label: '不接收打赏'
                }
            ],
            reward: true,
            name: '',
            recommend: '',
            firstShow: '',
            totalTime: '',
            actor: '',
            director: '',
            style: '',
            film: {},
            introduction: '',
            posterKey: '',
            actorList: [],
            directorList: [],
            styleList: [],
            actorNameList: [],
            directorNameList: [],
            styleNameList: [],
            actorIDList: [],
            directorIDList: [],
            styleIDList: [],
            imageList: []
        };
    },
    created() {
        this._getToken();
        this._getQiNiu2();
        //this._getQiNiu4();
        //this._getFilm();
        this._getActorList();
        this._getDirectorList();
        this._getStyleList();
    },
    mounted() {
        this.$nextTick(() => {});
    },
    methods: {
        commit() {
            let id = this.$route.params.id;
            let actorID = this.actorIDList;
            let directorID = this.directorIDList;
            let styleID = this.styleIDList;
            let type = this.value;
            let name = this.name;
            let recommend = this.recommend;
            let firstShow = this.firstShow;
            let status = this.status;
            let reward = this.reward;
            let totalTime = this.totalTime;
            let introduction = this.introduction;
            let images = this.imageList;
            let poster = this.posterKey;

            editFilms(
                id,
                actorID,
                directorID,
                styleID,
                type,
                name,
                recommend,
                firstShow,
                status,
                reward,
                totalTime,
                introduction,
                images,
                poster
            ).then(res => {
                console.log(res);
                this._getFilm();
            });
        },
        deleteActor() {
            this.actorNameList = [];
        },
        deleteDirector() {
            this.directorNameList = [];
        },
        deleteStyle() {
            this.styleNameList = [];
        },
        querySearchActor(queryString, cb) {
            var actors = this.actorList;
            var results = queryString
                ? actors.filter(this.createFilter(queryString))
                : actors;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleSelectActor(item) {
            this.actorNameList = this.actorNameList.concat(item.name);
            this.actorIDList = this.actorIDList.concat(item.id);
        },
        querySearchDirector(queryString, cb) {
            var actors = this.directorList;
            var results = queryString
                ? actors.filter(this.createFilter(queryString))
                : actors;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleSelectDirector(item) {
            this.directorNameList = this.directorNameList.concat(item.name);
            this.directorIDList = this.directorIDList.concat(item.id);
        },
        querySearchStyle(queryString, cb) {
            var actors = this.styleList;
            var results = queryString
                ? actors.filter(this.createFilter(queryString))
                : actors;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleSelectStyle(item) {
            this.styleNameList = this.styleNameList.concat(item.name);
            this.styleIDList = this.styleIDList.concat(item.id);
        },
        createFilter(queryString) {
            return actor => {
                return (
                    actor.name
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        handleClick(row) {
            this.styleData = this.styleData.concat(row.name);
            this.choiceForm.style = this.choiceForm.style.concat(row.id);
        },
        postFilm() {},
        acceptReward(type) {
            switch (type) {
                case true:
                    return '接受打赏';
                    break;
                case false:
                    return '不接受打赏';
                    break;
            }
        },
        submitFilm() {
            //this.choiceStyleID = this.form.style
            let id = this.$route.params.id;
            let actor = this.choiceActorID;
            let director = this.choiceDirectorID;
            let style = this.form.style;
            editFilms(id, actor, director, style).then(res => {
                console.log(res);
            });
        },
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
        },
        handleClick1(row) {
            this.choiceActorID.push(row.id);
            this.choiceActorName.push(row.name);
        },
        handleClick2(row) {
            this.choiceDirectorID.push(row.id);
            this.choiceDirectorName.push(row.name);
        },
        submitForm() {
            let id = this.$route.params.id;
        },
        uploadImg() {
            //this.qiniu()
        },
        _getActor() {
            getActor(this.search.actor).then(res => {
                this.choiceActorID.push(res.result.list[0].id);
                this.choiceActorName.push(res.result.list[0].name);
            });
        },
        _getDirector() {
            getDirector(this.search.director).then(res => {
                this.choiceDirectorID.push(res.result.list[0].id);
                this.choiceDirectorName.push(res.result.list[0].name);
            });
        },
        _getFilm() {
            let id = this.$route.params.id;
            getFilm(id)
                .then(res => {
                    this.film = res.result;
                    this.name = this.film.name;
                    this.recommend = this.film.rewardCount;
                    this.firstShow = this.film.firstShow;
                    this.status = this.film.filmStatus;
                    this.reward = this.film.acceptReward;
                    this.totalTime = this.film.totalTime;
                    this.type = this.film.type;
                    this.actorNameList = this.putName(
                        this.actorNameList,
                        this.film.actors
                    );
                    this.directorNameList = this.putName(
                        this.directorNameList,
                        this.film.directors
                    );
                    this.styleNameList = this.putName(
                        this.styleNameList,
                        this.film.styles
                    );
                    console.log(this.film);
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace('login');
                    }
                });
        },
        putName(list, item) {
            for (let i in item) {
                list = list.concat(item[i].name);
            }
            return list;
        },
        _filmStatus(type) {
            switch (type) {
                case 1:
                    return '即将上线';
                    break;
                case 2:
                    return '已上映';
                    break;
                case 3:
                    return '已下架';
            }
        },
        textOver(text) {
            if (text) {
                let w = text.substring(0, 50) + '...';
                return w;
            } else {
                return null;
            }
        },
        _getActorList() {
            getActor().then(res => {
                this.actorList = res.result.list;
            });
        },
        _getDirectorList() {
            getDirector().then(res => {
                this.directorList = res.result.list;
            });
        },
        _getStyleList() {
            getStyle().then(res => {
                this.styleList = res.result.list;
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
                    this.qiniu2();
                    //this.qiniu4();
                });
        },
        handleRemoveImg(file, fileList) {
            console.log(file, fileList);
        },
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

                        let obj = JSON.parse(info.response);
                        // document.getElementById(
                        //     "uploadPicList"
                        // ).innerHTML = `<p>${obj.key}</p>`;
                        // that.posterKey = obj.key;
                        that.posterKey = obj.key;
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
        md5(fileid) {
            document
                .getElementById(fileid)
                .addEventListener('change', function() {
                    var fileReader = new FileReader(),
                        box = document.getElementById('box'),
                        blobSlice =
                            File.prototype.mozSlice ||
                            File.prototype.webkitSlice ||
                            File.prototype.slice,
                        file = document.getElementById(fileid).files[0],
                        chunkSize = 2097152,
                        // read in chunks of 2MB
                        chunks = Math.ceil(file.size / chunkSize),
                        currentChunk = 0,
                        spark = new SparkMD5();

                    fileReader.onload = function(e) {
                        //console.log("read chunk nr", currentChunk + 1, "of", chunks);
                        spark.appendBinary(e.target.result); // append binary string
                        currentChunk++;

                        if (currentChunk < chunks) {
                            loadNext();
                        } else {
                            //console.log("finished loading");
                            box.innerText = 'MD5 hash:' + spark.end();
                            //console.info("computed hash", spark.end()); // compute hash
                            this.filemd5 = spark.end();
                            //console.log(this.filemd5)
                        }
                    };
                    function loadNext() {
                        var start = currentChunk * chunkSize,
                            end =
                                start + chunkSize >= file.size
                                    ? file.size
                                    : start + chunkSize;

                        fileReader.readAsBinaryString(
                            blobSlice.call(file, start, end)
                        );
                    }
                    loadNext();
                });
        }
    }
};
</script>

<style scoped lang="scss">
.edit {
    padding: 40px;
    margin-bottom: 50px;
    width: 1142px;
    .label {
        line-height: 40px;
        text-align: center;
    }
    .poster {
        height: 200px;
        background: yellow;
        margin: 10px 0;
    }
    .poster-btn {
        width: 100%;
    }
    .detail {
        .el-col {
            margin-bottom: 10px;
        }
        .el-select {
            display: block;
        }
        .poster {
            img {
                width: 100%;
                max-height: 200px;
            }
        }
    }
    .pic {
        .film-img {
            .img-box {
                padding-top: 14px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                overflow: auto;
                img {
                    width: 200px;
                    max-height: 140px;
                    margin-right: 5px;
                }
            }
        }
    }
}
</style>