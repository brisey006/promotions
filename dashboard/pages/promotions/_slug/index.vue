<template>
    <div class="page-inner">

        

        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div v-if="promotion">
                <div class="alert alert-danger" v-if="promotion.image == null" role="alert">
                    Add a product image to activate promotion!
                </div>
                <div class="alert alert-danger" v-if="promotion.prices.length == 0" role="alert">
                    Add a price to activate promotion!
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark" v-if="promotion">{{promotion.title}}</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item"><i class="icon ion-ios-home-outline"></i>Dashboard</nuxt-link>
                        <nuxt-link to="/promotions" class="breadcrumb-item">Promotions</nuxt-link>
                        <span class="breadcrumb-item active" v-if="promotion">{{promotion.title}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->

        <div class="row clearfix" v-if="promotion">
            <promotion-side-nav />
            <div class="col-md-8 col-lg-9 col-xl-10">
                
            </div>
            <!--/ Heard Card End -->           
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PromotionSideNav from '@/components/Promotions/PromotionSideNav';
import { PlusIcon } from 'vue-feather-icons';

export default {
    components: {
        PromotionSideNav,
        PlusIcon
    },
    head() {
        return {
            link: [
                { rel: 'stylesheet', href: '/plugins/bootstrap-tagsinput/bootstrap-tagsinput.css' },
                { rel: 'stylesheet', href: '/css/vue-select.css' },
                { rel: 'stylesheet', href: '/plugins/cropperjs/css/cropper.css' },
            ],
        }
    },
    computed: mapGetters({
        promotion: 'promotions/getPromotion',
        imageKeys: 'image-settings/getKeys',
    }),
    methods: {
        ...mapActions({
            fetchImageKeys: 'image-settings/fetchImageKeys',
            fetchPromotion: 'promotions/fetchPromotion',
            fetchCurrencies: 'currencies/fetchCurrencies',
        }),
    }, 
    created() {
        this.fetchPromotion(this.$route.params.slug);
        this.fetchImageKeys();
        this.fetchCurrencies();
    }
}
</script>