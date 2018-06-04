<template>
    <div class="style">
        <el-row style="margin-bottom:20px;" :gutter="20">
            <el-col :span="4">
                <el-input v-model="style" placeholder="请输入电影类型" style="margin-left:32px;"></el-input>
            </el-col>
            <el-col :span="6">
                <el-button  @click="_addStyle" type="warning" style="margin-left:32px;">添加</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="content">
            <el-col :span="6" class="s-row" style="border:0;font-weight:bold;white-space:nowrap;">
                <el-col :span="8">id</el-col>
                <el-col :span="8">类型</el-col>
                <el-col :span="8">操作</el-col>
            </el-col>
            <el-col :span="6" class="s-row" style="border:0;font-weight:bold;white-space:nowrap;">
                <el-col :span="8">id</el-col>
                <el-col :span="8">类型</el-col>
                <el-col :span="8">操作</el-col>
            </el-col>
            <el-col :span="6" class="s-row" style="border:0;font-weight:bold;white-space:nowrap;">
                <el-col :span="8">id</el-col>
                <el-col :span="8">类型</el-col>
                <el-col :span="8">操作</el-col>
            </el-col>
            <el-col :span="6" class="s-row" style="border:0;font-weight:bold;white-space:nowrap;">
                <el-col :span="8">id</el-col>
                <el-col :span="8">类型</el-col>
                <el-col :span="8">操作</el-col>
            </el-col>
        </el-row>
        <el-row class="content" :gutter="20">
            <el-col :span="6" v-for="item in styleList" :key="item.id" class="s-row">
                <el-col :span="8">
                    {{item.id}}
                </el-col>
                <el-col :span="8" style="white-space:nowrap;">
                    {{item.name}}
                </el-col>
                <el-col :span="8">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="deleteStyle(item.id)">删除</el-button>
                </el-col>
            </el-col>   
        </el-row>
    </div>
</template>

<script type="text/ecmascript-6">
import pagination from "@/components/pagination/pagination";
import { getStyle } from "@/api/style";
import { deleteStyle } from "@/api/style";
import { addStyle } from "@/api/style";

export default {
    data() {
        return {
            styleList: [],
            style: ""
        };
    },
    created() {
        this._getStyle();
    },
    methods: {
        deleteStyle(id) {
            deleteStyle(id).then(res => {
                this._getStyle();
                this.$message.error("删除成功");
            });
        },
        handleEdit(index, row) {
            //console.log(index, row);
        },
        handleDelete(index, row) {
            //console.log(index, row);
            deleteStyle(row.id).then(res => {
                //console.log(res);
                this._getStyle();
            });
        },
        _getStyle() {
            getStyle()
                .then(res => {
                    this.styleList = res.result.list;
                    //console.log(this.styleList);
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.replace({path:'/login'});
                    }
                });
        },
        _addStyle() {
            if(this.style == ''){
                this.$message.error('风格不能为空')
                return;
            }
            addStyle(this.style)
                .then(res => {
                    this.$message.success("成功添加电影风格");
                    this._getStyle();
                })
                .catch(err => {
                    this.$message.error("添加电影风格失败");
                });
        }
    }
};
</script>

<style scoped lang="scss">
.style {
    padding: 40px 40px 0;
    @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px){
                    width: 1142px;
                }
    .el-table {
        text-align: center;
        th {
            text-align: center !important;
        }
        .table-title {
            text-align: center !important;
        }
    }
    .content {
        text-align: center;
        .s-row {
            margin: 10px 0;
            border-right: 1px solid #d8dce5;
            & > div {
                line-height: 27px;
            }
        }
    }
}
</style>