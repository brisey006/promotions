<template>
    <div class="page-inner">
        <!-- Breadcrumb Start -->
        <!--================================-->
        <div class="pageheader pd-t-25 pd-b-15">
            <div class="d-flex justify-content-between">
                <div class="clearfix">
                    <div class="pd-t-5 pd-b-5">
                        <h1 class="pd-0 mg-0 tx-20 tx-dark">Currencies</h1>
                    </div>
                    <div class="breadcrumb pd-0 mg-0">
                        <nuxt-link to="/" class="breadcrumb-item">Dashboard</nuxt-link>
                        <nuxt-link to="/" class="breadcrumb-item">Settings</nuxt-link>
                        <span class="breadcrumb-item active">Currencies</span>
                    </div>
                </div>
                <div class="d-flex align-items-center hidden-xs">
                    <a href="#addCurrencyModal" data-toggle="modal" class="btn btn-primary">
                        <plus-icon class="custom-class" size="16"/> Add Currency
                    </a>
                </div>
            </div>
        </div>
        <!--/ Breadcrumb End -->
        <!--================================-->
        <add-currency modalId="addCurrencyModal" />

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
                                        <th>Acronym</th>
                                        <th>Name</th>
                                        <th>Symbol</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                        <th v-if="user.userType == userRoles.SUPER_USER" class="text-right w-100px">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr v-for="currency in currencies" :key="currency._id">
                                    <th scope="row" class="index-row">{{currency.index}}</th>
                                    <td>{{currency.acronym}}</td>
                                    <td>{{currency.name}}</td>
                                    <td>{{currency.symbol}}</td>
                                    <td>{{currency.created}}</td>
                                    <td>{{currency.updated}}</td>
                                    <td v-if="user.userType == userRoles.SUPER_USER" class="text-right table-actions">
                                        <a class="table-action" data-toggle="modal" :href="'#del-'+currency._id">
                                            <trash2-icon class="custom-class" size="16" />
                                        </a>
                                    </td>
                                    <delete-alert v-if="user.userType == userRoles.SUPER_USER" :id="'del-'+currency._id" @deleteItem="deleteItem" :itemId="currency._id" :title="currency.name" />
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav v-if="pagination && currencies && currencies.length != 0" aria-label="Page navigation">
                            <div class="row">
                                <div class="col-sm">
                                    Showing <b>{{currencies[0].index}}</b> to <b>{{ currencies[currencies.length - 1].index }}</b> of {{pagination.totalDocs}} entries
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
import AddCurrency from '@/components/Settings/AddCurrency';
//import EditCurrency from '@/components/Settings/EditCurrency';
import DeleteAlert from '@/components/DeleteAlert';

export default {
    components: {
        PlusIcon,
        AddCurrency,
        //EditCurrency,
        HomeIcon,
        Trash2Icon,
        ArrowUpIcon,
        ArrowDownIcon,
        Edit3Icon,
        DeleteAlert
    },
    computed: mapGetters({
        currencies: 'currencies/getCurrencies',
        pagination: 'currencies/getPagination',
        deletedItem: 'general/getDeletedItem',
        user: 'auth/getUser',
        userRoles: 'general/getUserRoles'
    }),
    methods: {
        ...mapActions({
            fetchCurrencies: 'currencies/fetchCurrencies',
            deleteCurrency: 'currencies/deleteCurrency'
        }),
        deleteItem(id) {
            this.deletedId = id;
            this.deleteCurrency(id)
        },
        dataChanged() {
            this.fetchCurrencies(this.params);
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