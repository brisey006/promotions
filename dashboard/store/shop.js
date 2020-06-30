const state = () => ({
    data: undefined,
    promotionsData: undefined,
    promotion: undefined,
});

const getters = {
    data: (state) => state.data,
    promotionsData: (state) => state.promotionsData,
    promotion: (state) => state.promotion
};

const actions = {
    async getShopData ({ commit, dispatch }, payload) {
        try {
            commit('setShopData', undefined);
            const response = await this.$axios.$get('/sellers/'+ payload);
            commit('setShopData', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async getSellerPromotionsData ({ commit }, payload) {
        const response = await this.$axios.$get('/promotions/seller/'+payload);
        commit('setSellerPromotionsData', response);
    },
    async getPromotionData ({ commit }, payload) {
        commit('setPromotionData', undefined);
        const response = await this.$axios.$get('/promotions/promo/'+payload);
        commit('setPromotionData', response);
    },
    async cropImage({ commit, state, dispatch }, payload) {
        try {
            dispatch('general/handleCropImage', { loading: true }, { root: true });
            const url = `/sellers/${state.data._id}/image/crop`;
            const result = await this.$axios.$post(url, payload);
            commit('setShopData', result);
            dispatch('general/handleCropImage', { loading: false, status: 'uploaded' }, { root: true });
            dispatch('general/handleUpdated', { ...result, title: result.name }, { root: true });
        } catch (e) {
            dispatch('general/handleCropImage', { loading: false }, { root: true });
            dispatch('general/handleRequestError', e, { root: true });
        }
    }
};

const mutations = {
    setShopData: (state, data) => (state.data = data),
    setSellerPromotionsData: (state, data) => (state.promotionsData = data),
    setPromotionData: (state, data) => (state.promotion = data)
};

export default {
    state,
    getters,
    actions,
    mutations
}