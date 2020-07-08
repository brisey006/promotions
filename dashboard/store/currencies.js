import paginate from '../static/js/paginate';

const state = () => ({
    imageKeys: null,
    currencies: {},
    currency: null,
    pagination: null,
    addCurrencyStatus: {
        loading: false
    },
    editCurrenciesStatus: {
        loading: false
    },
});

const getters = {
    getAddCurrencyStatus: (state) => state.addCurrencyStatus,
    getEditCurrenciesStatus: (state) => state.editCurrenciesStatus,
    getPagination: (state) => state.pagination,
    getCurrencies: (state) => state.currencies,
    getCurrency: (state) => state.currency
};

const actions = {
    async fetchCurrencies ({ commit, dispatch }, payload) {
        try {
            let response = await this.$axios.$get('/settings/currencies', {
                params: {
                    ...payload
                }
            });
            if (response.docs.length == 0 && response.totalDocs > 0) {
                response = await this.$axios.$get(`/settings/currencies?limit=${payload.limit}&page=1`);
            }

            const data = response;
            const docs = [];
            let count = data.limit * (data.page -1);
            data.docs.forEach(currency => {
                count += 1;
                const created = this.$moment(currency.createdAt).format("Do MMM YY");
                const updated = this.$moment(currency.updatedAt).format("Do MMM YY");
                const setting = { ...currency, index: count, created, updated };
                docs.push(setting);
            });

            commit('setCurrencies', docs);
            delete response.docs;
            commit('setPagination', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async fetchCurrency ({ commit, dispatch }, slug) {
        try {
            let response = await this.$axios.$get('/settings/currencies/'+slug);
            commit('setCurrency', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async addCurrency ({ commit, dispatch }, payload) {
        try {
            commit('setCurrencyStatus', { loading: true });
            const result = await this.$axios.$post('/settings/currencies', payload);
            commit('setCurrencyStatus', { loading: false, status: 'added' });
            dispatch('fetchCurrencies');
            dispatch('general/handleUpdated', { ...result, title: result.name }, { root: true });
        } catch (e) {
            commit('setCurrencyStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async editCurrency ({ commit, dispatch }, payload) {
        try {
            commit('setEditCurrenciesStatus', { loading: true });
            const id = payload.id;
            delete payload.id;
            const result = await this.$axios.$put('/settings/currencies/'+id, payload);
            commit('setEditCurrenciesStatus', { loading: false, status: 'updated' });
            dispatch('fetchCurrencies');
            dispatch('general/handleUpdated', { ...result, title: result.name }, { root: true });
        } catch (e) {
            commit('setEditCurrenciesStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async deleteCurrency ({ dispatch }, payload) {
        try {
            const result = await this.$axios.$delete('/settings/currencies/'+payload);
            dispatch('general/handleDeleted', { ...result, title: result.name, id: result._id }, { root: true });
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    }
};

const mutations = {
    setCurrencies: (state, currencies) => state.currencies = currencies,
    setCurrency: (state, data) => state.currency = data,
    setCurrencyStatus: (state, data) => state.addCurrencyStatus = data,
    setEditCurrenciesStatus: (state, data) => state.editCurrenciesStatus = data,
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