const state = () => ({
    apiHost: 'http://<baseapiurl>',
    userRoles: null,
    errors: undefined,
    deletedItem: undefined,
    updatedItem: undefined,
    cropImageStatus: {
        loading: false
    },
});

const getters = {
    apiHost: (state) => state.apiHost,
    getErrors: (state) => state.errors,
    getUserRoles: (state) => state.userRoles,
    getDeletedItem: (state) => state.deletedItem,
    getUpdatedItem: (state) => state.updatedItem,
    getCropImageStatus: (state) => state.cropImageStatus
};

const actions = {
    async fetchUserRoles({ commit, dispatch }) {
        try {
            const response = await this.$axios.$get(`/users/roles/user-types`);
            commit('setUserRoles', response);
        } catch (e) {
            dispatch('handleRequestError', e);
        }
    },
    async handleRequestError ({ commit }, error) {
        if (error.response != undefined) {
            if (error.response.status == 403) {
                //commit('auth/setUser', null, { root: true });
                commit('setErrors', error.response.data);
            }
            if (error.response.status == 406) {
                commit('setErrors', error.response.data);
            }
            if (error.response.status == 500) {
                commit('setErrors', error.response.data);
            }
        } else {
            if (error.message != undefined) {
                commit('setErrors', error);
            }
        }
    },
    clearErrors ({ commit }) {
        commit('setErrors', undefined);
    },
    handleDeleted ({ commit }, data) {
        commit('setDeletedItem', data);
    },
    handleUpdated ({ commit }, data) {
        commit('setUpdatedItem', data);
    },
    handleCropImage ({ commit }, data) {
        commit('setCropImageStatus', data);
    }
};

const mutations = {
    setUserRoles: (state, data) => state.userRoles = data,
    setErrors: (state, errors) => {
        state.errors = {
            array: JSON.parse(errors.message),
            time: Date.now()
        };
    },
    setDeletedItem: (state, data) => state.deletedItem = data,
    setUpdatedItem: (state, data) => state.updatedItem = data,
    setCropImageStatus: (state, data) => state.cropImageStatus = data,
};

export default {
    state,
    getters,
    actions,
    mutations
}
