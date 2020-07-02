const state = () => ({
    user: null,
    errors: [],
    changePasswordStatus: {
        loading: false
    },
    loginLoading: false
});

const getters = {
    getUser: (state) => state.user,
    getErrors: (state) => state.errors,
    getLoginLoading: (state) => state.loginLoading,
    getChangePasswordStatus: (state) => state.changePasswordStatus
};

const actions = {
    async loginUser ({ commit }, payload) {
        commit('setLoginLoading', true);
        try {
            const user = await this.$axios.$post('/login', payload);
            const Cookies = process.client ? require('js-cookie') : undefined;
            Cookies.set('token', user.token);
            commit('setLoginLoading', false);
            commit('setUser', user);
        } catch (e) {
            commit('setLoginLoading', false);
            if (e.message == 'Network Error') {
                commit('setErrors', { message: JSON.stringify(['A network error occured. Please try again later!']) });
            } else {
                commit('setErrors', e.response.data);
            }
        }
    },
    async loginUserWithToken ({ commit }, p) {
        try {
            const user = await this.$axios.$get('/login');
            this.$axios.setToken(user.token, 'Bearer');
            commit('setUser', user);
        } catch (e) {
            if (e.errno == 'ENOTFOUND') {
                commit('setUser', null);
                commit('setErrors', { message: JSON.stringify(['An API seems down. Please check with the site administrator!']) });
            } else {
                if (e.response.status == 403) {
                    commit('setUser', null);
                }
            }
        }
    },
    removeUser({ commit }) {
        commit('setUser', null);
    },
    async logoutUser ({ commit }) {
        try {
            const Cookies = process.client ? require('js-cookie') : undefined;
            Cookies.remove('token');
            commit('setUser', null);
        } catch (e) {
            commit('setErrors', e.response.data);
        }
    },
    async changePassword ({ commit, dispatch, state }, payload) {
        try {
            commit('setChangePasswordStatus', { loading: true, data: undefined });
            const result = await this.$axios.$put('/users/settings/change-password', payload);
            commit('setChangePasswordStatus', { loading: false, data: result });
            dispatch('general/handleUpdated', { ...result, title: result.fullName }, { root: true });
        } catch (e) {
            commit('setChangePasswordStatus', { loading: false, data: undefined });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
};

const mutations = {
    setUser: (state, user) => {
        state.user = user;
        state.errors = [];
    },
    setErrors: (state, errors) => {
        state.errors = JSON.parse(errors.message);
    },
    setChangePasswordStatus: (state, data) => state.changePasswordStatus = data,
    setLoginLoading: (state, data) => state.loginLoading = data,
};

export default {
    state,
    getters,
    actions,
    mutations
}