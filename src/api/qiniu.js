import axios from "axios";
import SparkMD5 from "spark-md5";

export function getQiNiu2() {
    let token = localStorage.getItem("accessToken");
    return axios({
        method: "get",
        url: "/v1/keys/qiniu",
        headers: {
            token: token
        },
        params: {
            type: 2
        }
    })
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

export function getQiNiu4() {
    let token = localStorage.getItem("accessToken");
    return axios({
        method: "get",
        url: "/v1/keys/qiniu",
        headers: {
            token: token
        },
        params: {
            type: 4
        }
    }).then(res => {
        return Promise.resolve(res.data);
    }).catch(err =>{
        return Promise.reject(err)
    });
}
