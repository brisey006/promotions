<template>
     <!--Modal Start-->
    <div class="modal fade effect-scale" :id="modalId" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Currency</h5>
                    <button type="button" id="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                        <x-icon class="custom-class" />
                    </button>
                </div>
                <div class="modal-body pd-y-20">
                    <div class="row">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Acronym:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="acronym" placeholder="Currency acronym" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Name:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="name" name="name" placeholder="Currency Name" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Symbol:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="symbol" name="symbol" placeholder="Currency Symbol" type="text">
                        </div>
                    </div>
                </div>
                
                <div>
                    <div v-if="addCurrencyStatus.loading" class="modal-footer">
                        <button class="btn btn-primary" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                    </div>
                    <div v-else class="modal-footer">
                        <button type="button" @click="saveData()" class="btn btn-primary">Submit</button>
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
    name: 'AddCurrency',
    components: {
        XIcon
    },
    props: ["modalId"],
    computed: mapGetters({
        addCurrencyStatus: 'currencies/getAddCurrencyStatus'
    }),
    watch: {
        addCurrencyStatus (val, old) {
            if (val.status == 'added') {
                document.getElementById('closeModal').click();
            }
        }
    },
    methods: {
        ...mapActions({
            addCurrency: 'currencies/addCurrency'
        }),
        async saveData() {
            const { acronym, name, symbol } = this;
            const data = { acronym, name, symbol };
            this.addCurrency(data);
        },
    },
    data() {
        return {
            acronym: '',
            name: '',
            symbol: ''
        };
    }
}
</script>