import md5 from 'js-md5'

export function md5Password(text){
    const salt = "Che%2017*21JiXiaoh6+aUa22sdSfqMp)"
    let md5PWD = md5(salt + text)
    return md5(md5PWD)
}