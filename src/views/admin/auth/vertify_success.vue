<template>
    <v-container fluid class="d-flex align-center justify-center fill-height"
        style="background: linear-gradient(to bottom right, #d1fae5, #f0fdf4);">
        <v-card class="pa-6" max-width="500" elevation="12" rounded="xl">
            <v-card-text class="text-center">
                <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>

                <h2 class="text-h5 font-weight-bold mb-2">Xác minh thành công!</h2>
                <p class="text-subtitle-1 mb-4">
                    Cảm ơn bạn đã xác minh email. Bạn có thể đăng nhập và sử dụng hệ thống ngay bây giờ.
                </p>

                <router-link to="/login">
                    <v-btn color="success" rounded large elevation="2">
                        Đăng nhập ngay
                    </v-btn>
                </router-link>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useVerifyStore } from '../../../stores/vertifyRegister';

const route = useRoute();
const verifyStore = useVerifyStore();

onMounted(() => {
    if (route.query.verified === '200') {
        verifyStore.justVerified = true;
        console.log('Xác minh thành công!');
    } else {
        console.log('Không có thông tin xác minh hoặc thông tin không hợp lệ.');
    }
});
</script>
