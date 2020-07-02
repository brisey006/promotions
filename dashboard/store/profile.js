const state = () => ({
    data: undefined
});

const getters = {
    data: (state) => state.data,
};

const actions = {
    async getUserProfile ({ commit, dispatch }, payload) {
        try {
            const response = await this.$axios.$get('/users/'+ payload);
            commit('setProfile', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async editUserProfile ({ commit }, payload) {
        try {
            const response = await this.$axios.$put('/users/'+ payload.id, payload.data);
            if (response.nModified == 1) {
                const data = await this.$axios.$get('/users/'+ payload.id);
                const dateString = this.$moment(data.dateOfBirth).format("Do MMM YY");
                commit('setProfile', { ...data, dateString });
            }
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    }
};

const mutations = {
    setProfile: (state, data) => state.data = data
};

export default {
    state,
    getters,
    actions,
    mutations
}