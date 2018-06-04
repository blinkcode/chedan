<template>
    <div>
    <div class="actor">
        <el-button class="add" @click="addActor">添加演员</el-button>
        <el-row style="width:100%">
            <template v-for="item in actorList">
                <el-col :span="4" style="width:20%;">
                    <div class="actor-item">
                <div class="header">
                    <img :src="item.header" alt="">
                </div>
                <div class="name">
                    <p>{{item.name}}</p>
                </div>
                <div class="introduction">
                    <p>{{textOver(item.introduction)}}</p>
                </div>
                <el-row>
                    <el-col>
                        <el-button type="warning" size="small" @click="toEdit(item.id)">编辑</el-button>
                    </el-col>
                </el-row>
            </div>
                </el-col>
            </template>
        </el-row> 

        <el-dialog title="编辑演员信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="form.production" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <div id="container">
                        <el-button type="waring" id="uploadPic">上传演员头像</el-button>
                    </div>
                    <div id="uploadPicList"></div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </div>
         <pagination :page="actorPage" :total-page="totalPage" @pageChange="changePage"
                    v-if="havePage"></pagination>

    </div>
</template>

<script type="text/ecmascript-6">
import pagination from "@/components/pagination/pagination";
import { getActor } from "@/api/actor";
import { editActor } from "@/api/actor";
import { getQiNiu2 } from "@/api/qiniu";

export default {
    data() {
        return {
            actorList: [],
            header:
                "http://file.chedanapp.com/image_film_jiaozhuzhuan_1.jpg?imageView2/1/w/400/h/400/q/100",
            introduction: "暂无数据",
            actorPage: 1,
            form: {
                name: "",
                header: "",
                production: ""
            },
            formLabelWidth: "120px",
            qiniu2Data: {
                upToken: "",
                domain: ""
            },
            choiceImages: [],
            dialogFormVisible: false,
            actorID:0,
            totalPage:0,
            havePage:false
        };
    },
    created() {
        this._getActors();
        this._getDirectorPage()
    },
    methods: {
        toEdit(id){
            this.dialogFormVisible = true
            //this.$router.push('editactor')
            this.$router.push({name:'editactor',params:{id:id}})
        },
        changePage(e) {
            this.actorPage = e;
            this._getActors();
        },
        addActor(){
            this.$router.push({path:'/editactor'})
        },
        _getActors() {
            let page = this.actorPage;
            getActor(page)
                .then(res => {
                    this.actorList = res.result.list;
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace("login");
                    }
                });
        },
        _getDirectorPage(){
                getActor().then(res =>{
                    this.totalPage = res.result.totalPages
                }).then(()=>{
                    this.havePage = true
                })
        },
        textOver(text) {
            if (text) {
                let w = text.substring(0, 10) + "...";
                return w;
            } else {
                return null;
            }
        }
    },
    components: {
        pagination
    }
};
</script>

<style scoped lang="scss">
.actor {
    height: 100%;
    @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px){
                    width: 1050px;
                }
    padding: 80px 40px 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: flex-start;
    position:relative;
    .add{
        position:absolute;
        left: 60px;
        top:30px;
    }
    .actor-item {
        width: 200px;
        height: 300px;
        margin-bottom: 40px;
        box-sizing: border-box;
        text-align: center;
        padding: 10px;
        .header {
            height: 200px;
            width: 100%;
            img {
                width: 85%;
                max-height: 200px;
                margin:0 auto;
            }
        }
        .name {
            margin: 10px 0;
            font-weight: bold;
        }
        .introduction {
            margin: 10px 0;
            p{
                font-size:14px;
            }
        }
    }
}
.el-pagination{
    margin-top:0!important;
    margin-left:80px;
}
</style>