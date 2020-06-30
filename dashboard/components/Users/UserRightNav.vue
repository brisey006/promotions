<template>
  <div class="col-md-6 col-lg-3 col-xl-2">
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
  name: "UserRightNav",
  components: {
    EditUser,
    AddImage,
    Edit2Icon
  },
  computed: mapGetters({
    changePasswordStatus: 'auth/getChangePasswordStatus',
    user: 'auth/getUser',
    profile: 'users/getProfile'
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
        changePassword: 'auth/changePassword'
    }),
    changeUserPassword() {
        const { currentPassword, password, confirmation } = this;
        this.changePassword({ currentPassword, password, confirmation });
    }
  },
  data() {
      return {
          currentPassword: '',
          password: '',
          confirmation: ''
      }
  }
};
</script>