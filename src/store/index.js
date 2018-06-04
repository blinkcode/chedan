import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
// import state from './state'
// import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        isCollapsed : true,
        filmDetail:{
            // id:'',
            // name:'',
            // actors:'',
            // directors:'',
            // style:''
        }
    },
    mutations:{
        changeCollapse:state => {
            state.isCollapsed = !state.isCollapsed
            
        }
    }
})