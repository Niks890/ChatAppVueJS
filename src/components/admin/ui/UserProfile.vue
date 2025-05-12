<script setup>
import { message, Modal } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import api from '../../../configs/axios.js';
import { useUserStore } from '../../../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

import { getInfoUser, userAvatar, userEmail, userName } from '../../../composables/userAuth.js';
getInfoUser();
async function logout() {
  try {
    await api.post('/logout');
    // reset state
    userStore.resetUser();
    message.success({
      content: 'Đăng xuất thành công!',
      duration: 3,
    });
    router.push('/login');
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
  }
}


async function confirmLogout() {
  Modal.confirm({
    title: 'Xác nhận đăng xuất',
    content: 'Bạn có chắc chắn muốn đăng xuất?',
    zIndex: 2000,
    async onOk() {
      await logout(); // Đợi logout hoàn thành trước khi đóng modal
    },
  });
}

</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="userAvatar" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="userAvatar" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userName }}
            </VListItemTitle>

            <VListItemTitle class="font-weight-semibold">
              {{ userEmail }}
            </VListItemTitle>

            <!-- <VListItemSubtitle>{{ userEmail }}</VListItemSubtitle> -->
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem to="/admin/account-settings">
            <template #prepend>
              <VIcon class="me-2" icon="bx-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem to="/admin/account-settings">
            <template #prepend>
              <VIcon class="me-2" icon="bx-cog" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>
          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="confirmLogout">
            <template #prepend>
              <VIcon class="me-2" icon="bx-log-out" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
