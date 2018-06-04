<template>
    <div class="film" style="white-space:nowrap;">
        <el-button plain @click="addFilm" style="margin-left:14px;margin-right:10px">添加渠道</el-button>
        <el-select v-model="channelValue" placeholder="渠道类型" @change="filmChannel" 
                    style="margin-right:10px;margin-left:10px;width:150px;">
            <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="statusValue" 
                   placeholder="渠道状态" 
                   @change="filmStatus"
                   style="margin-left:10px;margin-right:10px;width:150px;">
            <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="orderValue" placeholder="排序方法" @change="filmOrder"
                   style="width:150px">
            <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <template v-for="item in filmList">
            <div class="film-item">
                <div class="right">
                    <el-row>
                        <el-col :span="12">
                            <p class="title">{{item.name}}</p>
                        </el-col>
                    </el-row>
                    <el-row class="detail">
                        <el-col :span="4">
                            <p class="introduce">{{_filmStatus(item.filmStatus)}}</p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">上映时间:{{item.firstShow}}</p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">推荐度:{{item.recommendStatus}}</p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">打赏状态:{{acceptReward(item.acceptReward) || '接受打赏'}}</p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">总打赏:{{item.rewardCount}}</p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">周打赏:{{item.rewardWeek}}</p>
                        </el-col>
                    </el-row>
                    <el-row class="detail">
                        <el-col :span="4">
                            <p class="introduce">想看人数:{{item.wantToSee}}</p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">周排行:{{item.rankingWeek}}</p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">
                                类型:<span v-for="style in item.styles" :key="style.id">
                                        {{style.name || '无'}}
                                    </span>
                            </p>
                        </el-col>
                        <el-col :span="4">
                            <p class="introduce">
                                导演:<span v-for="director in item.directors" :key="director.id">
                                        {{director.name || '张艺谋'}}
                                    </span>
                            </p>
                        </el-col>
                        <el-col :span="8">
                            <p class="introduce">
                                演员:
                                <span v-for="actor in item.actors" :key="actor.id">
                                    {{actor.name || '周冬雨、李易峰'}}
                                </span>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class="detail">
                        <el-col :span="24">
                            <p class="introduce">{{textOver(item.introduction) || '啊啊啊啊啊啊啊啊'}}</p>
                        </el-col>
                    </el-row>
                    <el-row class="film-img">
                        <el-col class="img-box">
                            <template v-for="img in item.images">
                                <img :src="img" alt="">
                            </template>
                        </el-col>
                    </el-row>
                </div>

                <div class="left">
                    <img :src="item.poster" alt="">
                    <el-button type="warning" class="btn" :data-film="item"
                               @click="edit(item)">编辑</el-button>
                </div>

                <el-dialog title="编辑" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                        <el-form-item label="演员" :label-width="formLabelWidth">
                            <el-input v-model="form.actor" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="导演" :label-width="formLabelWidth">
                            <el-input v-model="form.director" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="电影风格" :label-width="formLabelWidth">
                            <el-input v-model="form.style" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                    </div>
                </el-dialog>

            </div>
        </template>
        <pagination :page="filmPage" :total-page="totalPage" @pageChange="pageChange"
                    v-if="havePage"></pagination>
    </div>

</template>

<script>
import pagination from "@/components/pagination/pagination";
import { getActor } from "@/api/film";
import { refreshToken } from "@/api/login";
import { getFilms } from "@/api/film";

