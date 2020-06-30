<template>
  <div>
    <div class="page-container">
      <client-only>
        <notifications position="top right" group="foo" :closeOnClick="false" />
      </client-only>
      <SideBar />
      <div class="page-content">
        <NavBar />
        <nuxt />
        <!--/ Page Footer End -->
      </div>
    </div>
    <a href data-click="scroll-top" class="btn-scroll-top fade">
      <i class="fa fa-arrow-up"></i>
    </a>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import NavBar from '@/components/NavBar/NavBar';
import Footer from "@/components/AppFooter";

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'default',
  components: {
    SideBar,
    NavBar,
    Footer
  },
  head: {
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    link: [
      {
        rel: "stylesheet",
        href: '/plugins/daterangepicker/daterangepicker.css'
      },
    ],
  },
  computed: mapGetters({
    user: 'auth/getUser',
    errors: 'general/getErrors',
    deletedItem: 'general/getDeletedItem',
    updatedItem: 'general/getUpdatedItem'
  }),
  methods: {
    ...mapActions({
      fetchUserRoles: 'general/fetchUserRoles'
    }),
  },
  created() {
    this.fetchUserRoles();
    this.$axios.setToken(this.user.token, 'Bearer');
  },
  watch: {
    errors (newValue, oldvalue) {
      const notify = this.$notify;

      if (newValue != undefined) {
        const errors = newValue.array;
        let i = 0;
        let inte = setInterval(() => {
            
            notify({
                group: 'foo',
                title: `Error ${i+ 1}`,
                text: errors[i],
                type: 'error',
                duration: 3000
            });

            if (errors.length - 1 == i) clearInterval(inte);
            i++;
        }, 250);
      }
    },
    deletedItem (val, old) {
      if (val != undefined) {
        this.$notify({
            group: 'foo',
            title: `Deleted Message`,
            text: `${val.title} was deleted successfully!`,
            type: 'success',
            duration: 3000
        });
      }
    },
    updatedItem (val, old) {
      if (val != undefined) {
        this.$notify({
            group: 'foo',
            title: `Update Message`,
            text: `${val.title} was updated successfully!`,
            type: 'success',
            duration: 3000
        });
      }
    }
  }
};
</script>

<style>
.vue-notification {
  margin-top: 5px;
}
</style>
