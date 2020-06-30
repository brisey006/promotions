<template>
     <!--Modal Start-->
    <div class="modal fade effect-scale" id="modalForumTopic" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New User</h5>
                    <button type="button" id="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                        <x-icon class="custom-class"></x-icon>
                    </button>
                </div>
                <div class="modal-body pd-y-20">
                    <div class="row">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span> First Name:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="firstName" name="firstName" placeholder="First Name" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span> Last Name:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="lastName" name="lastName" placeholder="Last Name" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span> Email:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="email" name="email" placeholder="Email" type="email">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span> User Type:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <client-only>
                                <v-select name="userType" label="key" :reduce="d => d.value" :options="userTypeOptions" v-model="userType" placeholder="Select User Type"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
                <div v-if="addUserStatus.loading" class="modal-footer">
                    <button class="btn btn-primary" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
                <div v-else class="modal-footer">
                    <button type="button" @click="saveUser()" class="btn btn-primary">Create User</button>
                </div>
            </div>
        </div>
    </div>
    <!--/ Modal End-->
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { XIcon } from 'vue-feather-icons';
export default {
    name: 'AddUser',
    components: {
        XIcon
    },
    props: ["params"],
    computed: mapGetters({
        addUserStatus: 'users/getAddUserStatus',
        userRoles: 'general/getUserRoles'
    }),
    watch: {
        addUserStatus (val, old) {
            if (val.id != undefined) {
                document.getElementById('closeModal').click();
                this.$router.push(`/users/${val.id}`);
            }
        },
        userRoles (val, old) {
            if (val != undefined) {
                const array = [];
                Object.keys(val).forEach(key => {
                    array.push({
                        key: key.indexOf('_') > -1 ? key.replace('_', ' ') : key,
                        value: val[key]
                    });
                });
                this.userTypeOptions = array;
            }
        }
    },
    methods: {
        ...mapActions({
            addUser: 'users/addUser'
        }),
        async saveUser() {
            const { firstName, lastName, email, userType } = this;
            this.addUser({ firstName, lastName, email, userType });
        },
        resetForm() {
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.userType = '';
        }
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
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
    }
}
</script>