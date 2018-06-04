<template>
    <div class="pianhua">
        <div class="header">
            <el-row>
                <el-col :span="5">
                    <el-autocomplete
                    popper-class="my-autocomplete"
                    class="inline-input"
                    v-model="state1"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect"
                    @change="searchChange"
                    style="margin-left:32px;"
                    >
                        <template slot-scope="props">
                            <div class="name">{{ props.item.name }}</div>
                        </template>
                    </el-autocomplete>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="_getFilms"
                    style="position:relative;left:-10px;">搜索电影</el-button>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="channelValue" placeholder="渠道类型" @change="filmChannel" 
                               style="margin:0 10px;">
                        <el-option
                        v-for="item in options3"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="orderValue" placeholder="渠道类型" @change="orderChange" 
                    style="margin: 0 10px;">
                        <el-option
                        v-for="item in options4"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>

            <el-dialog title="填写片花信息" :visible.sync="dialogFormVisible">
                <el-form :model="form1">
                    <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="form1.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="总时长" :label-width="formLabelWidth">
                        <el-input v-model="form1.total" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="commit()">确 定</el-button>
                </div>
            </el-dialog>

        </div>

        <div class="content">
            <template v-if="!showDetail">
                <el-row :gutter="20">
                    <el-col :span="6" class="p-row" style="border:0;font-weight:bold;white-space:nowrap;">
                        <el-col :span="19">电影名</el-col>
                        <el-col :span="5" style="padding-right:0">操作</el-col>
                    </el-col>
                     <el-col :span="6" class="p-row" style="border:0;font-weight:bold;white-space:nowrap;">
                        <el-col :span="19">电影名</el-col>
                        <el-col :span="5" style="padding-right:0">操作</el-col>
                    </el-col>
                     <el-col :span="6" class="p-row" style="border:0;font-weight:bold;white-space:nowrap;">
                        <el-col :span="19">电影名</el-col>
                        <el-col :span="5" style="padding-right:0">操作</el-col>
                    </el-col>
                     <el-col :span="6" class="p-row" style="border:0;font-weight:bold;white-space:nowrap;">
                        <el-col :span="19">电影名</el-col>
                        <el-col :span="5" style="padding-right:0">操作</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="item in trailerList" :key="item.id" class="p-row">
                        <el-col :span="19">
                            <p style="white-space:nowrap">{{item.name}}</p>
                        </el-col>
                        <el-col :span="5">
                            <el-button
                                    size="mini"
                                    @click="goDetail(item.id,item.name)">查看</el-button>
                        </el-col>
                    </el-col>
                </el-row>
            </template>
            <div class="detail">
                <template v-if="showDetail">
                    <el-row>
                        <el-col :span="4">名称：{{trailer.name}}</el-col>
                        <el-col :span="6">总时长：{{secondToDate(trailer.totalTime)}}</el-col>
                        <el-col :span="4">创建时间：{{trailer.firstShow}}</el-col>
                    </el-row>
                    <el-row style="margin:20px 0;">
                        <el-col :span="6">
                            <img :src="trailer.poster" alt="">
                        </el-col>

                    </el-row>
                    <el-row :gutter="20" style="line-height:150px;">
                        <template v-for="item in videoList">
                            <el-col :span="6" style="height:150px;">
                                <video class="video" :src="item.paths[0]" controls="controls"></video>
                            </el-col>
                        </template>
                    </el-row>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import pagination from "@/components/pagination/pagination";
import { getTrailers } from "@/api/trailer";
import { postTrailers } from "@/api/trailer";
import { getFilms } from "@/api/film";
import { getQiNiu4 } from "@/api/qiniu";

