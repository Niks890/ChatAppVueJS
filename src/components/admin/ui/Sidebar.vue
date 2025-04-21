<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { ref } from 'vue'
import { useTheme } from 'vuetify'

import { useUserStore } from '@/stores/userStore'
import NavbarThemeSwitcher from '../ui/DarkModeAndLightMode.vue'
import Footer from '../ui/Footer.vue'
import UserProfile from '../ui/UserProfile.vue'

const userStore = useUserStore()
const vuetifyTheme = useTheme()

const searchQuery = ref('')
const isMobileSearchOpen = ref(false)

const hasRole = role => userStore.roles?.some(userRole => userRole.name === role) ?? false

const menuItems = [
  { type: 'link', title: 'Trang Chủ', icon: 'bx-home', to: '/admin/dashboard', roles: [] },
  { type: 'section', heading: 'Quản lý Chat', roles: ['admin'] },
  { type: 'link', title: 'Tin nhắn', icon: 'bx-chat', to: '/admin/chats-private', roles: ['admin'] },
  { type: 'section', heading: 'Quản lý Nhóm', roles: ['admin'] },
  { type: 'link', title: 'Nhóm Chat', icon: 'bx-group', to: '/admin/chats-group', roles: ['admin'] },
  { type: 'section', heading: 'Khác', roles: ['admin'] },
  { type: 'link', title: 'Quản lý tài khoản', icon: 'bx-group', to: '/admin/account-settings', roles: ['admin'] },
]
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 Navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex align-center w-100 px-4 h-100">
        <!-- Left: Toggle + Search -->
        <div class="d-flex align-center flex-grow-1">
          <IconBtn class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
            <VIcon icon="bx-menu" />
          </IconBtn>

          <div class="d-flex align-center flex-grow-1">
            <VTextField v-model="searchQuery" density="compact" hide-details placeholder="Tìm kiếm..."
              prepend-inner-icon="mdi-magnify" variant="solo-filled" class="search-input"
              v-show="!isMobileSearchOpen" />
          </div>
        </div>

        <!-- 🔍 Search icon (mobile) -->
        <IconBtn class="d-flex d-md-none ms-2" @click="isMobileSearchOpen = true">
          <VIcon icon="mdi-magnify" />
        </IconBtn>

        <!-- Right actions -->
        <div class="d-flex align-center">
          <IconBtn class="me-2">
            <VIcon icon="bx-bell" />
          </IconBtn>

          <NavbarThemeSwitcher class="me-2" />
          <UserProfile />
        </div>
      </div>
    </template>

    <!-- 👉 Sidebar Menu -->
    <template #vertical-nav-content>
      <template v-for="item in menuItems" :key="item.title || item.heading">
        <VerticalNavSectionTitle v-if="item.type === 'section' && item.roles.some(hasRole)"
          :item="{ heading: item.heading }" />
        <VerticalNavLink v-if="item.type === 'link' && (item.roles.length === 0 || item.roles.some(hasRole))"
          :item="{ title: item.title, icon: item.icon, to: item.to }" />
      </template>
    </template>

    <!-- 👉 Main Content -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 🔍 Mobile Search Dialog -->
    <VDialog v-model="isMobileSearchOpen" fullscreen scrollable transition="dialog-bottom-transition">
      <VCard class="pa-3">
        <div class="d-flex align-center">
          <VIcon icon="mdi-magnify" class="me-2" />
          <VTextField v-model="searchQuery" placeholder="Tìm kiếm..." hide-details variant="solo" class="flex-grow-1"
            autofocus />
          <IconBtn @click="isMobileSearchOpen = false">
            <VIcon icon="mdi-close" />
          </IconBtn>
        </div>
      </VCard>
    </VDialog>
  </VerticalNavLayout>
</template>


<style scoped>
.search-input {
  width: 100%;
  max-width: 500px;
  margin: 0 1rem;
  border: 1px solid rgb(62, 51, 51);
  border-radius: 3px;
}

@media (max-width: 768px) {
  .search-input {
    display: none;
  }
}
</style>
