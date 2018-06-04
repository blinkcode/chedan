import axios from 'axios'
import { refreshToken } from '@/api/login'

export function getActor(key) {
    let token = localStorage.getItem("accessToken")
    return axios({
        method: 'get',
        url: '/v1/actor',
        headers: {
            'token': token
        },
        params: {
            key: key
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getFilms(filmName, page, status, order, type,amount,size) {
    let token = localStorage.getItem('accessToken')
    return axios({
        method: 'get',
        url: '/v1/channel',
        headers: {
            'token': token
        },
        params: {
            amount: amount,
            size:size,
            key: filmName,
            page: page,
            filmStatus: status,
            order: order,
            type: type
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        if (err.response.status == 401) {
            return Promise.reject(err)
        }
    })
}

