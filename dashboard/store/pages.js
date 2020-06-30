import moment from 'moment';
import paginate from '../static/js/paginate';

const state = () => ({
    pages: {},
    pagination: null,
    addPageStatus: {
        loading: false
    },
    editPageStatus: {
        loading: false
    }
});

const getters = {
    getPagesData: (state) => {
        return state.pages;
    },
    getAddPageStatus: (state) => state.addPageStatus,
    getEditPageStatus: (state) => state.editPageStatus,
    getPagination: (state) => state.pagination,
};

const actions = {
    async fetchPages ({ commit, dispatch }, payload) {
        try {
            let response = await this.$axios.$get('/sellers', {
                params: {
                    ...payload
                }
            });
            if (response.docs.length == 0 && response.totalDocs > 0) {
                response = await this.$axios.$get(`/sellers?limit=${payload.limit}&page=1`);
            }
            commit('setPages', response);
            delete response.docs;
            commit('setPagination', response);
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async addPage ({ commit, dispatch }, payload) {
        try {
            commit('setAddPageStatus', { loading: true });
            const result = await this.$axios.$post('/sellers', payload);
            commit('setAddPageStatus', { loading: false, slug: result.slug });
        } catch (e) {
            commit('setAddPageStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async editPage ({ commit, dispatch }, payload, id) {
        try {
            commit('setEditPageStatus', { loading: true });
            const result = await this.$axios.$put('/sellers/'+payload.id, payload.data);
            commit('setEditPageStatus', { loading: false, data: result });
            commit('shop/setShopData', result, { root: true });
            dispatch('general/handleUpdated', { ...result, title: result.name }, { root: true });
        } catch (e) {
            commit('setEditPageStatus', { loading: false });
            dispatch('general/handleRequestError', e, { root: true });
        }
    },
    async deleteShop ({ dispatch }, payload) {
        try {
            const result = await this.$axios.$delete('/sellers/'+payload);
            dispatch('general/handleDeleted', { ...result, title: result.name, id: result._id }, { root: true });
        } catch (e) {
            dispatch('general/handleRequestError', e, { root: true });
        }
    }
};

const mutations = {
    setPages: (state, pages) => {
        const data = pages;
        const docs = [];
        let count = data.limit * (data.page -1);
        data.docs.forEach(page => {
            count += 1;
            const created = moment(page.createdAt).format("Do MMM YY");
            const updated = moment(page.updatedAt).format("Do MMM YY");
            const userPage = { ...page, index: count, created, updated };
            docs.push(userPage);
        });
        state.pages = docs;
    },
    setPagination: (state, pagination) => {
        state.pagination = paginate(pagination);
    },
    setAddPageStatus: (state, data) => state.addPageStatus = data,
    setEditPageStatus: (state, data) => state.editPageStatus = data
};

export default {
    state,
    getters,
    actions,
    mutations
}