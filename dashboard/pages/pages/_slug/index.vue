<template>
    <div class="page-inner">
        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark" v-if="shop">{{shop.name}}</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item"><i class="icon ion-ios-home-outline"></i>Dashboard</nuxt-link>
                        <nuxt-link to="/pages" class="breadcrumb-item">Shop Pages</nuxt-link>
                        <span class="breadcrumb-item active" v-if="shop">{{shop.name}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->

        <div class="row clearfix" v-if="shop">
            <shop-side-nav />
            <div class="col-md-8 col-lg-9 col-xl-9">
                
            </div>
            <!--/ Heard Card End -->               
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ShopSideNav from '@/components/Shop/ShopSideNav';
import { PlusIcon } from 'vue-feather-icons';

export default {
    components: {
        ShopSideNav,
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
        shop: 'shop/data',
        imageKeys: 'image-settings/getKeys',
    }),
    methods: {
        ...mapActions({
            getShopData: 'shop/getShopData',
            getSellerPromotionsData: 'shop/getSellerPromotionsData',
            fetchImageKeys: 'image-settings/fetchImageKeys',
        }),
    }, 
    created() {
        this.getShopData(this.$route.params.slug);
        this.fetchImageKeys();
        this.getSellerPromotionsData(this.$route.params.slug);
    }
}
</script>