import axios from 'axios'

export function getActor(page, key) {
    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'get',
        url: '/v1/actor/',
        headers: {
            'token': token
        },
        params: {
            page: page,
            key: key
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function getActorByID(id,page, key) {
    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'get',
        url: '/v1/actor/'+id,
        headers: {
            'token': token
        },
        params: {
            page: page,
            key: key
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function editActor(id,headerKey,introduction,name) {
    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'put',
        url: '/v1/actor/' + id,
        headers: {
            'token': token
        },
        data: {
            Header: headerKey,
            Introduction: introduction,
            Name: name
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function addActor(headerKey,introduction,name) {
    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'post',
        url: '/v1/actor',
        headers: {
            'token': token
        },
        data: {
            Header: headerKey,
            Introduction: introduction,
            Name: name
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}