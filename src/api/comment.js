import axios from 'axios'

export function postComment(channelId,comment){
    let token = localStorage.getItem('accessToken')
    
    return axios({
        url:`/v1/helper/comments`,
        method:'post',
        headers:{
            'token':token
        },
        params:{
            channelId:channelId
        },
        data:{
            Contents:comment
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((res)=>{
        return Promise.reject(err)
    })
}