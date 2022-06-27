import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        patients: []
    },
    mutations: {
        savePatients(state, data) {
            state.patients.push(...data)
        }
    },
    getters: {
        allPatients: state => state.patients
    }
})