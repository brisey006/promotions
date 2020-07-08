<template>
     <!--Modal Start-->
    <div class="modal fade effect-scale" :id="modalId" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Price</h5>
                    <button type="button" id="closeAddPriceModal" class="close" data-dismiss="modal" aria-label="Close">
                        <x-icon class="custom-class" />
                    </button>
                </div>
                <div class="modal-body pd-y-20">
                    <div class="row">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Currency:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <select class="form-control form-control-sm" v-model="currency">
                                <option value="">Choose currency</option>
                                <option v-for="currency in currencies" :key="currency._id" :value="currency._id">{{currency.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span><strike>Was:</strike></label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="was" name="was" placeholder="Original Price" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Now:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="now" name="now" placeholder="Current Price" type="text">
                        </div>
                    </div>
                </div>
                
                <div>
                    <div v-if="addPriceStatus.loading" class="modal-footer">
                        <button class="btn btn-primary" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                    </div>
                    <div v-else class="modal-footer">
                        <button type="button" @click="addPrice()" class="btn btn-primary">Add</button>
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
    name: 'AddPrice',
    components: {
        XIcon
    },
    props: ["modalId", "promotion"],
    computed: mapGetters({
        currencies: 'currencies/getCurrencies',
        addPriceStatus: 'promotions/getAddPriceStatus'
    }),
    watch: {
        addPriceStatus(val, old) {
            if (val.status == 'added') {
                document.getElementById('closeAddPriceModal').click();
            }
        }
    },
    methods: {
        ...mapActions({
            addPromotionPrice: 'promotions/addPromotionPrice'
        }),
        addPrice() {
            const { currency, was, now } = this;
            const data = { currency, was, now };
            this.addPromotionPrice(data);
        }
    },
    data() {
        return {
            currency: '',
            was: '',
            now: ''
        };
    }
}
</script>