<template>
    <div class="home">

            <div class="container">
                <div class="header">
                        <home-header></home-header>
                </div>
                <div class="main">
                    <router-view></router-view>
                </div>
                <div class="nav">
                    <nav-menu></nav-menu>
                </div>

            </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import navMenu from "@/components/navMenu/navMenu"
    import homeHeader from "@/components/homeHeader/homeHeader"
    import pagination from "@/components/pagination/pagination"

    export default{

        components:{
            navMenu,
            homeHeader,
            pagination
        }
    }
</script>

<style scoped lang="scss">
    .home{
        box-sizing:border-box;
        height:100%;
        .container{
            height:100%;
            box-sizing:border-box;
            padding-left:210px;
            @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px){
                    padding-left:150px;
                }
            .header{
                height:70px;
                width:100%;
                position:fixed;
                top:0;
                left:0;
                background: #eef1f6;
                box-sizing: border-box;
                padding:15px 30px;
                z-index:50;
            }
            .main{
                float:left;
                width:100%;
                height:100%;
                padding-top:70px;
                position:relative;
                overflow:auto;
            }
            .nav{
                float:left;
                height:100%;
                width:210px;
                margin-left:-100%;
                position:relative;
                left:-210px;
                background: #30333A;
                z-index:90;
                @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px){
                    width:150px;
                    left:-150px;
                }
            }
        }
    }
    
</style>