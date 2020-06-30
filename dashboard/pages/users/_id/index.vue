<template>
    <div class="page-inner">
        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark" v-if="profile">{{profile.fullName}}</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item"><i class="icon ion-ios-home-outline"></i>Dashboard</nuxt-link>
                        <nuxt-link to="/users" class="breadcrumb-item">Users</nuxt-link>
                        <span class="breadcrumb-item active" v-if="profile">{{profile.fullName}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->
        <div class="row clearfix" v-if="profile">
            <user-side-nav />
            <user-main />
            <user-right-nav />           
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import UserSideNav from '@/components/Users/UserSideNav';
import UserRightNav from '@/components/Users/UserRightNav';
import UserMain from '@/components/Users/UserMain';
import { PlusIcon } from 'vue-feather-icons';

export default {
    components: {
        UserSideNav,
        UserRightNav,
        UserMain,
        PlusIcon
    },
    head() {
        return {
            link: [
                { rel: 'stylesheet', href: '/plugins/bootstrap-tagsinput/bootstrap-tagsinput.css' },
                { rel: 'stylesheet', href: '/css/vue-select.css' },
                { rel: 'stylesheet', href: '/plugins/cropperjs/css/cropper.css' },
            ],
            script: [
                { src: '/plugins/bootstrap-tagsinput/bootstrap-tagsinput.js', body: true, ssr: false },
                { src: '/js/init-tag-input.js', body: true, ssr: false },
                { src: '/plugins/dropzone/dropzone.js', body: true, ssr: false, defer: true },
                { src: '/plugins/smartWizard/js/jquery.smartWizard.min.js', body: true, ssr: false, defer: true },
                { src: '/plugins/cropperjs/js/cropper.js', body: true, ssr: false },
            ]
        }
    },
    computed: mapGetters({
        profile: 'users/getProfile',
        imageKeys: 'image-settings/getKeys',
        user: 'auth/getUser',
        userRoles: 'general/getUserRoles'
    }),
    methods: {
        ...mapActions({
            fetchImageKeys: 'image-settings/fetchImageKeys',
            fetchProfile: 'users/fetchProfile'
        }),
    }, 
    created() {
        this.fetchProfile(this.$route.params.id);
        this.fetchImageKeys();
    }
}
</script>