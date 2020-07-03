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
            <li v-if="promotion.seller.name" class="d-flex align-items-center mg-b-15">
                <div class="media-body lh-2">
                    <p class="tx-medium mg-b-2">Seller: <span class="tx-12 tx-gray-500">{{promotion.seller.name}}</span></p>
                </div>
            </li>
            <li v-if="promotion.originalPrice" class="d-flex align-items-center mg-b-15">
                <div class="media-body lh-2">
                    <p class="tx-medium mg-b-2"><s>Was:</s> <span class="tx-12 tx-gray-500">${{promotion.originalPrice}}</span></p>
                </div>
            </li>
            <li v-if="promotion.discountedPrice" class="d-flex align-items-center mg-b-15">
                <div class="media-body lh-2">
                    <p class="tx-medium mg-b-2">Now: <span class="tx-12 tx-gray-500">${{promotion.discountedPrice}}</span></p>
                </div>
            </li>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Edit2Icon } from 'vue-feather-icons';
import EditPromotion from '@/components/Promotions/EditPromotion';
import AddImage from '@/components/AddImage';

export default {
  name: "PromotionSideNav",
  components: {
    EditPromotion,
    AddImage,
    Edit2Icon
  },
  computed: mapGetters({
    promotion: "promotions/getPromotion",
    apiHost: 'general/apiHost',
    imageKeys: 'image-settings/getKeys'
  }),
  methods: {
    ...mapActions({
      fetchImageSetting: 'image-settings/fetchImageSetting',
      cropImage: 'promotions/cropImage'
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
    }
  }
};
</script>