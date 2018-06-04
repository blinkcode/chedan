import axios from 'axios'

export function getStyle(){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'get',
        url:'/v1/style',
        headers:{
            'token':token
        },
        params:{
            size:1000
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((res)=>{
        return Promise.reject(err)
    })
}

export function deleteStyle(id){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'delete',
        url:'/v1/style/'+id,
        headers:{
            'token':token
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export function addStyle(name){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'post',
        url:'/v1/style/',
        headers:{
            'token':token
        },
        data:{
            ChannelIds:[0],
            Name:name
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}