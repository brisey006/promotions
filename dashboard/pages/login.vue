<template>
  <div class="login-right">
      <div class="login-right-wrap wd-300">
          <div class="lock-user">
            <h4 class="mg-b-30 tx-semibold">Sign In</h4>
            <p class="tx-gray-500">Please sign in to continue!</p>
          </div>
          <!-- Form -->
          <div>
            <div class="form-group">
                <input class="form-control" type="email" v-model="email" placeholder="Email">
            </div>
            <div class="form-group">
                <input class="form-control" type="password" v-model="password" placeholder="Password">
            </div>
            <div class="alert alert-danger" role="alert" v-for="error in errors" :key="error">
              {{error}}
            </div>
            <div class="form-group mb-0">
              <button v-if="loginLoading" class="btn btn-brand btn-block" disabled>
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing in...
                </button>
                <button v-else class="btn btn-brand btn-block" @click="setAuthData">Sign In</button>
            </div>
          </div>
          <!-- /Form -->
          <div class="tx-gray-500 mg-t-10">Forgot Password? <a href="#" class="tx-semibold">Reset</a></div>
      </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'Login',
    layout: 'auth',
    data() {
      return {
        email: '',
        password: ''
      }
    },
    computed: mapGetters({
      errors: 'auth/getErrors',
      user: 'auth/getUser',
      loginLoading: 'auth/getLoginLoading'
    }),
    methods: {
      ...mapActions({
        loginUser: 'auth/loginUser'
      }),
      setAuthData() {
        const { email, password } = this;
        this.loginUser({ email, password });
      }
    },
    watch: {
      user (value, old) {
        if (value != null) {
          this.$router.push('/');
        }
      }
    }
}
</script>

<style>

</style>