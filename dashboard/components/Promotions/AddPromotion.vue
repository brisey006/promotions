<template>
     <!--Modal Start-->
    <div class="modal fade effect-scale" id="modalForumTopic" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Promotion</h5>
                    <button type="button" id="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                        <x-icon class="custom-class"></x-icon>
                    </button>
                </div>
                <div class="modal-body pd-y-20">
                    <div class="row">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span> Title:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="title" name="title" placeholder="Title" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Description:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <textarea rows="3" name="description" v-model="description" class="form-control" placeholder="Description"></textarea>
                        </div>
                    </div>
                    <div class="row mg-t-20" v-if="seller == null">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span> Seller:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <client-only>
                                <v-select name="admin" label="name" :filterable="false" :options="sellers" :reduce="seller => seller._id" @search="fetchOptions" v-model="sellerS" placeholder="Select Seller"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><strike>Was</strike></label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="originalPrice" name="originalPrice" placeholder="Original Price" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Now:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="discountedPrice" name="discountedPrice" placeholder="Promotion Price" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Expiry Date:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <client-only>
                                <cleave v-model="expiry" :options="options" class="form-control form-control-sm" name="expiry" placeholder="YYYY/MM/DD"></cleave>
                            </client-only>
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Tags:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" name="tags" data-role="tagsinput" placeholder="Use commas to seperate tags" id="addPromoTags" type="text">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                     <div>
                        <div v-if="addPromotionStatus.loading" class="modal-footer">
                            <button class="btn btn-primary" disabled>
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                        </div>
                        <div v-else class="modal-footer">
                            <button type="button" @click="savePromotion()" class="btn btn-primary">Create Promotion</button>
                        </div>
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
    name: 'AddPromotion',
    components: {
        XIcon
    },
    props: ["params", "seller", "modalId"],
    computed: mapGetters({
        addPromotionStatus: 'promotions/getAddPromotionStatus'
    }),
    watch: {
        addPromotionStatus (val, old) {
            if (val.slug != undefined) {
                document.getElementById('closeModal').click();
                this.$router.push(`/promotions/${val.slug}`);
            }
        }
    },
    methods: {
        ...mapActions({
            addPromotion: 'promotions/addPromotion'
        }),
        async savePromotion() {
            let ex;
            const { title, description, originalPrice, discountedPrice, expiry } = this;
            const tagsArray = $("#addPromoTags").tagsinput('items');
            const seller = this.seller != null ? this.seller : this.sellerS;

            if (expiry != null) {
                ex = new Date(`${expiry.substring(0, 4)}-${expiry.substring(4, 6)}-${expiry.substring(6, 8)}`);
            }
            this.addPromotion({ title, description, originalPrice, discountedPrice, tagsArray, seller, expiry: ex });
        },
        resetForm() {
            this.title = '';
            this.description = '';
            this.originalPrice = '';
            this.discountedPrice = '';
            this.expiry = '';
            this.sellers = [];
            this.sellerS = '';
        },
        async fetchOptions (search, loading) {
            loading(true);
            const results = await this.$axios.$get(`/sellers?query=${search}`);
            this.sellers = results.docs;
            loading(false);
        },
    },
    data() {
        return {
            title: '',
            description: '',
            originalPrice: '',
            discountedPrice: '',
            tags: '',
            expiry: '',
            sellers: [],
            sellerS: '',
            options: {
                date: true,
                datePattern: ['Y', 'm', 'd']
            },
        };
    }
}
</script>