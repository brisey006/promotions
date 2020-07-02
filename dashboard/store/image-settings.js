import paginate from '../static/js/paginate';

const state = () => ({
    imageKeys: null,
    imageSettings: {},
    imageSetting: null,
    pagination: null,
    addImageSettingsStatus: {
        loading: false
    },
    editImageSettingsStatus: {
        loading: false
    },
});

const getters = {
    getKeys: (state) => state.imageKeys,
    getAddImageSettingsStatus: (state) => state.addImageSettingsStatus,
    getEditImageSettingsStatus: (state) => state.editImageSettingsStatus,
    getPagination: (state) => state.pagination,
    getImageSettings: (state) => state.imageSettings,
    getImageSetting: (state) => state.imageSetting
};

const actions = {
    async fetchImageKeys ({ commit }) {
        const response = await this.$axios.$get('/settings/image/keys/all');
        commit('setImageKeys', response);
    },
    async fetchImageSettings ({ commit, dispatch }, payload) {
        try {
            let response = await this.$axios.$get('/settings/image', {
                params: {
                    ...payload
                }
            });
            if (response.docs.length == 0 && response.totalDocs > 0) {
                response = await this.$axios.$get(`/settings/image?limit=${payload.limit}&page=1`);
            }

            const data = response;
            const docs = [];
            let count = data.limit * (data.page -1);
            data.docs.forEach(imageSetting => {
                count += 1;
                const created = this.$moment(imageSetting.createdAt).format("Do MMM YY");
                const updated = this.$moment(imageSetting.updatedAt).format("Do MMM YY");
                const setting = { ...imageSetting, index: count, created, updated };
                docs.push(setting);
            });

            commit('setImageSettings', docs);
            delete response.docs;
            commit('setPagination', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async fetchImageSetting ({ commit, dispatch }, slug) {
        try {
            let response = await this.$axios.$get('/settings/image/'+slug);
            commit('setImageSetting', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async addImageSetting ({ commit, dispatch }, payload) {
        try {
            commit('setImageSettingsStatus', { loading: true });
            const result = await this.$axios.$post('/settings/image', payload);
            commit('setImageSettingsStatus', { loading: false, status: 'added' });
            dispatch('fetchImageSettings');
            dispatch('general/handleUpdated', { ...result, title: result.name }, { root: true });
        } catch (e) {
            commit('setImageSettingsStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async editImageSetting ({ commit, dispatch }, payload) {
        try {
            commit('setEditImageSettingsStatus', { loading: true });
            const id = payload.id;
            delete payload.id;
            const result = await this.$axios.$put('/settings/image/'+id, payload);
            commit('setEditImageSettingsStatus', { loading: false, status: 'updated' });
            dispatch('fetchImageSettings');
            dispatch('general/handleUpdated', { ...result, title: result.name }, { root: true });
        } catch (e) {
            commit('setEditImageSettingsStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async deleteImageSetting ({ dispatch }, payload) {
        try {
            const result = await this.$axios.$delete('/settings/image/'+payload);
            dispatch('general/handleDeleted', { ...result, title: result.name, id: result._id }, { root: true });
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    }
};

const mutations = {
    setImageSettings: (state, imageSettings) => state.imageSettings = imageSettings,
    setImageSetting: (state, data) => state.imageSetting = data,
    setImageKeys: (state, data) => state.imageKeys = data,
    setImageSettingsStatus: (state, data) => state.addImageSettingsStatus = data,
    setEditImageSettingsStatus: (state, data) => state.editImageSettingsStatus = data,
    setPagination: (state, pagination) => {
        state.pagination = paginate(pagination);
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}