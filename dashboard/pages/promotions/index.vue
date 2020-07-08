<template>
    <div class="page-inner">
        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark">Promotions</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item"><i class="icon ion-ios-home-outline"></i>Dashboard</nuxt-link>
                        <span class="breadcrumb-item active">Promotions</span>
                    </div>
                </div>
                <div class="d-flex align-items-center hidden-xs">
                    <a @click="refreshAddPromoTags()" href="#modalForumTopic" data-toggle="modal" class="btn btn-primary">
                        <plus-icon class="custom-class" size="16" />
                        Create Promotion
                    </a>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->

        <AddPromotion :params="params" :seller="null" />
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
                                <option value="title">Title</option>
                                <option value="expiry">Expiry Date</option>
                            </select>
                            <span style="margin-left: 20px"></span>
                            <b>Order: </b>
                            <select v-model="params.order" @change="dataChanged()" class="form-control form-control-sm custom-style">
                                <option value="1">Ascending</option>
                                <option value="-1">Descending </option>
                            </select> 
                        </div>
                        <div class="card-header-btn">
                            <input type="text" class="form-control form-control-sm" v-model="params.query" @keyup="dataChanged()" placeholder="Search Promotion">
                        </div>
                    </div>
                    <div class="card-body pd-y-15">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th class="clickable" @click="sortBy('title')">
                                        Title
                                        <span v-if="params.sort == 'title'">
                                            <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                            <arrow-down-icon v-else class="custom-class" size="11" />
                                        </span>
                                    </th>
                                    <th>Shop</th>
                                    <th class="clickable" @click="sortBy('active')">
                                        Active
                                        <span v-if="params.sort == 'active'">
                                            <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                            <arrow-down-icon v-else class="custom-class" size="11" />
                                        </span>
                                    </th>
                                    <th class="clickable" @click="sortBy('expiry')">
                                        Expiry Date
                                        <span v-if="params.sort == 'expiry'">
                                            <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                            <arrow-down-icon v-else class="custom-class" size="11" />
                                        </span>
                                    </th>
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
                                    <tr v-for="promotion in promotions" :key="promotion._id">
                                        <th scope="row" class="index-row">{{promotion.index}}</th>
                                        <td style="width: 3%">
                                            <div class="d-flex">
                                                <img v-if="promotion.image" class="wd-35 rounded-circle img-fluid dp-style" :src="promotion.image.thumbnail" alt="">
                                                <image-icon v-else class="custom-class" size="16" />
                                            </div>
                                        </td>
                                        <td v-bind:class="{boldText: params.sort == 'title'}"><nuxt-link :to="'/promotions/'+promotion.slug">{{promotion.title}}</nuxt-link></td>
                                        <td><nuxt-link :to="'/pages/'+promotion.seller.slug">{{promotion.seller.name}}</nuxt-link></td>
                                        <td v-bind:class="{boldText: params.sort == 'active'}">
                                            <span v-if="promotion.active" class="badge badge-outline-success">Active</span>
                                            <span v-else class="badge badge-outline-danger">Deactivated</span>
                                        </td>
                                        <td v-bind:class="{boldText: params.sort == 'expiry'}">{{promotion.expiryDate}}</td>
                                        <td v-bind:class="{boldText: params.sort == 'createdAt'}">{{promotion.created}}</td>
                                        <td v-bind:class="{boldText: params.sort == 'updatedAt'}">{{promotion.updated}}</td>
                                        <td class="text-right table-actions">
                                            <a @click="initEditPromos(promotion)" :href="'#edit-'+promotion._id" title="" data-toggle="modal" data-original-title="Edit">
                                                <edit3-icon class="custom-class mr-2" size="16"/>
                                            </a>
                                            <a class="table-action  mg-r-10" data-toggle="modal" :href="'#del-'+promotion._id"><trash2-icon class="custom-class" size="16" /></a>
                                        </td>
                                        <edit-promotion :promotion="promotion" :modalId="'edit-'+promotion._id" :tagsInputId="'tags-'+promotion._id" />
                                        <delete-alert :id="'del-'+promotion._id" @deleteItem="deleteItem" :itemId="promotion._id" :title="promotion.title" />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav v-if="pagination && promotions && promotions.length != 0" aria-label="Page navigation">
                            <div class="row">
                                <div class="col-sm">
                                    Showing <b>{{promotions[0].index}}</b> to <b>{{ promotions[promotions.length - 1].index }}</b> of {{pagination.totalDocs}} entries
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AddPromotion from '@/components/Promotions/AddPromotion';
import EditPromotion from '@/components/Promotions/EditPromotion';
import DeleteAlert from '@/components/DeleteAlert';
import { PlusIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon, Edit3Icon, ImageIcon } from 'vue-feather-icons';
export default {
    components: {
        AddPromotion,
        EditPromotion,
        DeleteAlert,
        PlusIcon,
        Trash2Icon,
        ArrowUpIcon,
        ArrowDownIcon,
        Edit3Icon,
        ImageIcon
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
            }
        }
    },
    computed: mapGetters({
        promotions: 'promotions/getPromotions',
        pagination: 'promotions/getPagination',
        apiHost: 'general/apiHost'
    }),
    methods: {
        ...mapActions({
            fetchPromotions: 'promotions/fetchPromotions',
            fetchPromotion: 'promotions/fetchPromotion'
        }),
        ...mapMutations({
            setPromotion: 'promotions/setPromotion'
        }),
        dataChanged() {
            this.fetchPromotions(this.params);
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
        },
        async deleteItem(id) {
            await this.$axios.$delete('/promotions/'+id);
            this.dataChanged();
            this.$notify({
                group: 'foo',
                title: 'Important message',
                text: `Promotion was deleted successfully!`,
                type: 'success'
            });
        },
        refreshAddPromoTags() {
            $("#addPromoTags").tagsinput('refresh');
        },
        initEditPromos(promotion) {
            this.setPromotion(promotion);
            $('#tags-' + promotion._id).tagsinput('refresh');
            const tags = promotion.tags;
            tags.forEach(tag => {
                $('#tags-' + promotion._id).tagsinput('add', tag.name);
            });
        }
    },
    created() {
        this.dataChanged();
    }
}
</script>

<style scoped>
    .index-row {
        width: 4%;
    }
    .dp-style {
        border: 1px solid #efefef;
    }
    .custom-style {
        display: inline-block;
        width: auto;
    }
    .clickable {
        cursor: pointer;
    }
    .custom-class {
        color: #6b6b6b;
    }
</style>