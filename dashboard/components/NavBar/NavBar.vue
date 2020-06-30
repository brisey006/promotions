<template>
  <client-only>
    <div class="page-header">
      <div class="search-form">
        <form action="#" method="GET">
          <div class="input-group">
            <input
              class="form-control search-input typeahead"
              name="search"
              placeholder="Type something..."
              type="text"
            />
            <span class="input-group-btn">
              <span id="close-search">
                <x-icon class="custom-class"></x-icon>
              </span>
            </span>
          </div>
        </form>
      </div>
      <nav class="navbar navbar-default">
        <!--================================-->
        <!-- Brand and Logo Start -->
        <!--================================-->
        <div class="navbar-header">
          <div class="navbar-brand">
            <ul class="list-inline">
              <!-- Mobile Toggle and Logo -->
              <li class="list-inline-item">
                <a class="hidden-md hidden-lg" href="#" id="sidebar-toggle-button">
                  <menu-icon class="custom-class" size="20"></menu-icon>
                </a>
              </li>
              <!-- PC Toggle and Logo -->
              <li class="list-inline-item">
                <a class="hidden-xs hidden-sm" href="#" id="collapsed-sidebar-toggle-button">
                  <menu-icon class="custom-class" size="20"></menu-icon>
                </a>
              </li>
              <li class="list-inline-item mg-l-10">
                <a href="#" id="search-button">
                  <search-icon class="custom-class" size="20" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="header-right pull-right">
          <ul class="list-inline justify-content-end">
            <!-- To add othe nav stuff here -->
            <NavProfile />
          </ul>
        </div>
        <!--/ Header Right End -->
      </nav>
    </div>
    <!--/ Page Header End -->
  </client-only>
</template>

<script>
import NavProfile from '@/components/NavBar/NavProfile';
import NavNotifications from '@/components/NavBar/NavNotifications';
import { XIcon, MenuIcon, SearchIcon } from 'vue-feather-icons';



export default {
    name: 'NavBar',
    components: {
      NavProfile,
      NavNotifications,
      XIcon,
      MenuIcon,
      SearchIcon
    }
}
</script>

<style>

</style>