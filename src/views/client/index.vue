<template>
    <div>
        <!-- App Bar -->
        <VAppBar color="#01579B" dark app flat elevate-on-scroll>
            <!-- Thanh điều hướng cho mobile (toggle menu) -->
            <VAppBarNavIcon @click="drawer = !drawer" class="d-sm-none app-bar-nav-icon" />

            <!-- Nội dung AppBar -->
            <VContainer class="d-flex justify-space-between align-center">
                <h2 class="text-h6 text-white font-weight-bold mt-2">💬 ChatApp</h2>

                <!-- Menu trên màn hình lớn -->
                <div class="d-none d-sm-flex align-center">
                    <RouterLink :to="{ name: 'login' }" class="text-white me-4">
                        <VIcon icon="mdi-login" class="mr-1" /> Đăng nhập
                    </RouterLink>
                    <RouterLink :to="{ name: 'register' }" class="text-white">
                        <VIcon icon="mdi-account-plus" class="mr-1" /> Đăng ký
                    </RouterLink>
                </div>
            </VContainer>
        </VAppBar>


        <!-- Drawer cho mobile (ẩn/hiện menu) -->
        <VNavigationDrawer v-model="drawer" temporary location="left" class="d-sm-none">
            <VList nav>
                <VListItem to="/login" @click="drawer = false" prepend-icon="mdi-login">
                    <VListItemTitle>Đăng nhập</VListItemTitle>
                </VListItem>
                <VListItem to="/register" @click="drawer = false" prepend-icon="mdi-account-plus">
                    <VListItemTitle>Đăng ký</VListItemTitle>
                </VListItem>
            </VList>
        </VNavigationDrawer>

        <!-- Hero Section -->
        <section class="hero-section d-flex align-center justify-center text-white text-center">
            <VContainer>
                <h1 class="text-h3 font-weight-bold mb-4 mt-4">Kết nối dễ dàng cùng ChatApp nội bộ</h1>
                <p class="text-subtitle-1 mb-6">Trò chuyện nhóm, chia sẻ tài liệu, và làm việc hiệu quả hơn mỗi ngày.
                </p>
                <RouterLink to="/login">
                    <VBtn size="large" class="btn-gradient">Bắt đầu ngay</VBtn>
                </RouterLink>
            </VContainer>
        </section>

        <!-- Features Section -->
        <VContainer class="py-12">
            <h2 class="text-center text-uppercase font-weight-bold mb-10">Tính năng nổi bật</h2>
            <VRow class="text-center">
                <VCol cols="12" md="4">
                    <VIcon icon="mdi-forum" size="48" color="primary" class="mb-4" />
                    <h5 class="font-weight-medium">Trò chuyện nhóm</h5>
                    <p>Nhắn tin real-time, chia sẻ file, hình ảnh, emoji, và nhiều hơn nữa.</p>
                </VCol>
                <VCol cols="12" md="4">
                    <VIcon icon="mdi-lock" size="48" color="success" class="mb-4" />
                    <h5 class="font-weight-medium">Bảo mật & riêng tư</h5>
                    <p>Mã hóa tin nhắn, xác thực người dùng, phân quyền rõ ràng.</p>
                </VCol>
                <VCol cols="12" md="4">
                    <VIcon icon="mdi-flash" size="48" color="warning" class="mb-4" />
                    <h5 class="font-weight-medium">Hiệu suất cao</h5>
                    <p>WebSocket + Redis giúp xử lý tin nhắn cực nhanh và chính xác.</p>
                </VCol>
            </VRow>
        </VContainer>

        <!-- Footer -->
        <VFooter color="#01579B" class=" text-white text-center py-4">
            <VContainer>
                <p class="mb-1">© 2025 ChatApp - By VMT</p>
                <p class="text-caption">Personal Project 2025</p>
            </VContainer>
        </VFooter>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    VAppBar,
    VAppBarNavIcon,
    VNavigationDrawer,
    VList,
    VListItem,
    VListItemTitle,
    VFooter,
    VContainer,
    VRow,
    VCol,
    VIcon,
    VBtn,
} from 'vuetify/components'

const drawer = ref(false)
</script>

<style scoped>
.hero-section {
    min-height: 100vh;
    background: url('../../assets/images/banner/banner-home.avif') no-repeat center center/cover;
    position: relative;
}

.hero-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: -1;
}

.btn-gradient {
    background: linear-gradient(135deg, #2a4bc1 0%, #0a3889 100%);
    color: white;
    padding: 12px 30px;
    border-radius: 30px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-gradient:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* Đảm bảo nút menu có z-index cao để nó không bị che khuất */
.app-bar-nav-icon {
    position: relative;
    /* Đặt position relative để z-index hoạt động */
    z-index: 2000;
    /* Đảm bảo nút toggle luôn ở trên cùng */
}

/* Đảm bảo drawer có z-index cao hơn AppBar */
.v-navigation-drawer {
    z-index: 3000 !important;
    /* Đảm bảo drawer có z-index cao hơn AppBar */
}

/* Tăng z-index cho VAppBar để không bị che */
.v-app-bar {
    z-index: 1000;
}
</style>
