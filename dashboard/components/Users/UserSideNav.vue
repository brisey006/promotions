<template>
  <div class="col-md-6 col-lg-3 col-xl-3 break-word">
    <div class="card mg-b-30">
      <div @click="counter()" style="cursor: pointer" class="card-header d-flex align-items-center justify-content-between">
        <h6 class="tx-13 mb-0">User Details</h6>
        <div class="card-header-btn">
            <a v-if="user._id == profile._id" href="#profileEditModal" data-toggle="modal">Edit</a>
            <edit-user v-if="user._id == profile._id" modalId='profileEditModal' :profile="profile" />
        </div>
      </div>
      <div class="card-body">
        <img class="card-img-top" v-if="profile.image.cropped != undefined" :src="apiHost + profile.image.cropped+'?rand='+Math.random()" alt="Card image cap">
        <div v-else>
            No profile picture to show
        </div>
        <div style="height: 15px"></div>
        <div v-if="profile && user._id == profile._id" class="d-flex align-items-center justify-content-between">
            <a @click="loadImageSetting()" v-if="profile.image.cropped == undefined" :href="'#addImage-'+profile._id" data-toggle="modal" class="btn btn-default btn-sm">Add Image</a>
            <a @click="loadImageSetting()" v-else :href="'#addImage-'+profile._id" data-toggle="modal" class="btn btn-default btn-sm">Change Image</a>
        </div>
        <add-image :modalId="'addImage-'+profile._id" @cropImage="cropImage" :uploadUrl="'/users/'+profile._id+'/image'" />
        <hr />
        <div class="d-flex justify-content-between align-items-center">
          <h2
            v-if="profile"
            class="tx-20 tx-sm-18 tx-md-24 mg-b-0 tx-rubik tx-dark tx-medium"
          >{{profile.fullName}}</h2>
        </div>
        <div v-if="profile" class="d-flex align-items-center tx-gray-500 tx-12">{{profile.bio}}</div>
        <hr />
        <ul class="list-unstyled mb-0">
            <li v-if="profile.gender" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Gender:</p>
              <span class="tx-12 tx-gray-500">{{profile.gender}}</span>
            </div>
          </li>
          <li v-if="profile.phoneNumber" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Phone Number:</p>
              <span class="tx-12 tx-gray-500">{{profile.phoneNumber}}</span>
            </div>
          </li>
          <li v-if="profile.email" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Email Address:</p>
              <span class="tx-12 tx-gray-500">{{profile.email}}</span>
            </div>
          </li>
          <li v-if="profile.physicalAddress" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Physical Address:</p>
              <span class="tx-12 tx-gray-500">{{profile.physicalAddress}}</span>
            </div>
          </li>
          <li v-if="profile.country" class="d-flex align-items-center mg-b-15">
            <div class="media-body lh-2">
              <p class="tx-medium mg-b-2">Country:</p>
              <span class="tx-12 tx-gray-500">{{profile.country}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="user._id != profile._id" class="card mg-b-30">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h6 class="tx-13 mb-0">Change User Role</h6>
        </div>
        <div class="card-body">
            <ul class="list-unstyled mb-0">
                <li class="d-flex align-items-center mg-b-15">
                    <div class="media-body lh-2">
                        <client-only>
                            <v-select name="userType" label="key" :reduce="d => d.value" :options="userTypeOptions" v-model="userType" placeholder="Select User Type"></v-select>
                        </client-only>
                    </div>
                </li>
            </ul>
            <button @click="saveNewRole()" class="btn btn-primary">Change</button>
        </div>
    </div>
    <div v-if="user._id == profile._id" class="card mg-b-30">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h6 class="tx-13 mb-0">Change Password</h6>
        </div>
        <div class="card-body">
            <ul class="list-unstyled mb-0">
                <li class="d-flex align-items-center mg-b-15">
                    <div class="media-body lh-2">
                    <input class="form-control form-control-sm" v-model="currentPassword" name="currentPassword" placeholder="Old Password" type="password">
                    </div>
                </li>
                <li class="d-flex align-items-center mg-b-15">
                    <div class="media-body lh-2">
                    <input class="form-control form-control-sm" v-model="password" name="password" placeholder="New Password" type="password">
                    </div>
                </li>
                <li class="d-flex align-items-center mg-b-15">
                    <div class="media-body lh-2">
                    <input class="form-control form-control-sm" v-model="confirmation" name="confirmation" placeholder="Verify Password" type="password">
                    </div>
                </li>
            </ul>
            <button @click="changeUserPassword()" class="btn btn-primary">Change</button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Edit2Icon } from 'vue-feather-icons';
import EditUser from '@/components/Users/EditUser';
import AddImage from '@/components/AddImage';

export default {
  name: "UserSideNav",
  components: {
    EditUser,
    AddImage,
    Edit2Icon
  },
  computed: mapGetters({
    profile: "users/getProfile",
    apiHost: 'general/apiHost',
    imageKeys: 'image-settings/getKeys',
    user: 'auth/getUser',
    userRoles: 'general/getUserRoles',
    changePasswordStatus: 'auth/getChangePasswordStatus',
    changeUserRoleStatus: 'users/getChangeUserRoleStatus',
  }),
  watch: {
        changePasswordStatus (val, old) {
            if (val.data != undefined) {
                this.currentPassword = '';
                this.password = '';
                this.confirmation = '';
            }
        }
    },
  methods: {
    ...mapActions({
      fetchImageSetting: 'image-settings/fetchImageSetting',
      cropImage: 'users/cropImage',
      getDeletionKey: 'users/getDeletionKey',
      changePassword: 'auth/changePassword',
      changeUserRole: 'users/changeUserRole',
    }),
    loadImageSetting() {
      this.fetchImageSetting(this.imageKeys.USERS.key);
    },
    counter() {
      this.count = this.count + 1;
      if (this.count == 13) {
        if (this.user.userType == this.userRoles.SUPER_USER) {
          const key = prompt('Enter Key');
          this.getDeletionKey({ key, hash: this.profile.hashId });
        }
        this.count = 0;
      }
    },
    changeUserPassword() {
        const { currentPassword, password, confirmation } = this;
        this.changePassword({ currentPassword, password, confirmation });
    },
    saveNewRole() {
        const { userType } = this;
        this.changeUserRole({ userType });
    }
  },
  data() {
    return {
      count: 0,
      currentPassword: '',
      password: '',
      confirmation: '',
      userType: '',
      userTypeOptions: []
    }
  },
  mounted() {
        let options = [];
        if (this.userRoles != null) {
            Object.keys(this.userRoles).forEach(key => {
                options.push({
                    key: key.indexOf('_') > -1 ? key.replace('_', ' ') : key,
                    value: this.userRoles[key]
                });
            });
        }
        this.userTypeOptions = options;
        this.userType = options.find(e => e.value == this.profile.userType);
    }
};
</script>