import axios from 'axios'

export function getTrailers(id){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'get',
        url:'/v1/trailer',
        headers:{
            'token':token
        },
        params:{
            channelId:id
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((err)=>{
        return Promise.reject(err)
    })
}

export function postTrailers(id,name,total,trailer,poster){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'post',
        url:'/v1/trailer',
        headers:{
            'token':token
        },
        data:{
            ChannelId:id,
            Name:name,
            Paths:trailer,
            Poster:poster,
            TotalTime:total
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((err)=>{
        return Promise.reject(err)
    })
}

export function deleteTrailer(id){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'delete',
        url:'/v1/trailer/'+id,
        headers:{
            'token':token
        },
        data:{
            
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((err)=>{
        return Promise.reject(err)
    })
}