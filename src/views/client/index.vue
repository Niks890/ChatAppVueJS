<template>
    <h1 class="text-center">Đây là trang home</h1>
    <div class="login">
        <router-link to="/login" class="btn-login">Đăng nhập</router-link>
    </div>
</template>

<style scoped>
.login {

    display: flex;
    justify-content: end;
    align-items: center;
}

.btn-login {
    width: 120px;
    background-color: #00b4d8 !important;
    padding: 12px;
    border-radius: 5px;
    text-align: center;
    color: black;
    margin-right: 10px;
}
</style>
