<template>
    <div class="page-inner">
        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark">Image Settings</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item">Dashboard</nuxt-link>
                        <nuxt-link to="/" class="breadcrumb-item">Settings</nuxt-link>
                        <span class="breadcrumb-item active">Image Settings</span>
                    </div>
                </div>
                <div class="d-flex align-items-center hidden-xs">
                    <a href="#modalAddPage" data-toggle="modal" class="btn btn-primary">
                        <plus-icon class="custom-class" size="16"/> Add Image Setting
                    </a>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->
        <add-image-settings />

        <div class="row">
            <!--================================-->
            <!-- New Customers Start -->	
            <!--================================-->			   
            <div class="col-12">
                <div class="card mg-b-30">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <div class="showNumber">
                            <b>Max: </b>
                            <select v-model="params.limit" @change="dataChanged()" class="form-control form-control-sm custom-style">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>   
                            </select>
                        </div>
                        <div class="card-header-btn">
                            <input type="text" class="form-control form-control-sm" v-model="params.query" @keyup="dataChanged()" placeholder="Search Image Setting">
                        </div>
                    </div>
                    <div class="card-body pd-y-15">
                        <div v-if="userRoles" class="table-responsive">
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image Route</th>
                                        <th>Aspect Ratio</th>
                                        <th>Max Size</th>
                                        <th>Thumbnail Width</th>
                                        <th>Cropped Width</th>
                                        <th>Crop Enabled</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                        <th v-if="user.userType == userRoles.SUPER_USER" class="text-right w-100px">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr v-for="setting in imageSettings" :key="setting._id">
                                    <th scope="row" class="index-row">{{setting.index}}</th>
                                    <td>{{getSettingName(setting.name)}}</td>
                                    <td>{{setting.aspectRatio}}</td>
                                    <td>{{setting.maxSize}}</td>
                                    <td>{{setting.thumbnailWidth}}</td>
                                    <td>{{setting.croppedWidth}}</td>
                                    <td>
                                        <span v-if="setting.crop" class="badge badge-outline-success">YES</span>
                                        <span v-else class="badge badge-outline-danger">NO</span>
                                    </td>
                                    <td>{{setting.created}}</td>
                                    <td>{{setting.updated}}</td>
                                    <td v-if="user.userType == userRoles.SUPER_USER" class="text-right table-actions">
                                        <a :href="'#edit-'+setting._id" title="" data-toggle="modal" data-original-title="Edit">
                                            <edit3-icon class="custom-class mr-2" size="16"/>
                                        </a>
                                        <a class="table-action" data-toggle="modal" :href="'#del-'+setting._id">
                                            <trash2-icon class="custom-class" size="16" />
                                        </a>
                                    </td>
                                    
                                    <edit-image-setting v-if="user.userType == userRoles.SUPER_USER" :id="'edit-'+setting._id" :imageSettings="setting" />
                                    <delete-alert v-if="user.userType == userRoles.SUPER_USER" :id="'del-'+setting._id" @deleteItem="deleteItem" :itemId="setting._id" :title="setting.name" />
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav v-if="pagination && imageSettings && imageSettings.length != 0" aria-label="Page navigation">
                            <div class="row">
                                <div class="col-sm">
                                    Showing <b>{{imageSettings[0].index}}</b> to <b>{{ imageSettings[imageSettings.length - 1].index }}</b> of {{pagination.totalDocs}} entries
                                </div>
                                <div class="col-sm">
                                    <ul class="pagination justify-content-end">
                                        <li class="page-item" v-bind:class="{ disabled: !pagination.hasPrevPage }">
                                            <a class="page-link" @click="toPage(pagination.prevPage)" aria-label="Previous">
                                                <span aria-hidden="true">«</span>
                                                <span class="sr-only">Previous</span>
                                            </a>
                                        </li>
                                        <li v-for="i in pagination.visiblePages" v-bind:class="{ active: i == pagination.page }" :key="i" class="page-item">
                                            <a class="page-link" v-bind:class="{ disabled: i == pagination.page }" @click="toPage(i)">{{i}}</a>
                                        </li>
                                        <li class="page-item" v-bind:class="{ disabled: !pagination.hasNextPage }">
                                            <a class="page-link" @click="toPage(pagination.nextPage)" aria-label="Next">
                                                <span aria-hidden="true">»</span>
                                                <span class="sr-only">Next</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            <!--/ New Customers End -->			   
            <!--================================-->
        </div>
    </div>
</template>

<script>
import { PlusIcon, HomeIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon, Edit3Icon } from 'vue-feather-icons';
import { mapGetters, mapActions } from 'vuex';
import AddImageSettings from '@/components/Settings/AddImageSetting';
import EditImageSetting from '@/components/Settings/EditImageSetting';
import DeleteAlert from '@/components/DeleteAlert';

export default {
    components: {
        PlusIcon,
        AddImageSettings,
        EditImageSetting,
        HomeIcon,
        Trash2Icon,
        ArrowUpIcon,
        ArrowDownIcon,
        Edit3Icon,
        DeleteAlert
    },
    computed: mapGetters({
        imageKeys: 'image-settings/getKeys',
        imageSettings: 'image-settings/getImageSettings',
        pagination: 'image-settings/getPagination',
        deletedItem: 'general/getDeletedItem',
        user: 'auth/getUser',
        userRoles: 'general/getUserRoles'
    }),
    methods: {
        ...mapActions({
            fetchImageKeys: 'image-settings/fetchImageKeys',
            fetchImageSettings: 'image-settings/fetchImageSettings',
            deleteImageSetting: 'image-settings/deleteImageSetting'
        }),
        getSettingName (key) {
            let keyObj = Object.values(this.imageKeys).filter(e => e.key == key)[0];
            return keyObj.title;
        },
        deleteItem(id) {
            this.deletedId = id;
            this.deleteImageSetting(id)
        },
        dataChanged() {
            this.fetchImageSettings(this.params);
        },
    },
    watch: {
        deletedItem (val, old) {
            if (val.id == this.deletedId) {
                this.dataChanged();
            }
        }
    },
    created() {
        this.fetchImageKeys();
        this.dataChanged();
    },
    data() {
        return {
            params: {
                limit: 10,
                page: 1,
                query: '',
                sort: 'createdAt',
                order: -1
            },
            deletedId: ''
        };
    }
}
</script>