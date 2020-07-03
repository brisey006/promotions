<template>
    <div class="modal fade effect-scale" :id="modalId" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Upload Image <span v-if="!scriptsInitialized"> (Loading...)</span></h5>
                    <button type="button" id="closeImageModal" class="close" data-dismiss="modal" aria-label="Close">
                        <x-icon class="custom-class" />
                    </button>
                </div>
                <div class="modal-body">
                    <div id="smartwizard">
                    <ul>
                        <li>
                            <a href="#smartwizard-step-1" class="mb-3">
                                <div class="step-icons">
                                    <check-icon class="custom-class done" size="18" />
                                    <image-icon class="custom-class not-done" size="18" />
                                    Add Image
                                </div>
                                <div class="text-muted small">Upload image of choice</div>
                            </a>
                        </li>
                        <li>
                            <a href="#smartwizard-step-2" class="mb-3">
                                <div class="step-icons">
                                    <check-icon class="custom-class done" size="18" />
                                    <image-icon class="custom-class not-done" size="18" />
                                    Crop
                                </div>
                                <div class="text-muted small">Crop the image</div>
                            </a>
                        </li>
                    </ul>

                    <div>
                        <div id="smartwizard-step-1" class="card animated fadeIn">
                        <div class="card-body">
                            <div id="imageDropzone" class="dropzone"></div>
                        </div>
                        </div>
                        <div id="smartwizard-step-2" class="card animated fadeIn">
                        <div class="card-body">
                            <div class="row align-items-center" id="cropContainer"></div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div v-if="imageSrc != null && !finishStep" class="modal-footer">
                    <button type="button" @click="goToCrop()" class="btn btn-primary">Next</button>
                </div>
                <div v-else-if="imageSrc != null && finishStep" class="modal-footer">
                    <button type="button" @click="goToPrev()" class="btn btn-primary">Back</button>
                    <button v-if="cropImageStatus.loading" class="btn btn-primary" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                    <button v-else type="button" @click="setCropData()" class="btn btn-primary">Finalise</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { XIcon, ImageIcon, CropIcon, CheckIcon } from 'vue-feather-icons';

export default {
    name: 'AddImage',
    components: {
        XIcon,
        ImageIcon,
        CropIcon,
        CheckIcon
    },
    computed: mapGetters({
        user: 'auth/getUser',
        imageSetting: 'image-settings/getImageSetting',
        cropImageStatus: 'general/getCropImageStatus'
    }),
    watch: {
        cropImageStatus (val, old) {
            if (val.status == 'uploaded') {
                document.getElementById('closeImageModal').click();
            }
        }
    },
    methods: {
        ...mapActions({
            fetchPages: 'pages/fetchPages',
            handleRequestError: 'general/handleRequestError',
        }),
        goToCrop() {
            const aspectRatio = this.imageSetting.aspectRatio;
            $('#smartwizard').smartWizard("next");
            const cropContainer = document.getElementById('cropContainer');
            const container = document.createElement('div');
            const img = document.createElement('img');
            img.src = this.imageSrc;
            img.style.maxHeight = '300px';
            img.id = 'cropThisImage';
            container.appendChild(img);
            cropContainer.innerHTML = container.innerHTML;
            this.cropper = new Cropper(document.getElementById('cropThisImage'), {
                aspectRatio: aspectRatio[0] / aspectRatio[1],
                viewMode: 1,
            });
            
        },
        goToPrev() {
            $('#smartwizard').smartWizard("prev");
        },
        setCropData() {
            this.$emit('cropImage', this.cropper.getData());
        },
        setImage(image) {
            this.imageSrc = image;
        },
        initializeDropzone() {
            const BASE_URL = this.$axios.defaults.baseURL;
            const token = this.user.token;
            const handleRequestError = this.handleRequestError;
            const setImage = this.setImage;
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    try {
                        let myDropzone = new Dropzone("div#imageDropzone", {
                            paramName: "file",
                            maxFilesize: 2,
                            maxFiles: 1,
                            acceptedFiles: ".png,.jpg,.jpeg", 
                            url: `${BASE_URL}${this.uploadUrl}`,
                            headers:{"Authorization":'Bearer ' + token},
                            addRemoveLinks: true,
                        });

                        myDropzone.on("addedfile", function(file) {
                            setImage(null);
                        });

                        myDropzone.on("success", function(file) {
                            setImage(file.dataURL);
                        });

                        myDropzone.on("error", function(file, errorMessage) {
                            handleRequestError(errorMessage);
                        });
                        clearInterval(interval);
                        resolve('loaded');
                    } catch (e) {
                        console.log(e.message);
                        console.log('from error');
                    }
                }, 50);
            });
        },
        initializeSmartWizard() {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    try {
                        $('#smartwizard').smartWizard({
                            autoAdjustHeight: false,
                            backButtonSupport: false,
                            useURLhash: false,
                            showStepURLhash: false,
                            toolbarSettings: {
                                toolbarPosition: 'none',
                            },
                            anchorSettings: {
                                anchorClickable: false,
                                enableAllAnchors: false,
                                markDoneStep: true,
                                markAllPreviousStepsAsDone: true,
                                enableAnchorOnDoneStep: true
                            },
                        });
                        clearInterval(interval);
                        resolve('loaded');
                    } catch (e) {
                        console.log('Still loading...');
                    }
                }, 50);
            });
        },
        async checkScript() {
            await this.initializeDropzone();
            await this.initializeSmartWizard();
            let changeStepState = this.changeStepState;
            $("#smartwizard").on("showStep", function(e, anchorObject, stepIndex, stepDirection, stepPosition) {
                if (stepIndex == 0) {
                    changeStepState(false);
                } else if (stepIndex == 1) {
                    changeStepState(true);
                }
            });
            this.scriptsInitialized = true;
        },
        changeStepState(state) {
            this.finishStep = state;
        }
    },
    props: ["modalId", "uploadUrl"],
    data() {
        return {
            imageSrc: null,
            scriptsInitialized: false,
            finishStep: false,
            cropper: null
        }
    },
    mounted() {
        this.checkScript();
    }
}
</script>

<style scoped>
    .step-icons {
        display: inline;
    }
    .step-icons svg:nth-child(1) {
        display: none;
    }
    .done .nav-link .step-icons svg:nth-child(1) {
        display: inline;
    }
    .done .nav-link .step-icons svg:nth-child(2) {
        display: none;
    }

    .done .nav-link {
        color: darkgreen;
    }
</style>