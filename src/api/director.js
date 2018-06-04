import axios from 'axios'

export function getDirector(page, key) {

    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'get',
        url: '/v1/director',
        headers: {
            'token': token
        },
        params: {
            page: page,
            key: key
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((res) => {
        return Promise.reject(err)
    })
}

export function getDirectorByID(id,page, key) {
    
        let token = localStorage.getItem('accessToken')
        return axios({
            method: 'get',
            url: '/v1/director/'+id,
            headers: {
                'token': token
            },
            params: {
                page: page,
                key: key
            }
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch((res) => {
            return Promise.reject(err)
        })
    }

export function editDirector(id, headerKey, introduction, name) {
    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'put',
        url: '/v1/director/' + id,
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

export function addDirector(headerKey,introduction,name) {
    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'post',
        url: '/v1/director',
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