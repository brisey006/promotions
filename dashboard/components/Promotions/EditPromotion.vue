<template>
    <div class="modal fade" :id="modalId" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Profile</h5>
                    <button type="button" :id="'close-'+modalId" class="close" data-dismiss="modal" aria-label="Close">
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
                            <input class="form-control form-control-sm" name="tags" data-role="tagsinput" placeholder="Use commas to seperate tags" :id="tagsInputId" type="text">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" @click="savePromotion()" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// To update tags update

import { mapActions, mapGetters } from 'vuex';
import { XIcon } from 'vue-feather-icons';
export default {
    name: 'EditPromotion',
    components: {
        XIcon
    },
    head: {
        link: [
            {
                rel: "stylesheet",
                href: '/css/vue-select.css'
            },
        ]
    },
    computed: mapGetters({
        editPromotionStatus: 'promotions/getEditPromotionStatus'
    }),
    watch: {
        editPromotionStatus (val, old) {
            if (val.data != undefined) {
                document.getElementById('close-'+this.modalId).click();
            }
        },
    },
    methods: {
        ...mapActions({
            editPromotion: 'promotions/editPromotion'
        }),
        savePromotion() {
            let ex;
            const { title, description, originalPrice, discountedPrice, expiry } = this;
            const tagsArray = $("#"+this.tagsInputId).tagsinput('items');

            if (expiry != null) {
                ex = new Date(`${expiry.substring(0, 4)}-${expiry.substring(4, 6)}-${expiry.substring(6, 8)}`);
            }

            const data = { title, description, originalPrice, discountedPrice, expiry: ex, tagsArray };
            this.editPromotion(data);
        }
    },
    props: ["promotion", "modalId", "tagsInputId"],
    data() {
        const promotion = this.promotion;
        const expiryDate = this.promotion.expiry != null ? moment(new Date(this.promotion.expiry)).format('YYYY/MM/DD') : '';
        return {
            title: promotion.title,
            description: promotion.description,
            originalPrice: promotion.originalPrice,
            discountedPrice: promotion.discountedPrice,
            expiry: expiryDate,
            options: {
                date: true,
                datePattern: ['Y', 'm', 'd']
            },
        };
    },
}
</script>

<style lang="css" scoped>
    .vs__search, .vs__search:focus{
        border: none;
    }
</style>