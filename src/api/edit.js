import axios from 'axios'

export function editFilms(id,actorID,directorID,styleID,type,name,recommend,firstShow,status,reward,totalTime,introduction,images,poster){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'put',
        url:'/v1/channel/'+id,
        headers:{
            'token':token
        },
        data:{
            AcceptReward: reward,
            ActorIds: actorID,
            DirectorIds: directorID,
            FirstShow: firstShow,
            Images: images,
            Introduction: introduction,
            Name: name,
            Poster: poster,
            Recommend: recommend,
            Status: status,
            StyleIds: styleID,
            TotalTime: totalTime,
            Type: type
        }
        
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch(err=>{
        return Promise.reject(err)
    })
}

export function getFilm(id){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'get',
        url:'/v1/channel/'+id,
        headers:{
            'token':token
        },
        params:{
            amount:3
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((err)=>{
        return Promise.reject(err)
    })
}

export function addFilm(actorID,directorID,styleID,type,name,recommend,firstShow,status,reward,totalTime,introduction,images,poster){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'post',
        url:'/v1/channel/',
        headers:{
            'token':token
        },
        data:{
            AcceptReward: reward,
            ActorIds: actorID,
            DirectorIds: directorID,
            FirstShow: firstShow,
            Images: images,
            Introduction: introduction,
            Name: name,
            Poster: poster,
            Recommend: recommend,
            Status: status,
            StyleIds: styleID,
            TotalTime: totalTime,
            Type: type
        }
        
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch(err=>{
        return Promise.reject(err)
    })
}

export function deleteFilm(id){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'delete',
        url:'/v1/channel/'+id,
        headers:{
            'token':token
        },
        data:{
            
        }
        
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}