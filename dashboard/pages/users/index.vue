<template>
    <div class="page-inner">
        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark">Users</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item"><i class="icon ion-ios-home-outline"></i>Dashboard</nuxt-link>
                        <span class="breadcrumb-item active">Users</span>
                    </div>
                </div>
                <div class="d-flex align-items-center hidden-xs">
                    <a href="#modalForumTopic" data-toggle="modal" class="btn btn-primary">
                        <plus-icon class="custom-class" size="16" />
                        Create User
                    </a>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->

        <AddUser :params="params" />
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
                                <option value="email">Email</option>
                                <option value="firstName">First Name</option>
                                <option value="lastName">Last Name</option>
                                <option value="userType">User Type</option>
                            </select>
                            <span style="margin-left: 20px"></span>
                            <b>Order: </b>
                            <select v-model="params.order" @change="dataChanged()" class="form-control form-control-sm custom-style">
                                <option value="1">Ascending</option>
                                <option value="-1">Descending </option>
                            </select> 
                        </div>
                        <div class="card-header-btn">
                            <input type="text" class="form-control form-control-sm" v-model="params.query" @keyup="dataChanged()" placeholder="Search User">
                        </div>
                    </div>
                    <div class="card-body pd-y-15">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th class="clickable" @click="sortBy('firstName')">
                                        First Name 
                                        <span v-if="params.sort == 'firstName'">
                                            <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                            <arrow-down-icon v-else class="custom-class" size="11" />
                                        </span>
                                    </th>
                                    <th class="clickable" @click="sortBy('lastName')">
                                        Last Name 
                                        <span v-if="params.sort == 'lastName'">
                                            <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                            <arrow-down-icon v-else class="custom-class" size="11" />
                                        </span>
                                    </th>
                                    <th class="clickable" @click="sortBy('email')">
                                        Email
                                        <span v-if="params.sort == 'email'">
                                            <arrow-up-icon v-if="params.order == 1" class="custom-class" size="11" />
                                            <arrow-down-icon v-else class="custom-class" size="11" />
                                        </span>
                                    </th>
                                    <th class="clickable" @click="sortBy('userType')">
                                        User Type
                                        <span v-if="params.sort == 'userType'">
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
                                    <tr v-for="user in users" :key="user._id">
                                        <th scope="row" class="index-row">{{user.index}}</th>
                                        <td style="width: 3%">
                                            <div class="d-flex">
                                                <img class="wd-35 rounded-circle img-fluid dp-style" :src="apiHost +user.image.thumbnail" alt="">
                                            </div>
                                        </td>
                                        <td v-bind:class="{boldText: params.sort == 'firstName'}"><nuxt-link :to="'/users/'+user._id">{{user.firstName}}</nuxt-link></td>
                                        <td v-bind:class="{boldText: params.sort == 'lastName'}"><nuxt-link :to="'/users/'+user._id">{{user.lastName}}</nuxt-link></td>
                                        <td v-bind:class="{boldText: params.sort == 'email'}">{{user.email}}</td>
                                        <td v-bind:class="{boldText: params.sort == 'userType'}">{{user.userType}}</td>
                                        <td v-bind:class="{boldText: params.sort == 'createdAt'}">{{user.created}}</td>
                                        <td v-bind:class="{boldText: params.sort == 'updatedAt'}">{{user.updated}}</td>
                                        <td class="text-right table-actions">
                                            <a v-if="loggedInUser._id != user._id" class="table-action  mg-r-10" data-toggle="modal" :href="'#del-'+user._id"><trash2-icon class="custom-class" size="16" /></a>
                                        </td>
                                        <delete-alert v-if="loggedInUser._id != user._id" :id="'del-'+user._id" @deleteItem="deleteItem" :itemId="user._id" :title="user.fullName" />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav v-if="pagination && users && users.length != 0" aria-label="Page navigation">
                            <div class="row">
                                <div class="col-sm">
                                    Showing <b>{{users[0].index}}</b> to <b>{{ users[users.length - 1].index }}</b> of {{pagination.totalDocs}} entries
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
import { mapActions, mapGetters } from 'vuex';
import AddUser from '@/components/Users/AddUser';
import DeleteAlert from '@/components/DeleteAlert';
import { PlusIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon } from 'vue-feather-icons';
export default {
    components: {
        AddUser,
        DeleteAlert,
        PlusIcon,
        Trash2Icon,
        ArrowUpIcon,
        ArrowDownIcon
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
        users: 'users/getUsers',
        pagination: 'users/getPagination',
        apiHost: 'general/apiHost',
        deletedItem: 'general/getDeletedItem',
        loggedInUser: 'auth/getUser'
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
            fetchUsers: 'users/fetchUsers',
            fetchProfile: 'users/fetchProfile',
            deleteUser: 'users/deleteUser'
        }),
        dataChanged() {
            this.fetchUsers(this.params);
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
        deleteItem(id) {
            this.deletedId = id;
            this.deleteUser(id);
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
</style>
