<template>
     <!--Modal Start-->
    <div class="modal fade effect-scale" :id="modalId" tabindex="-1" role="dialog" aria-hidden="true">
        <div v-if="userRoles" class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Shop Page</h5>
                <button type="button" :id="'close-'+modalId" class="close" data-dismiss="modal" aria-label="Close">
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
                            <v-select name="admin" label="fullName" :filterable="false" :options="sellers" @search="fetchOptions" v-model="admin" placeholder="Select Administrator"></v-select>
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
                <div v-if="editPageStatus.loading" class="modal-footer">
                    <button class="btn btn-primary" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
                <div v-else class="modal-footer">
                    <button type="button" @click="saveData()" class="btn btn-primary">Save Changes</button>
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
    name: 'EditPage',
    components: {
        XIcon
    },
    computed: mapGetters({
        editPageStatus: 'pages/getEditPageStatus',
        shop: "shop/data",
        userRoles: 'general/getUserRoles',
        user: 'auth/getUser',
    }),
    props: ["modalId"],
    watch: {
        editPageStatus (val, old) {
            if (val.data != undefined) {
                document.getElementById('close-'+this.modalId).click();
            }
        },
        shop (value, old) {
            this.getAvailableData();
        }
    },
    methods: {
        ...mapActions({
            editPage: 'pages/editPage'
        }),
        async saveData() {
            let { name, description, email, physicalAddress, cell, tell, admin } = this;
            if (this.user.userType == this.userRoles.ADMIN) {
                admin = this.user._id;
            } else {
                admin = admin._id;
            }
            const data = { name, description, email, address: physicalAddress, cell, tell, administrator: admin };
            this.editPage({ data, id: this.shop._id });
        },
        async fetchOptions (search, loading) {
            loading(true);
            const results = await this.$axios.$get(`/sellers/search-users?query=${search}`);
            this.sellers = results.docs;
            loading(false);
        },
        getAvailableData() {
            if (this.shop != undefined) {
                const { name, description, email, address, cell, tell, administrator } = this.shop;
                this.name = name;
                this.description = description;
                this.email = email;
                this.physicalAddress = address;
                this.cell = cell;
                this.tell = tell;
                this.admin = administrator;
            }
        }
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
    }, 
    created() {
        this.getAvailableData();
    }
}
</script>