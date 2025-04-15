<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { useTheme } from 'vuetify'

// Components
import Footer from '../ui/Footer.vue'
import NavbarThemeSwitcher from '../ui/DarkModeAndLightMode.vue'
import UserProfile from '../ui/UserProfile.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const hasRole = role => {
  return userStore.roles?.includes(role) ?? false
}

const vuetifyTheme = useTheme()

// Danh sách menu
const menuItems = [
  { type: 'link', title: 'Dashboard', icon: 'bx-home', to: '/admin/dashboard', roles: [] },

  { type: 'section', heading: 'Quản lý Sản phẩm', roles: ['admin', 'manager', 'sale'] },
  { type: 'link', title: 'Danh mục', icon: 'bx-list-ul', to: '/admin/category', roles: ['admin', 'manager', 'sale'] },
  { type: 'link', title: 'Sản phẩm', icon: 'bx-box', to: '/admin/product', roles: ['admin', 'manager', 'sale'] },

  { type: 'section', heading: 'Quản lý Bán hàng', roles: ['admin', 'sale', 'manager'] },
  { type: 'link', title: 'Đơn hàng', icon: 'bx-cart', to: '/admin/order', roles: ['admin', 'sale', 'manager'] },
  { type: 'link', title: 'Khuyến mãi', icon: 'bx-gift', to: '/admin/discount', roles: ['admin', 'manager'] },
  { type: 'link', title: 'Doanh Thu', icon: 'bx-package', to: '/admin/revenue', roles: ['admin', 'manager'] },

  { type: 'section', heading: 'Quản lý Kho & nhà cung cấp', roles: ['admin', 'warehouseworker', 'manager'] },
  { type: 'link', title: 'Nhà cung cấp', icon: 'bx-package', to: '/admin/supplier', roles: ['admin', 'warehouseworker', 'manager'] },
  { type: 'link', title: 'Kho hàng', icon: 'bx-package', to: '/admin/inventory', roles: ['admin', 'warehouseworker', 'manager'] },
  { type: 'link', title: 'Nhân viên', icon: 'bx-user', to: '/admin/employee', roles: ['admin', 'manager'] },
  { type: 'section', heading: 'Khác', roles: ['admin', 'manager'] },
  { type: 'link', title: 'Đánh giá', icon: 'bx-star', to: '/admin/review', roles: ['admin', 'manager'] },
]
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 Navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon icon="bx-menu" />
        </IconBtn>

        <div class="d-flex align-center cursor-pointer" style="user-select: none;">
          <IconBtn>
            <VIcon icon="bx-home" />
          </IconBtn>
          <span class="d-none d-md-flex align-center">
            <span class="me-3">Trang Quản Trị</span>
          </span>
        </div>

        <VSpacer />
        <IconBtn class="me-2">
          <VIcon icon="bx-bell" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Sidebar Menu -->
    <template #vertical-nav-content>
      <template v-for="item in menuItems" :key="item.title || item.heading">
        <!-- Render Section Title -->
        <VerticalNavSectionTitle v-if="item.type === 'section' && item.roles.some(hasRole)"
          :item="{ heading: item.heading }" />

        <!-- Render Links -->
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
  </VerticalNavLayout>
</template>
