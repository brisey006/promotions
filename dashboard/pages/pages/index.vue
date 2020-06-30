<template>
    <div class="page-inner">
        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark">Shop Pages</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item">
                            Dashboard
                        </nuxt-link>
                        <span class="breadcrumb-item active">Pages</span>
                    </div>
                </div>
                <div class="d-flex align-items-center hidden-xs">
                    <a href="#modalAddPage" data-toggle="modal" class="btn btn-primary">
                        <plus-icon class="custom-class" size="16" /> 
                        Create Page
                    </a>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->

        <AddPage/>
        
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
                            <span style="margin-left: 20px"></span>
                            <b>Sort By: </b> 
                            <select v-model="params.sort" @change="dataChanged()" class="form-control form-control-sm custom-style">
                                <option value="createdAt">Date Added</option>
                                <option value="updatedAt">Date Updated</option>
                                <option value="name">Name</option>
                            </select>
                            <span style="margin-left: 20px"></span>
                            <b>Order: </b>
                            <select v-model="params.order" @change="dataChanged()" class="form-control form-control-sm custom-style">
                                <option value="1">Ascending</option>
                                <option value="-1">Descending </option>
                            </select> 
                        </div>
                        <div class="card-header-btn">
                            <input type="text" class="form-control form-control-sm" v-model="params.query" @keyup="dataChanged()" placeholder="Search Shop">
                        </div>
                    </div>
                    <div class="card-body pd-y-15">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th class="clickable" @click="sortBy('name')">
                                            Shop Name
                                            <span v-if="params.sort == 'name'">
                                                <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                                <arrow-down-icon v-else class="custom-class" size="11" />
                                            </span>
                                        </th>
                                        <th>Administrator</th>
                                        <th class="clickable" @click="sortBy('createdAt')">
                                            Created
                                            <span v-if="params.sort == 'createdAt'">
                                                <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                                <arrow-down-icon v-else class="custom-class" size="11" />
                                            </span>
                                        </th>
                                        <th class="clickable" @click="sortBy('updatedAt')">
                                            Updated At
                                            <span v-if="params.sort == 'updatedAt'">
                                                <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                                <arrow-down-icon v-else class="custom-class" size="11" />
                                            </span>
                                        </th>
                                        <th class="text-right w-100px">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr v-for="shop in pages" :key="shop._id">
                                    <th scope="row" class="index-row">{{shop.index}}</th>
                                    <td style="width: 3%">
                                        <div class="d-flex">
                                            <img v-if="shop.image !== undefined" class="wd-35 rounded-circle img-fluid dp-style" :src="apiHost +shop.image.thumbnail" alt="">
                                        </div>
                                    </td>
                                    <td><nuxt-link :to="'/pages/'+shop.slug">{{shop.name}}</nuxt-link></td>
                                    <td><span v-if="shop.administrator">{{shop.administrator.fullName}}</span> <span v-else><b>No Admin</b></span></td>
                                    <td>{{shop.created}}</td>
                                    <td>{{shop.updated}}</td>
                                    <td class="text-right table-actions">
                                        <a @click="getShopData(shop.slug)" :href="'#edit-'+shop._id" title="" data-toggle="modal" data-original-title="Edit">
                                           <edit3-icon class="custom-class mr-2" size="16"/>
                                       </a>
                                        <a class="table-action" data-toggle="modal" :href="'#del-'+shop._id">
                                            <trash2-icon class="custom-class" size="16" />
                                        </a>
                                    </td>
                                    <edit-page :modalId="'edit-'+shop._id" />
                                    <delete-alert :id="'del-'+shop._id" @deleteItem="deleteItem" :itemId="shop._id" :title="shop.name" />
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav v-if="pagination && pages && pages.length != 0" aria-label="Page navigation">
                            <div class="row">
                                <div class="col-sm">
                                    Showing <b>{{pages[0].index}}</b> to <b>{{ pages[pages.length - 1].index }}</b> of {{pagination.totalDocs}} entries
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
import { mapGetters, mapActions } from 'vuex';
import AddPage from '@/components/Shop/AddPage';
import DeleteAlert from '@/components/DeleteAlert';
import { HomeIcon, PlusIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon, Edit3Icon } from 'vue-feather-icons';
import EditPage from '@/components/Shop/EditPage'
export default {
    components: {
        AddPage,
        DeleteAlert,
        HomeIcon,
        PlusIcon,
        Trash2Icon,
        ArrowUpIcon,
        ArrowDownIcon,
        Edit3Icon,
        EditPage
    },
    head: {
        link: [
            { rel: "stylesheet", href: '/plugins/bootstrap-tagsinput/bootstrap-tagsinput.css' },
            { rel: "stylesheet", href: '/css/vue-select.css' }
        ],
        script: [
            { src: '/plugins/bootstrap-tagsinput/bootstrap-tagsinput.js', body: true, ssr: false }
        ]
    },
    data(){
        return {
            params: {
                limit: 10,
                page: 1,
                query: '',
                sort: 'createdAt',
                order: -1
            },
            deletedId: ''
        }
    },
    computed: mapGetters({
        pages: 'pages/getPagesData',
        pagination: 'pages/getPagination',
        deletedItem: 'general/getDeletedItem',
        apiHost: 'general/apiHost'
    }),
    watch: {
        deletedItem (val, old) {
            if (val.id == this.deletedId) {
                this.dataChanged();
            }
        }
    },
    methods: {
        ...mapActions({
            fetchPages: 'pages/fetchPages',
            deleteShop: 'pages/deleteShop',
            getShopData: 'shop/getShopData',
        }),
        deleteItem(id) {
            this.deletedId = id;
            this.deleteShop(id);
        },
        dataChanged() {
            this.fetchPages(this.params);
        },
        toPage(e) {
            if (e != this.pagination.page) {
                this.params.page = e;
                this.dataChanged();
            }
        },
        sortBy(e) {
            const { sort, order } = this.params;
            this.params.sort = e;
            if (order == undefined) {
                this.params.order = 1;
            } else {
                if (order == 1) {
                    this.params.order = -1;
                } else {
                    this.params.order = 1;
                }
            }
            this.dataChanged();
        }
    },
    created() {
        this.dataChanged();
    }
}
</script>