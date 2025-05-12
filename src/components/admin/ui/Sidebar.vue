<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'

import { debounce } from 'lodash'; // Import debounce from 'lodash.debounce';
import api from '../../../configs/axios.js'
import { useUserStore } from '../../../stores/userStore'
import NavbarThemeSwitcher from '../ui/DarkModeAndLightMode.vue'
import Footer from '../ui/Footer.vue'
import UserProfile from '../ui/UserProfile.vue'

// Store và theme
const userStore = useUserStore()
const vuetifyTheme = useTheme()
// Các biến
const searchQuery = ref('')
const isMobileSearchOpen = ref(false)
const users = ref([]) // Dữ liệu người dùng từ API
const debouncedFetchUsers = debounce(fetchUsers, 500);
const hasRole = role => userStore.roles?.some(userRole => userRole.name === role) ?? false


const mockNotifications = ref([
  {
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    title: 'Tin nhắn mới từ Minh Anh',
    description: 'Bạn có một tin nhắn chưa đọc',
    time: '5 phút trước',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    title: 'Thành viên mới vào nhóm',
    description: 'Nguyễn Văn A đã tham gia Nhóm 2',
    time: '10 phút trước',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    title: 'Thông báo hệ thống',
    description: 'Máy chủ sẽ bảo trì lúc 00:00',
    time: '1 giờ trước',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    title: 'Bạn có 3 yêu cầu kết bạn',
    description: 'Xem và xác nhận lời mời',
    time: '2 giờ trước',
  },
]);

const goToAllNotifications = () => {
  console.log('Đi tới trang tất cả thông báo');
  // Điều hướng sang trang /notifications nếu có
};


// Menu items
const menuItems = [
  { type: 'link', title: 'Trang Chủ', icon: 'bx-home', to: '/admin/dashboard', roles: [] },
  { type: 'section', heading: 'Quản lý Chat', roles: ['admin'] },
  { type: 'link', title: 'Tin nhắn', icon: 'bx-chat', to: '/admin/chats-private', roles: ['admin'] },
  { type: 'section', heading: 'Quản lý Nhóm', roles: ['admin'] },
  { type: 'link', title: 'Nhóm Chat', icon: 'bx-group', to: '/admin/chats-group', roles: ['admin'] },
  { type: 'section', heading: 'Khác', roles: ['admin'] },
  { type: 'link', title: 'Quản lý tài khoản', icon: 'bx-group', to: '/admin/account-settings', roles: ['admin'] },
]

// Responsive
import { onBeforeUnmount, onMounted } from 'vue'

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

