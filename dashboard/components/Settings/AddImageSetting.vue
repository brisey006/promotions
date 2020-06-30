<template>
     <!--Modal Start-->
    <div class="modal fade effect-scale" id="modalAddPage" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Image Setting</h5>
                <button type="button" id="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                    <x-icon class="custom-class" />
                </button>
            </div>
            <div class="modal-body pd-y-20">
                <div class="row">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Route:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <select class="form-control form-control-sm" v-model="name">
                            <option value="">Choose Route...</option>
                            <option v-for="obj in imageKeys" :key="obj.key" :value="obj.key">{{obj.title}}</option>
                        </select>
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Aspect Ratio:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <select class="form-control form-control-sm" v-model="aspectRatio">
                            <option value="">Choose aspect ratio...</option>
                            <option value="1:1">1:1</option>
                            <option value="2:3">2:3</option>
                            <option value="4:3">4:3</option>
                            <option value="16:9">16:9</option>
                        </select>
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label">Max Size:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <input class="form-control form-control-sm" v-model="maxSize" name="maxSize" placeholder="Max Size (Default: 2048 kilobytes)" type="text">
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label">Thumbnail Width:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <input class="form-control form-control-sm" v-model="thumbnailWidth" placeholder="Thumbnail width in pixels" type="text">
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label">Cropped width:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <input class="form-control form-control-sm" v-model="croppedWidth" placeholder="Cropped width in pixels" type="text">
                    </div>
                </div>
                <div class="row mg-t-20">
                    <label class="col-sm-2 form-control-label"><span class="tx-danger">*</span>Crop Image:</label>
                    <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                        <select class="form-control form-control-sm" v-model="crop">
                            <option value="">Crop?</option>
                            <option :value="true">True</option>
                            <option :value="false">False</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div>
                <div v-if="addImageSettingsStatus.loading" class="modal-footer">
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
    name: 'AddImageSetting',
    components: {
        XIcon
    },
    computed: mapGetters({
        imageKeys: 'image-settings/getKeys',
        addImageSettingsStatus: 'image-settings/getAddImageSettingsStatus'
    }),
    watch: {
        addImageSettingsStatus (val, old) {
            if (val.status != 'added') {
                document.getElementById('closeModal').click();
            }
        }
    },
    methods: {
        ...mapActions({
            addImageSetting: 'image-settings/addImageSetting'
        }),
        async saveData() {
            const { name, aspectRatio, maxSize, crop, thumbnailWidth, croppedWidth } = this;
            const data = { name, aspectRatio, maxSize, crop, thumbnailWidth, croppedWidth };
            this.addImageSetting(data);
        },
    },
    data() {
        return {
            name: '',
            aspectRatio: '',
            maxSize: '',
            crop: '',
            thumbnailWidth: '',
            croppedWidth: ''
        };
    }
}
</script>