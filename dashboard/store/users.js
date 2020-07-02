import moment from 'moment';
import paginate from '../static/js/paginate';

const state = () => ({
    users: {},
    profile: null,
    addUserStatus: {
        loading: false
    },
    editUserStatus: {
        loading: false
    },
    cropImageStatus: {
        loading: false
    },
    changeUserRoleStatus: {
        loading: false
    },
    pagination: null
});

const getters = {
    getUsers: (state) => {
        return state.users;
    },
    getProfile: (state) => state.profile,
    getAddUserStatus: (state) => state.addUserStatus,
    getEditUserStatus: (state) => state.editUserStatus,
    getCropImageStatus: (state) => state.cropImageStatus,
    getChangeUserRoleStatus: (state) => state.changeUserRoleStatus,
    getPagination: (state) => state.pagination,
};

const actions = {
    async fetchUsers ({ commit, dispatch }, payload) {
        try {
            if (payload == undefined) {
                const response = await this.$axios.$get(`/users`);
                commit('setUsers', response);
            } else {
                let response = await this.$axios.$get('/users', {
                    params: {
                        ...payload
                    }
                });
                if (response.docs.length == 0 && response.totalDocs > 0) {
                    response = await this.$axios.$get(`/users?limit=${payload.limit}&page=1`);
                }
                commit('setUsers', response);
                delete response.docs;
                commit('setPagination', response);
            }
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async fetchProfile ({ commit, dispatch }, payload) {
        try {
            commit('setProfile', null);
            const response = await this.$axios.$get('/users/'+ payload);
            commit('setProfile', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async addUser ({ commit, dispatch }, payload) {
        try {
            commit('setAddUserStatus', { loading: true });
            const result = await this.$axios.$post('/users', payload);
            dispatch('general/handleUpdated', { ...result, title: result.fullName }, { root: true });
            commit('setAddUserStatus', { loading: false, id: result._id });
        } catch (e) {
            commit('setAddUserStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async editUser ({ commit, dispatch, state }, payload) {
        try {
            commit('setEditUserStatus', { loading: true });
            const result = await this.$axios.$put('/users/'+state.profile._id, payload);
            commit('setEditUserStatus', { loading: false, data: result });
            commit('setProfile', result);
            dispatch('general/handleUpdated', { ...result, title: result.fullName }, { root: true });
        } catch (e) {
            commit('setEditUserStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async deleteUser ({ dispatch, state }, payload) {
        try {
            const result = await this.$axios.$delete('/users/'+payload);
            dispatch('general/handleDeleted', { ...result, title: result.firstName, id: result._id }, { root: true });
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async cropImage({ commit, state, dispatch }, payload) {
        try {
            dispatch('general/handleCropImage', { loading: true }, { root: true });
            const url = `/users/${state.profile._id}/image/crop`;
            const result = await this.$axios.$post(url, payload);
            commit('setProfile', result);
            dispatch('general/handleCropImage', { loading: false, status: 'uploaded' }, { root: true });
            dispatch('general/handleUpdated', { ...result, title: result.firstName }, { root: true });
        } catch (e) {
            dispatch('general/handleCropImage', { loading: false }, { root: true });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async getDeletionKey({ commit, dispatch }, payload) {
        try {
            await this.$axios.$post('users/set/key/for/user/deletion', payload);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async changeUserRole ({ commit, dispatch, state }, payload) {
        try {
            commit('setChangeUserRoleStatus', { loading: true, data: undefined });
            const result = await this.$axios.$put(`/users/${state.profile._id}/settings/change-role`, payload);
            commit('setChangeUserRoleStatus', { loading: false, data: result });
            dispatch('general/handleUpdated', { ...result, title: result.fullName }, { root: true });
        } catch (e) {
            commit('setChangeUserRoleStatus', { loading: false, data: undefined });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
};

const mutations = {
    setUsers: (state, data) => {
        const users = data.docs;
        const docs = [];
        let count = data.limit * (data.page -1);
        users.forEach(user => {
            count += 1;
            const created = moment(user.createdAt).format("Do MMM YY");
            const updated = moment(user.updatedAt).format("Do MMM YY");
            const userData = { ...user, index: count, created, updated };
            docs.push(userData);
        });
        state.users = docs;
    },
    setProfile: (state, data) => state.profile = data,
    setPagination: (state, pagination) => {
        state.pagination = paginate(pagination);
    },
    setAddUserStatus: (state, data) => state.addUserStatus = data,
    setEditUserStatus: (state, data) => state.editUserStatus = data,
    setCropImageStatus: (state, data) => state.cropImageStatus = data,
    setChangeUserRoleStatus: (state, data) => state.changeUserRoleStatus = data,
};

export default {
    state,
    getters,
    actions,
    mutations
}