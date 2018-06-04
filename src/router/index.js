import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Film from '@/components/film/film'
import PianHua from '@/components/pianhua/pianhua'
import PianHuaEdit from '@/components/pianhuaEdit/pianhuaEdit'
import Comment from '@/components/comment/comment'
import Actor from '@/components/actor/actor'
import Director from '@/components/director/director'
import Package from '@/components/package/package'
import PackageEdit from '@/components/packageEdit/packageEdit'
import Style from '@/components/style/style'
import Edit from '@/components/edit/edit'
import AddFilm from '@/components/addFilm/addFilm'
import EditActor from '@/components/editActor/editActor'
import EditDirector from '@/components/editDirector/editDirector'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            children: [
                {
                    path: '/',
                    redirect: '/film'
                },
                {
                    path: '/film',
                    component: Film
                },
                {
                    path: '/pianhua',
                    component: PianHua
                },
                {
                    path: '/pianhua/:id',
                    component: PianHuaEdit,
                    name:'pianhuaedit'
                },
                {
                    path: '/comment',
                    component: Comment
                },
                {
                    path: '/actor',
                    component: Actor
                },
                {
                    path: '/director',
                    component: Director
                },
                {
                    path: '/package',
                    component: Package
                },
                {
                    path: '/packageEdit/:id',
                    component: PackageEdit
                },
                {
                    path: '/packageEdit',
                    component: PackageEdit
                },
                                
                {
                    path: '/style',
                    component: Style
                },
                {
                    path: '/edit/:id',
                    component: Edit,
                    name: 'editfilm'
                },
                {
                    path: '/edit',
                    component: Edit
                },
                {
                    path: '/editactor/:id',
                    component: EditActor,
                    name:'editactor'
                },
                {
                    path: '/editdirector/:id',
                    component: EditDirector,
                    name:'editdirector'
                },
                {
                    path: '/editactor',
                    component: EditActor,
                    name:'editactor'
                },
                {
                    path: '/editdirector',
                    component: EditDirector,
                    name:'editdirector'
                }
            ]
        },

    ]
})