export default {
    data() {
        return {
            filmList: [],
            images: [
                "http://file.chedanapp.com/image_xinlizui_1.jpg",
                "http://file.chedanapp.com/image_xinlizui_2.jpg",
                "http://file.chedanapp.com/image_xinlizui_3.jpg",
                "http://file.chedanapp.com/image_xinlizui_4.jpg",
                "http://file.chedanapp.com/image_xinlizui_5.jpg",
                "http://file.chedanapp.com/image_xinlizui_6.jpg",
                "http://file.chedanapp.com/image_xinlizui_7.jpg",
                "http://file.chedanapp.com/image_xinlizui_8.jpg",
                "http://file.chedanapp.com/image_xinlizui_9.jpg"
            ],
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                actor: "",
                director: "",
                style: ""
            },
            formLabelWidth: "120px",
            filmPage: 1,
            totalPage: 0,
            options1: [
                {
                    value: "0",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "即将上映"
                },
                {
                    value: "2",
                    label: "正在上映"
                },
                {
                    value: "4",
                    label: "已下架"
                }
            ],
            statusValue: "",
            options2: [
                {
                    value: "FirstShow",
                    label: "上映时间"
                },
                {
                    value: "RewardWeek",
                    label: "周排行"
                },
                {
                    value: "-RewardCount",
                    label: "总排行"
                },
                {
                    value: "-FirstShow",
                    label: "上映倒序"
                }
            ],
            orderValue: "",
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
            channelValue: "",
            status: "",
            order: "",
            channel: "",
            havePage:false,
            name:""
        };
    },
    created() {
        
        this._getFilms(this.name,this.filmPage,this.statusValue,this.orderValue,this.channelValue)
        this._getFilmsPage();
    },
    methods: {
        filmStatus(e) {
            this.statusValue = e;
            this._getFilms(this.name,this.filmPage,this.statusValue,this.orderValue,this.channelValue)
        },
        filmChannel(e) {
            this.channelValue = e;
            this._getFilms(this.name,this.filmPage,this.statusValue,this.orderValue,this.channelValue)
        },
        filmOrder(e) {
            this.orderValue = e
            this._getFilms(this.name,this.filmPage,this.statusValue,this.orderValue,this.channelValue)
        },
        pageChange(e) {
            this.filmPage = e;
            this._getFilms(this.name,this.filmPage,this.statusValue,this.orderValue,this.channelValue)
        },
        acceptReward(type) {
            switch (type) {
                case true:
                    return "接受打赏";
                    break;
                case false:
                    return "不接受打赏";
                    break;
            }
        },
        edit(film) {
            //                this.dialogFormVisible = true
            console.log(film);
            const channelId = film.id;
            this.$router.push({ name: "editfilm", params: { id: channelId } });
        },
        addFilm() {
            this.$router.push("edit");
        },
        textOver(text) {
            if (text) {
                let w = text.substring(0, 50) + "...";
                return w;
            } else {
                return null;
            }
        },
        _getToken() {
            getActor().then(res => {
                if (res.code == -1) {
                    refreshToken();
                }
            });
        },
        _getFilms(name,page,status,order,type) {
            let amount = 3
            getFilms(name, page,status,order,type,amount)
                .then(res => {
                    this.filmList = res.result.list;
                    this.totalPage = res.result.totalPages
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace({path:'/login'});
                    }
                });
        },
        _getFilmsPage() {
            getFilms().then(res => {
                this.totalPage = res.result.totalPages;
                this.havePage = true
            });
        },
        _filmStatus(type) {
            switch (type) {
                case 1:
                    return "即将上线";
                    break;
                case 2:
                    return "已上映";
                    break;
                case 3:
                    return "已下架";
            }
        }
    },
    components: {
        pagination
    }
};
</script>

<style scoped lang="scss">
.film {
    height: 100%;
    padding: 40px 40px 40px;
    @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px){
                    width: 1142px;
                }
    .film-item {
        box-sizing: border-box;
        width: 100%;
        height: 350px;
        padding-left: 200px;
        padding-top: 25px;
        border-bottom: 1px solid #d8dce5;
        .left {
            float: left;
            width: 200px;
            height: 100%;
            margin-left: -100%;
            position: relative;
            left: -200px;
            box-sizing: border-box;
            padding: 15px;
            .el-button {
                padding: 10px 25px;
                box-sizing: border-box;
                width: 100%;
            }
            img {
                width: 100%;
                max-height: 241px;;
            }
            .btn {
                display: block;
                margin: 0 auto;
                margin-top: 10px;
            }
        }
        .right {
            float: left;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 15px;
            .title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 15px;
            }
            .detail {
                /*font-size:9px;*/
            }
            .introduce {
                font-size: 14px;
                margin: 7px 0;
            }
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
}

.el-pagination {
    margin-bottom: 80px;
    margin-top: 20px;
}
</style>