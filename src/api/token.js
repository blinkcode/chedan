import {getToken} from '@/api/login'
import {refreshToken} from '@/api/login'

class Token{
    constructor(){
    
    }
    
    
    refreshToken(){
        let token = localStorage.getItem('refreshToken')
        return axios({
            method:'put',
            url:'/user/token',
            data:{
                Token:token
            }
        }).then((res)=>{
            console.log(res.data)
            return Promise.resolve(res.data)
        })
    }
    
    toLogin(){
        this.$router.push('login')
    }
}

export {Token}