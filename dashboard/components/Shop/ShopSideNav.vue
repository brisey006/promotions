<template>
  <div class="col-md-4 col-lg-3 col-xl-3">
    <div class="card mg-b-30">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h6 class="tx-13 mb-0">Shop Details</h6>
        <div class="card-header-btn">
            <a href="#shopEditModal" data-toggle="modal" class="btn btn-default btn-sm">Edit Page</a>
            <edit-page modalId='shopEditModal' />
        </div>
      </div>
      <div class="card-body">
        <img class="card-img-top" v-if="shop.image.cropped != undefined" :src="apiHost + shop.image.cropped+'?rand='+Math.random()" alt="Card image cap">
        <div v-else>
            No shop image to show
        </div>
        <div v-if="shop" class="d-flex align-items-center justify-content-between">
            <a @click="loadImageSetting()" v-if="shop.image.cropped == undefined" :href="'#addImage-'+shop._id" data-toggle="modal">Add Image</a>
            <a @click="loadImageSetting()" v-else :href="'#addImage-'+shop._id" data-toggle="modal">Change Image</a>
        </div>
        <add-image :modalId="'addImage-'+shop._id" @cropImage="cropImage" :uploadUrl="'/sellers/'+shop._id+'/image'" />
        <hr />
        <div class="d-flex justify-content-between align-items-center">
          <h2
            v-if="shop"
            class="tx-20 tx-sm-18 tx-md-24 mg-b-0 tx-rubik tx-dark tx-medium"
          >{{shop.name}}</h2>
        </div>
        <div v-if="shop" class="d-flex align-items-center tx-gray-500 tx-12">{{shop.description}}</div>
        <hr />
        <p v-if="shop">
          <b>Administrator</b>
          <nuxt-link v-if="shop.administrator != null" :to="'/profile/'+shop.administrator._id">{{shop.administrator.fullName}}</nuxt-link>
        </p>
         <ul class="list-unstyled mb-0">
          <li v-if="shop.cell" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Cell:</p>
              <span class="tx-12 tx-gray-500">{{shop.cell}}</span>
            </div>
          </li>
          <li v-if="shop.tell" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Tell:</p>
              <span class="tx-12 tx-gray-500">{{shop.tell}}</span>
            </div>
          </li>
          <li v-if="shop.email" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Email Address:</p>
              <span class="tx-12 tx-gray-500">{{shop.email}}</span>
            </div>
          </li>
          <li v-if="shop.address" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Physical Address:</p>
              <span class="tx-12 tx-gray-500">{{shop.address}}</span>
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
import EditPage from '@/components/Shop/EditPage';
import AddImage from '@/components/AddImage';

export default {
  name: "ShopSideNav",
  components: {
    EditPage,
    AddImage,
    Edit2Icon
  },
  computed: mapGetters({
    shop: "shop/data",
    apiHost: 'general/apiHost',
    imageKeys: 'image-settings/getKeys'
  }),
  methods: {
    ...mapActions({
      fetchImageSetting: 'image-settings/fetchImageSetting',
      cropImage: 'shop/cropImage'
    }),
    loadImageSetting() {
      this.fetchImageSetting(this.imageKeys.SHOPS.key);
    }
  }
};
</script>