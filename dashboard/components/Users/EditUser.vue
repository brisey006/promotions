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
                        <label class="col-sm-2 form-control-label">Phone Number:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <input class="form-control form-control-sm" v-model="phoneNumber" name="phone" placeholder="Phone number (Include country code)" type="text">
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Bio:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <textarea rows="3" class="form-control" v-model="bio" name="bio" placeholder="Biography"></textarea>
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Date of Birth:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <client-only>
                                <cleave v-model="dob" :options="options" class="form-control form-control-sm" name="dob" placeholder="YYYY/MM/DD"></cleave>
                            </client-only>
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Gender:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <client-only>
                                <v-select name="gender" :options="genderOptions" v-model="gender" placeholder="Select Gender"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="row mg-t-20">
                        <label class="col-sm-2 form-control-label">Country:</label>
                        <div class="col-sm-10 mg-t-10 mg-sm-t-0">
                            <client-only>
                                <v-select label="text" name="country" :options="countries" :reduce="country => country.text" v-model="country" placeholder="Select Country"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" @click="saveProfile()" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import countries from '@/static/js/countries';
import { mapActions, mapGetters } from 'vuex';
import { XIcon } from 'vue-feather-icons';
export default {
    name: 'EditUser',
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
        editUserStatus: 'users/getEditUserStatus'
    }),
    watch: {
        editUserStatus (val, old) {
            if (val.data != undefined) {
                document.getElementById('close-'+this.modalId).click();
            }
        },
    },
    methods: {
        ...mapActions({
            editUser: 'users/editUser'
        }),
        saveProfile() {
            const { phoneNumber, website, bio, dob, gender, country } = this;
            let dateOfBirth;
            if (dob != null) {
                dateOfBirth = new Date(`${dob.substring(0, 4)}-${dob.substring(4, 6)}-${dob.substring(6, 8)}`);
            }
            const data = { phoneNumber, website, bio, dateOfBirth, gender, country };
            this.editUser(data);
        }
    },
    props: ["profile", "modalId"],
    data() {
        const profile = this.profile;
        return {
            phoneNumber: profile.phoneNumber,
            bio: profile.bio,
            dob: profile.dateOfBirth,
            gender: profile.gender,
            country: profile.country,
            options: {
                date: true,
                datePattern: ['Y', 'm', 'd']
            },
            countries,
            genderOptions: ["Male", "Female"],
        };
    },
}
</script>

<style lang="css" scoped>
    .vs__search, .vs__search:focus{
        border: none;
    }
</style>