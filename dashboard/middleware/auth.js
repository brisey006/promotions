export default async function ({ store, redirect, route, $axios, req }) {
    if (store.state.auth.user == null) {
        if (route.path != '/login') {
            return redirect('/login');
        }
    } else {
        let token = store.state.auth.user.token;
        $axios.setToken(token, 'Bearer');
        if (route.path == '/login') {
            return redirect('/');
        }
    }
}