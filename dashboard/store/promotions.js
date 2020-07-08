import paginate from '../static/js/paginate';

const state = () => ({
    promotions: {},
    promotion: null,
    addPromotionStatus: {
        loading: false
    },
    editPromotionStatus: {
        loading: false
    },
    cropImageStatus: {
        loading: false
    },
    addPriceStatus: {
        loading: false
    },
    activateStatus: false,
    pagination: null
});

const getters = {
    getPromotions: (state) => {
        return state.promotions;
    },
    getPromotion: (state) => state.promotion,
    getAddPromotionStatus: (state) => state.addPromotionStatus,
    getEditPromotionStatus: (state) => state.editPromotionStatus,
    getCropImageStatus: (state) => state.cropImageStatus,
    getAddPriceStatus: (state) => state.addPriceStatus,
    getActivateStatus: (state) => state.activateStatus,
    getPagination: (state) => state.pagination,
};

const actions = {
    async fetchPromotions ({ commit, dispatch }, payload) {
        try {
            if (payload == undefined) {
                const response = await this.$axios.$get(`/promotions/admin/list`);
                commit('setPromotions', response);
            } else {
                let response = await this.$axios.$get('/promotions/admin/list', {
                    params: {
                        ...payload
                    }
                });
                if (response.docs.length == 0 && response.totalDocs > 0) {
                    response = await this.$axios.$get(`/promotions/admin/list?limit=${payload.limit}&page=1`);
                }
                const docs = [];
                let count = response.limit * (response.page -1);
                response.docs.forEach(promotion => {
                    count += 1;
                    const created = this.$moment(promotion.createdAt).format("Do MMM YY");
                    const updated = this.$moment(promotion.updatedAt).format("Do MMM YY");
                    const expiryDate = this.$moment(promotion.expiry).format("Do MMM YY");
                    const promotionData = { ...promotion, index: count, created, updated, expiryDate };
                    docs.push(promotionData);
                });
                commit('setPromotions', docs);
                delete response.docs;
                commit('setPagination', response);
            }
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async fetchPromotion ({ commit, dispatch }, payload) {
        try {
            commit('setPromotion', null);
            const response = await this.$axios.$get('/promotions/'+ payload);
            commit('setPromotion', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async addPromotion ({ commit, dispatch }, payload) {
        try {
            commit('setAddPromotionStatus', { loading: true });
            const result = await this.$axios.$post('/promotions', payload);
            dispatch('general/handleUpdated', result, { root: true });
            commit('setAddPromotionStatus', { loading: false, slug: result.slug });
        } catch (e) {
            commit('setAddPromotionStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async editPromotion ({ commit, dispatch, state }, payload) {
        try {
            commit('setEditPromotionStatus', { loading: true });
            const result = await this.$axios.$put('/promotions/'+state.promotion._id, payload);
            commit('setEditPromotionStatus', { loading: false, data: result });
            commit('setPromotion', result);
            dispatch('general/handleUpdated', result, { root: true });
        } catch (e) {
            commit('setEditPromotionStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async deletePromotion ({ dispatch, state, commit }) {
        try {
            const result = await this.$axios.$delete('/promotions/'+state.promotion._id);
            commit('setPromotion', null);
            dispatch('general/handleDeleted', { ...result, id: result._id }, { root: true });
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async cropImage({ commit, state, dispatch }, payload) {
        try {
            dispatch('general/handleCropImage', { loading: true }, { root: true });
            const url = `/promotions/${state.promotion._id}/image/crop`;
            const result = await this.$axios.$post(url, payload);
            commit('setPromotion', result);
            dispatch('general/handleCropImage', { loading: false, status: 'uploaded' }, { root: true });
            dispatch('general/handleUpdated', result, { root: true });
        } catch (e) {
            dispatch('general/handleCropImage', { loading: false }, { root: true });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async addPromotionPrice ({ commit, dispatch, state }, payload) {
        try {
            commit('setAddPriceStatus', { loading: true });
            const result = await this.$axios.$post(`/promotions/${state.promotion._id}/add-price`, payload);
            commit('setPromotion', result);
            dispatch('general/handleUpdated', result, { root: true });
            commit('setAddPriceStatus', { loading: false, status: 'added' });
        } catch (e) {
            commit('setAddPriceStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },

    async deletePromotionPrice ({ commit, dispatch, state }, payload) {
        try {
            const result = await this.$axios.$delete(`/promotions/${state.promotion._id}/delete-price?id=${payload}`);
            commit('setPromotion', result);
            dispatch('general/handleDeleted', result, { root: true });
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },

    async activatePromotion ({ commit, dispatch, state }, payload) {
        try {
            commit('setActivateStatus', true);
            const result = await this.$axios.$put(`/promotions/${state.promotion._id}/activate`, payload);
            commit('setActivateStatus', false);
            commit('setPromotion', result);
            
            dispatch('general/handleUpdated', result, { root: true });
        } catch (e) {
            commit('setActivateStatus', false);
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
};

const mutations = {
    setPromotions: (state, data) => state.promotions = data,
    setPromotion: (state, data) => state.promotion = data,
    setPagination: (state, pagination) => {
        state.pagination = paginate(pagination);
    },
    setAddPromotionStatus: (state, data) => state.addPromotionStatus = data,
    setEditPromotionStatus: (state, data) => state.editPromotionStatus = data,
    setAddPriceStatus: (state, data) => state.addPriceStatus = data,
    setActivateStatus: (state, data) => state.activateStatus = data,
    setCropImageStatus: (state, data) => state.cropImageStatus = data,
};

export default {
    state,
    getters,
    actions,
    mutations
}