// Hàm gọi API để lấy danh sách thành viên
async function fetchUsers(query) {
  try {
    const response = await api.get('/search-users', { params: { keyword: query } });
    users.value = response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Theo dõi sự thay đổi của `searchQuery` và gọi API khi có thay đổi
watch(searchQuery, (newQuery) => {
  if (newQuery.length >= 3) { // Tìm kiếm khi người dùng gõ ít nhất 3 ký tự
    debouncedFetchUsers(newQuery); // Gọi hàm fetchUsers với debounce
  }
  else {
    users.value = [] // Xóa kết quả nếu tìm kiếm ít hơn 3 ký tự
  }
});

// Hàm xử lý hành động nhắn tin
const handleMessageClick = (user) => {
  console.log(`Nhắn tin cho ${user.name}`);
  // Thực hiện hành động nhắn tin ở đây (mở cửa sổ chat, gọi API, v.v.)
};

// Hàm xử lý xem thông tin người dùng
const handleViewProfileClick = (user) => {
  console.log(`Xem thông tin người dùng: ${user.name}`);
  // Thực hiện hành động xem thông tin người dùng ở đây
};
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
              @click="isMobileSearchOpen = true" />
          </div>
        </div>

        <!-- 🔍 Search icon (mobile) -->
        <IconBtn class="d-flex d-md-none ms-2" @click="isMobileSearchOpen = true">
          <VIcon icon="mdi-magnify" />
        </IconBtn>

        <!-- Right actions -->
        <div class="d-flex align-center">
          <!-- <IconBtn class="me-2">
            <VIcon icon="bx-bell" />
          </IconBtn> -->

          <VMenu
  offset-y
  location="bottom end"
  transition="scale-transition"
>
  <template #activator="{ props }">
    <IconBtn class="me-2" v-bind="props">
      <VIcon icon="bx-bell" />
    </IconBtn>
  </template>

  <VCard width="350" class="pa-2">
    <VList density="compact" style="max-height: 400px; overflow-y: auto;">
      <VListItem
        v-for="(notif, index) in mockNotifications"
        :key="index"
        class="d-flex align-start"
      >
        <VAvatar size="36" class="me-3">
          <img :src="notif.avatar" alt="avatar" />
        </VAvatar>
        <div class="flex-grow-1">
          <div class="font-weight-medium">{{ notif.title }}</div>
          <div class="text-caption text-grey">{{ notif.description }}</div>
          <div class="text-caption text-grey-lighten-1 mt-1">{{ notif.time }}</div>
        </div>
      </VListItem>
    </VList>

    <VDivider class="my-1" />
    <VBtn variant="text" block color="primary" @click="goToAllNotifications">
      Xem tất cả thông báo
    </VBtn>
  </VCard>
</VMenu>


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
    <VDialog v-model="isMobileSearchOpen" fullscreen scrollable transition="dialog-bottom-transition"
      class="search-dialog">
      <template #default>
        <div class="search-dialog-wrapper">
          <VCard class="pa-4 search-dialog-card">
            <div class="d-flex align-center">
              <VIcon icon="mdi-magnify" class="me-2" />
              <VTextField v-model="searchQuery" placeholder="Tìm kiếm..." hide-details variant="solo"
                class="flex-grow-1" autofocus />
              <IconBtn @click="isMobileSearchOpen = false">
                <VIcon icon="mdi-close" />
              </IconBtn>
            </div>

            <!-- Hiển thị kết quả tìm kiếm với avatar và nút hành động -->
            <div v-if="users.length > 0" class="search-results">
              <VList>
                <VListItem v-for="user in users" :key="user.id">
                  <div class="user-item">
                    <!-- Avatar -->
                    <div class="avatar">
                      <img :src="user.avatar || 'https://www.example.com/default-avatar.png'" alt="avatar" />
                    </div>

                    <!-- Content -->
                    <div class="content">
                      <div class="name">{{ user.name }}</div>
                      <div class="email">{{ user.email }}</div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="actions">
                      <v-btn class="primary" @click="handleMessageClick(user)">Nhắn tin</v-btn>
                      <v-btn class="secondary" @click="handleViewProfileClick(user)">Xem thông tin</v-btn>
                    </div>
                  </div>
                </VListItem>
              </VList>
            </div>
            <div v-else-if="searchQuery.length > 0">
              <p>No users found for "{{ searchQuery }}"</p>
            </div>
          </VCard>
        </div>
      </template>
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

.search-dialog-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  padding-left: 1rem;
  padding-right: 1rem;
}

.search-dialog-card {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  /* background-color: white; */
}

.search-results .user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.search-results .user-item:hover {
  background-color: #f5f5f5;
}

.search-results .user-item .avatar {
  margin-right: 15px;
  border-radius: 50%;
  overflow: hidden;
}

.search-results .user-item .avatar img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.search-results .user-item .content {
  flex-grow: 1;
}

.search-results .user-item .content .name {
  font-weight: bold;
  font-size: 1rem;
  color: #333;
}

.search-results .user-item .content .email {
  color: #777;
  font-size: 0.875rem;
}

.search-results .user-item .actions {
  display: flex;
  gap: 10px;
}

.search-results .user-item .actions .v-btn {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
}

.search-results .user-item .actions .v-btn.primary {
  background-color: #00ff6e;
  color: white;
}

.search-results .user-item .actions .v-btn.secondary {
  background-color: #757575;
  color: white;
}

.search-results .user-item .actions .v-btn:hover {
  background-color: #1565C0;
}

.search-results .user-item .actions .v-btn.secondary:hover {
  background-color: #616161;
}

</style>
