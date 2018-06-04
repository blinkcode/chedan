import axios from 'axios'
import {md5Password} from '@/api/password'

export function getToken(name,text){
    const url = '/v1/user/login'
    //let refreshToken = localStorage.getItem('refreshToken')
    let password = md5Password(text).toString()
    
    return axios.post(url,{
        Phone:name,
        Password:password
    }).then((res)=>{
        
        return Promise.resolve(res.data)
    })
}

export function refreshToken(){
    let token = localStorage.getItem('refreshToken')
    return axios({
        method:'put',
        url:'/v1/user/token',
        data:{
            Token:token
        }
    }).then((res)=>{
        this.$router.push('login')
        //return Promise.resolve(res.data)
    })
}