<template>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pagination"
                :page-size="100"
                layout="prev, pager, next, jumper"
                :total="totalPages"
                >
        </el-pagination>
</template>

<script>
    export default {
        data(){
            return{
                pagination:this.page,
                totalPages:this.totalPage*100
            }
        },
        props:{
            page:Number,
            totalPage:Number
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$emit('pageChange',val)
            }
        },
        watch:{
            totalPage:function(val){
                this.totalPages = val*100
            }
        }
    }
</script>

<style scoped lang="scss">
.el-pagination {
    margin-bottom: 80px;
    margin-top: 40px;
}
</style>