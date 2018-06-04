import axios from 'axios'

export function getPackage(page,order){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'get',
        url:'/v1/package',
        headers:{
            'token':token
        },
        params:{
            'page':page,
            'order':order,
            'size':5
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((err)=>{
        return Promise.reject(err)
    })
}

export function getPackageByID(id){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'get',
        url:`/v1/package/${id}`,
        headers:{
            'token':token
        },
        params:{
            
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((err)=>{
        return Promise.reject(err)
    })
}

export function commitPackage(vname,vcode,introduction,path){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'post',
        url:'/v1/package',
        headers:{
            'token':token
        },
        data:{
            Introduction:introduction,
            Path:path,
            VersionCode:vcode,
            VersionName:vname
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export function editPackage(id,vname,vcode,introduction,path){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'put',
        url:'/v1/package/'+id,
        headers:{
            'token':token
        },
        data:{
            Introduction:introduction,
            Path:path,
            VersionCode:vcode,
            VersionName:vname
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export function deletePackage(id){
    let token = localStorage.getItem('accessToken')
    return axios({
        method:'delete',
        url:'v1/package/'+id,
        headers:{
            token:token
        }
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}