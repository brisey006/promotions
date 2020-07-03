<template>
     <!--Modal Start-->
    <div class="modal fade effect-scale" id="modalAddPage" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" v-if="userRoles" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">New Shop Page</h5>
                <button type="button" id="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                    <x-icon class="custom-class" />
                </button>
            </div>
            <div class="modal-body pd-y-20">
                <div class="row">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Name:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <input class="form-control form-control-sm" v-model="name" name="name" placeholder="Shop Name" type="text">
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Description:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <textarea rows="3" name="description" v-model="description" class="form-control" placeholder="Description"></textarea>
                    </div>
                </div>
                <div v-if="user.userType != userRoles.ADMIN" class="row mg-t-20">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Admin:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <client-only>
                            <v-select name="admin" label="fullName" :filterable="false" :options="sellers" :reduce="user => user._id" @search="fetchOptions" v-model="admin" placeholder="Select Administrator"></v-select>
                        </client-only>
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Email:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <input class="form-control form-control-sm" v-model="email" name="email" placeholder="Email" type="email">
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label">Cell:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <input class="form-control form-control-sm" v-model="cell" name="cell" placeholder="Cell Number" type="text">
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label">Tell:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <input class="form-control form-control-sm" v-model="tell" name="tell" placeholder="Tell Number" type="text">
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Address:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <textarea rows="3" name="physicalAddress" v-model="physicalAddress" class="form-control" placeholder="Physical Address"></textarea>
                    </div>
                </div>
            </div>
            
            <div>
                <div v-if="addPageStatus.loading" class="modal-footer">
                    <button class="btn btn-primary" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
                <div v-else class="modal-footer">
                    <button type="button" @click="saveData()" class="btn btn-primary">Create Page</button>
                </div>
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
    name: 'AddPage',
    components: {
        XIcon
    },
    computed: mapGetters({
        addPageStatus: 'pages/getAddPageStatus',
        userRoles: 'general/getUserRoles',
        user: 'auth/getUser',
    }),
    watch: {
        addPageStatus (val, old) {
            if (val.slug != undefined) {
                document.getElementById('closeModal').click();
                this.$router.push(`/pages/${val.slug}`);
            }
        }
    },
    methods: {
        ...mapActions({
            fetchPages: 'pages/fetchPages',
            addPage: 'pages/addPage'
        }),
        async saveData() {
            let { name, description, email, physicalAddress, cell, tell, admin } = this;
            if (this.user.userType == this.userRoles.ADMIN) {
                admin = this.user._id;
            }
            const data = { name, description, email, address: physicalAddress, cell, tell, administrator: admin };
            this.addPage(data);
        },
        async fetchOptions (search, loading) {
            loading(true);
            const results = await this.$axios.$get(`/sellers/search-users?query=${search}`);
            this.sellers = results.docs;
            loading(false);
        },
    },
    data() {
        return {
            name: '',
            description: '',
            email: '',
            physicalAddress: '',
            cell: '',
            tell: '',
            admin: '',
            sellers: []
        };
    }
}
</script>