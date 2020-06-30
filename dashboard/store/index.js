export const actions = {
    async nuxtServerInit ({ dispatch, rootState }, { req, app }) {
        let token;
        try {
            token = req.headers.cookie.split('; ')
            .find(row => row.startsWith('token'))
            .split('=')[1];
        } catch (e) {};

        app.$axios.setToken(token, 'Bearer');

        if (rootState.auth.user == null) {
            await dispatch('auth/loginUserWithToken');
        }
        
    }
}