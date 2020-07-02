<template>
  <!-- Page Sidebar Start -->
      <!--================================-->
      <div class="page-sidebar">
        <div class="logo">
          <nuxt-link class="logo-img" to="/">
            <img class="desktop-logo" src="~/assets/images/logo.png" alt="">
            <img class="small-logo" src="~/assets/images/small-logo.png" alt />
          </nuxt-link>
          <a id="sidebar-toggle-button-close">
            <x-icon class="custom-class" size="20"></x-icon>
          </a>
        </div>
        <!--================================-->
        <!-- Sidebar Menu Start -->
        <!--================================-->
        <div v-if="userRoles != null && user != null" class="page-sidebar-inner">
          <div class="page-sidebar-menu">
            <ul class="accordion-menu">
              <li class="mg-l-20-force mg-t-25-force menu-navigation">Reports</li>
              <li>
                <nuxt-link to="/">
                  <home-icon class="custom-class"></home-icon>
                  <span>Dashboard</span>
                </nuxt-link>
              </li>
              <li class="mg-l-20-force mg-t-25-force menu-navigation">Manage</li>
              <li v-if="user.userType == userRoles.SUPER_USER">
                <nuxt-link to="/users">
                    <users-icon class="custom-class"></users-icon>
                    <span>Users</span>
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/pages">
                  <briefcase-icon class="custom-class" />
                  <span>Shop Pages</span>
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/promotions">
                  <gift-icon class="custom-class" />
                  <span>Promotions</span>
                </nuxt-link>
              </li>
              <li class="mg-l-20-force mg-t-25-force menu-navigation">Settings</li>
              <li>
                <nuxt-link to="/settings/images">
                    <image-icon class="custom-class"></image-icon>
                    <span>Image Settings</span>
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
        <!--/ Sidebar Menu End -->
        <!--================================-->
      </div>
      <!--/ Page Sidebar End -->
</template>

<script>

import { HomeIcon, UsersIcon, BriefcaseIcon, XIcon, GiftIcon, ImageIcon } from 'vue-feather-icons';
import { mapGetters } from 'vuex';

export default {
    name: 'SideBar',
    components: {
      HomeIcon,
      UsersIcon,
      BriefcaseIcon,
      XIcon,
      GiftIcon,
      ImageIcon
    },
    computed: mapGetters({
        user: 'auth/getUser',
        userRoles: 'general/getUserRoles'
    }),
}
</script>

<style>
  .logo-text{
    color: #ffffff;
    font-weight: 700;
    font-size: 1.5rem;
  }
  a.nuxt-link-exact-active.activeLink,
  a.nuxt-link-exact-active.activeLink svg {
    color: #7d0fec;
  }
  .logo a.logo-img img{
    max-height: 30px;
  }
</style>