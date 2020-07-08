<template>
  <div class="col-md-4 col-lg-3 col-xl-3 break-word">
    <div class="card mg-b-30">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h6 class="tx-13 mb-0">Promotion Details</h6>
        <div class="card-header-btn">
            <a @click="refreshTagsInput()" href="#promotionEditModal" data-toggle="modal" class="btn btn-default btn-sm">Edit</a>
            <edit-promotion modalId='promotionEditModal' tagsInputId='promotionTagsEdit' :promotion="promotion" />
        </div>
      </div>
      <div class="card-body">
        <img class="card-img-top" v-if="promotion.image != undefined" :src="apiHost + promotion.image.cropped+'?rand='+Math.random()" alt="Card image cap">
        <div v-else>
            No product picture to show
        </div>
        <div v-if="promotion" class="d-flex align-items-center justify-content-between">
            <a @click="loadImageSetting()" v-if="promotion.image == undefined" :href="'#addImage-'+promotion._id" data-toggle="modal">Add Image</a>
            <a @click="loadImageSetting()" v-else :href="'#addImage-'+promotion._id" data-toggle="modal">Change Image</a>
        </div>
        <add-image :modalId="'addImage-'+promotion._id" @cropImage="cropImage" :uploadUrl="'/promotions/'+promotion._id+'/image'" />
        <hr />
        <div class="d-flex justify-content-between align-items-center">
          <h2
            v-if="promotion"
            class="tx-20 tx-sm-18 tx-md-24 mg-b-0 tx-rubik tx-dark tx-medium"
          >{{promotion.title}}</h2>
        </div>
        <div v-if="promotion" class="d-flex align-items-center tx-gray-500 tx-12">{{promotion.description}}</div>
        <hr />
        <ul class="list-unstyled mb-0">
            <li v-if="promotion.tags" class="d-flex align-items-center mg-b-15">
                <div class="media-body lh-2">
                <p class="tx-medium mg-b-2">Tags: 
                    <span v-for="tag in promotion.tags" :key="tag._id" class="tx-12 tx-gray-500">
                        <nuxt-link to="">{{tag.name}} </nuxt-link> .
                    </span>
                </p>
                </div>
            </li>
        </ul>
      </div>
    </div>

    <div class="card mg-b-30">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h6 class="tx-13 mb-0">Prices</h6>
        <div class="card-header-btn">
            <a href="#addPrice" data-toggle="modal" class="btn btn-default btn-sm">Add</a>
            <add-price modalId='addPrice' :promotion="promotion" />
        </div>
      </div>
      <div class="row">
          <div class="col-sm-4 col-md-4 col-lg-4 col-xl-12">
            <div v-for="price in promotion.prices" :key="price._id" class="media pd-t-20 pd-x-20">
                <div class="wd-40 ht-40 bg-primary tx-white mg-r-10 mg-md-r-10 d-flex align-items-center justify-content-center rounded">
                  {{price.currency.acronym}}
                </div>
                <div class="media-body">
                  <h6 class="tx-sans tx-uppercase tx-10 tx-spacing-1 tx-gray-500 mg-b-5">NOW</h6>
                  <h5 class="tx-20 tx-sm-18 tx-md-20 tx-success tx-medium tx-rubik mg-b-0">{{price.currency.symbol}}{{price.now}}</h5>
                </div>
                <div class="media-body">
                  <span class="tx-danger ml-auto d-flex align-items-center">{{price.currency.symbol}}{{price.was}}</span>
                  <p class="tx-12 tx-gray-500"><strike>WAS</strike></p>
                </div>
                <div class="small ft-right">
                  <a :href="'#del-'+price._id" data-toggle="modal">
                    <trash2-icon class="custom-style" size="16" />
                  </a>
                  <delete-alert :id="'del-'+price._id" @deleteItem="deletePrice" :itemId="price._id" :title="price.currency.name+' price'" />
                </div>
            </div>
            <div class="pd-b-20"></div>
          </div>
      </div>
      <div class="card-body pd-0">
          
      </div>
    </div>

    <div v-if="promotion.active">
      <button v-if="activateStatus" class="btn btn-danger mg-b-30 w100" >
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
      </button>
      <button v-else class="btn btn-danger mg-b-30 w100" @click="deactivate()">Deactivate</button>
    </div>
    
    <div v-else>
      <button v-if="activateStatus" class="btn btn-success mg-b-30 w100" >
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
      </button>
      <button v-else class="btn btn-success mg-b-30 w100" @click="activate()">Activate</button>
    </div>

    <a class="btn btn-danger mg-b-30" style="width: 100%" data-toggle="modal" :href="'#del-'+promotion._id">Delete</a>
    <delete-alert :id="'del-'+promotion._id" @deleteItem="deleteItem" :itemId="promotion._id" :title="promotion.title" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Edit2Icon, Trash2Icon } from 'vue-feather-icons';
import EditPromotion from '@/components/Promotions/EditPromotion';
import AddImage from '@/components/AddImage';
import AddPrice from '@/components/Promotions/AddPrice';
import DeleteAlert from '@/components/DeleteAlert';

export default {
  name: "PromotionSideNav",
  components: {
    EditPromotion,
    AddPrice,
    AddImage,
    Edit2Icon,
    Trash2Icon,
    DeleteAlert
  },
  computed: mapGetters({
    promotion: "promotions/getPromotion",
    apiHost: 'general/apiHost',
    imageKeys: 'image-settings/getKeys',
    activateStatus: 'promotions/getActivateStatus'
  }),
  watch: {
    promotion(val, old) {
      if (val == null) {
        this.$router.push('/promotions');
      }
    }
  },
  methods: {
    ...mapActions({
      fetchImageSetting: 'image-settings/fetchImageSetting',
      cropImage: 'promotions/cropImage',
      deletePromotion: 'promotions/deletePromotion',
      deletePromotionPrice: 'promotions/deletePromotionPrice',
      activatePromotion: 'promotions/activatePromotion'
    }),
    loadImageSetting() {
      this.fetchImageSetting(this.imageKeys.PROMOTIONS.key);
    },
    refreshTagsInput() {
        $("#promotionTagsEdit").tagsinput('refresh');
        const tags = this.promotion.tags;
        tags.forEach(tag => {
            $("#promotionTagsEdit").tagsinput('add', tag.name);
        });
    },
    activate() {
      this.activatePromotion({ active: true });
    },
    deactivate() {
      this.activatePromotion({ active: false });
    },
    deleteItem() {
      this.deletePromotion();        
    },
    deletePrice(id) {
      this.deletePromotionPrice(id);
    }
  }
};
</script>

<style scoped>
  .w100{
    width: 100%;
  }
</style>