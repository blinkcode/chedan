<template>
    <div class="comment">
        <div class="header">
            <el-row>
                <el-col :span="5">
                    <el-autocomplete
                    class="inline-input"
                    v-model="state1"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect"
                    style="margin-left:32px;">
                        <template slot-scope="props">
                            <div class="name">{{ props.item.name }}</div>
                        </template>
                    </el-autocomplete>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" style="position:relative;left:-10px;">搜索电影</el-button>
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
                    style="margin:0 10px;">
                        <el-option
                        v-for="item in options4"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <div class="content">       
            <el-row :gutter="20">
                <el-col :span="8" class="p-row" style="border:0;font-weight:bold;">
                    <el-col :span="15"  style="white-space:nowrap">电影名</el-col>
                    <el-col :span="9" style="padding-right:0;">
                        <p  style="white-space:nowrap">操作</p>
                    </el-col>
                </el-col>
                    <el-col :span="8" class="p-row" style="border:0;font-weight:bold;">
                    <el-col :span="15" style="white-space:nowrap;">电影名</el-col>
                    <el-col :span="9" style="padding-right:0;white-space:nowrap;">操作</el-col>
                </el-col>
                    <el-col :span="8" class="p-row" style="border:0;font-weight:bold;">
                    <el-col :span="15" style="white-space:nowrap;">电影名</el-col>
                    <el-col :span="9" style="padding-right:0;white-space:nowrap;">操作</el-col>
                </el-col>

            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" v-for="item in filmList" :key="item.id" class="p-row">
                    <el-col :span="15">
                        <p style="white-space:nowrap">{{item.name}}</p>
                    </el-col>
                    <el-col :span="5">
                        <el-button
                                size="mini"
                                @click="goDetail(item.id,item.name)">添加评论</el-button>
                    </el-col>
                </el-col>
            </el-row>

            <el-dialog :title="commentName1" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item>
                        <el-form-item>
                            <template slot-scope="scope">
                                <el-input type="textarea" v-model="form.comment"
                                          :rows="4"></el-input>
                            </template>
                        </el-form-item>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="commit()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { getFilms } from "@/api/film";
import { postComment } from "@/api/comment";

export default {
    data() {
        return {
            form1: {
                name: ""
            },
            filmList: [],
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: "",
                comment: ""
            },
            choiceID: "",
            commentList:[],
            restaurants: [],
            state1: "",
            state2: "",
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
            orderValue:1,
            commentName:''
        };
    },
    computed:{
        commentName1(){
            return '渠道名称：'+this.commentName
        }
    },
    created() {
        this._getFilm();
    },
    methods: {
        filmChannel(){
            this._getFilm()
        },
        orderChange(){
            this._getFilm()
        },
        querySearch(queryString, cb) {
            getFilms(this.state1).then(res=>{
                var restaurants = res.result.list;
                var results = queryString
                    ? restaurants.filter(this.createFilter(queryString))
                    : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            })
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
            this.state1 = item.name
            this.goDetail(item.id,item.name)
        },
        goDetail(id,name) {
            this.dialogFormVisible = true;
            this.commentName = name
            this.choiceID = id
        },
        onSubmit() {
            getFilms(this.form1.name).then(res => {
                this.filmList = res.result.list;
            });
        },
        handleEdit(scope, row) {
            this.dialogFormVisible = true;
            console.log(row);
            this.choiceID = row.id;
        },
        commit() {
            this.dialogFormVisible = false;
            this.commentList.push(this.form.comment)
            let comment = this.commentList;
            let arr = this.form.comment.split(/\n/)
            
            let channelId = this.choiceID;
            postComment(channelId, arr)
                .then(res => {
                    console.log(res);
                })
                .catch(res => {
                    if (err.response.status == 401) {
                        this.$router.replace("login");
                    }
                });
        },
        _getFilm(id) {

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

            getFilms(id,page, status, order, type,amount,size).then(res => {
                this.filmList = res.result.list;
            });
        },
        _postComment() {
            let id = this.choiceID;
            let comment = this.form.comment;
            postComment(id, comment).then(res => {
                console.log(res);
            });
        }
    }
};
</script>

<style scoped lang="scss">
.comment {
    padding: 40px 40px 0;
    @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px){
                    width: 1122px;
                }
    .header {
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
            position: absolute;
            left: 0;
            top: 0;
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
            border-right: 1px solid #d8dce5;
            text-align: center;
            & > div {
                line-height: 27px;
            }
        }
    }
}

.el-table__body {
    overflow: hidden !important;
}
</style>