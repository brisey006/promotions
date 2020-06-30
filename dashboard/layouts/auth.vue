<template>
    <div class="ht-100v d-flex">
        <div class="pd-20 mx-auto text-center bd-1 align-self-center">
            <div class="login-wrapper">
                <div class="loginbox  align-self-center">
                    <div class="login-left hidden-xs">
                        <img class="img-fluid logo-white" src="~assets/images/logo-white.png" alt="Logo">
                    </div>
                    <nuxt />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'auth'
}
</script>
<style scoped>
    .login-left{
        background: linear-gradient(180deg, #962dff, #8217ec) !important;
    }
</style>