export default {
    data() {
        return {
            form1: {
                name: "",
                total: ""
            },
            trailerList: [],
            trailer: {},
            showDetail: false,
            videoList: [],
            qiniu4Data: {
                upToken: "",
                domain: ""
            },
            channelID: 0,
            restaurants: [],
            state1: "",
            state2: "",
            dialogFormVisible: false,
            formLabelWidth: "100px",
            options3: [
                {
                    value: "1",
                    label: "电影"
                },
                {
                    value: "2",
                    label: "电视"
                }
            ],
            channelValue: "1",
            options4: [
                {
                    value: 1,
                    label: "顺序"
                },
                {
                    value: 2,
                    label: "逆序"
                }
            ],
            orderValue:1
        };
    },
    created() {
        //this._getTrailers()
        this._getFilms();
        // this._getQiNiu4();
    },
    mounted() {
        this.$nextTick(() => {
            this.loadAll();
        });
    },
    methods: {
        commit() {
            dialogFormVisible = false;
            postTrailers().then(res => {
                console.log(res);
            });
        },
        filmChannel(){
            this._getFilms()
        },
        orderChange(){
            this._getFilms()
        },
        querySearchAsync(queryString, cb) {
            getFilms(this.state1).then(res=>{
                var restaurants = res.result.list;
                var results = queryString
                    ? restaurants.filter(this.createFilter(queryString))
                    : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            })

            // var restaurants = this.restaurants;
            // var results = queryString
            //     ? restaurants.filter(this.createFilter(queryString))
            //     : restaurants;
            // // 调用 callback 返回建议列表的数据
            // cb(results);
        },
        createFilter(queryString) {
            return restaurant => {
                return (
                    restaurant.name
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        handleSelect(item) {
            this.state1 = item.name;
            this.goDetail(item.id,item.name)
        },
        searchChange(e){
            this.loadAll(this.state1)
        },
        loadAll(state1) {
            getFilms(state1).then(res => {
                this.restaurants = res.result.list;
                
            });
        },
        onSubmit() {
            let name = this.form.name;
            getFilms(name).then(res => {
                this.trailerList = res.result.list;
            });
        },
        handleEdit(scope, row) {
            //console.log(row)
            this.showDetail = !this.showDetail;

            this.trailer = row;
            this.channelID = row.id;
            let id = row.id;
            //console.log(this.trailer)
            this._getTrailers(id);
        },
        goDetail(id, name) {
            this.showDetail = !this.showDetail;
            //this.$router.push({path:`/pianhua/${id}`})
            this.$router.push({
                path: `/pianhua/${id}`,
                query: { id: id, name: name }
            });
            //this._getTrailers(id);
        },
        secondToDate(result) {
            var h = Math.floor(result / 3600);
            var m = Math.floor((result / 60) % 60);
            var s = Math.floor(result % 60);
            return (result = h + "小时" + m + "分钟" + s + "秒");
        },
        _getTrailers(id) {
            getTrailers(id)
                .then(res => {
                    this.videoList = res.result;
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace({path:'/login'});
                    }
                });
        },
        _getFilms() {
            let page,order = undefined
            let type = this.channelValue
            let status = 3
            let amount = 1
            let size = 60
            if(this.orderValue == 1){
                order = undefined
            }else if(this.orderValue == 2){
                order = '-Id'
            }

            getFilms(this.state1,page, status, order, type,amount,size).then(res => {
                this.trailerList = res.result.list;
            });
        },
    },
    components: {
        pagination
    }
};
</script>

<style scoped lang="scss">
.pianhua {
    padding: 40px 40px 0;
    margin-bottom: 30px;
    @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px){
                    width: 1122px;
                }
    .header {
        height: auto;
        margin-bottom:20px;
        .search {
            width: 200px;
            margin-right: 10px;
        }
    }
    .content {
        height: auto;
        position: relative;
        .detail {
            width: 100%;
            padding: 10px;
            .video {
                width: 100%;
                height: auto;
            }
        }
        .p-row {
            margin: 10px 0;
            font-size: 16px;
            // border-right: 1px solid #d8dce5;
            text-align: center;
            & > div {
                line-height: 27px;
            }
        }
    }
    video {
        width: 100%;
        max-height: 150px;
    }
}

.el-table__body {
    overflow: hidden !important;
}
</style>