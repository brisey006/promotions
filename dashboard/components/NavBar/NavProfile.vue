<template>
  <!-- Profile Dropdown Start -->
                <!--================================-->
                <li class="list-inline-item dropdown" v-if="user">
                  <a
                    href
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      v-if="user.image != undefined"
                      :src="apiHost + user.image.thumbnail +'?rand='+Math.random()"
                      class="img-fluid wd-30 ht-30 rounded-circle"
                      alt
                    />
                  </a>
                  <div class="dropdown-menu dropdown-menu-right dropdown-profile">
                    <div class="user-profile-area">
                      <div class="user-profile-heading">
                        <div class="profile-text">
                          <h6>{{user.firstName}}</h6>
                          <span>{{user.email}}</span>
                        </div>
                      </div>
                      <nuxt-link :to="'/users/'+user._id" class="dropdown-item">
                        <i data-feather="user" class="wd-16 mr-2"></i> Profile & Settings
                      </nuxt-link>
                      <a href class="dropdown-item">
                        <i data-feather="life-buoy" class="wd-16 mr-2"></i> Support
                      </a>
                      <a @click="logout" href="/logout" class="dropdown-item">
                        <i data-feather="power" class="wd-16 mr-2"></i> Sign-out
                      </a>
                    </div>
                  </div>
                </li>
                <!-- Profile Dropdown End -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'NavProfile',
    computed: mapGetters({
      apiHost: 'general/apiHost',
      user: 'auth/getUser'
    }),
    methods: {
      ...mapActions({
        logoutUser: 'auth/logoutUser'
      }),
      async logout(e) {
        e.preventDefault();
        this.logoutUser();
      }
    },
    watch: {
      user: function (n, o) {
        if (o != null && n == null) {
          this.$router.push('/login');
        }
      }
    }
}
</script>

<style>
  .user-profile-heading{
    box-sizing: content-box;
  }
</style>