<script setup>
import illustrationJohnDark from '@images/cards/illustration-john-dark.png'
import illustrationJohnLight from '@images/cards/illustration-john-light.png'
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { userName } from '../../../composables/userAuth.js'
const { global } = useTheme()

// Đổi ảnh theo theme
const illustrationJohn = computed(() =>
  global.name.value === 'dark' ? illustrationJohnDark : illustrationJohnLight
)

// Dữ liệu carousel
const items = [
  {
    title: 'Thông báo nội bộ số 1',
    subtitle: 'Họp toàn công ty lúc 9h sáng mai',
    icon: 'mdi-bell-ring',
    color: '#1E88E5',
  },
  {
    title: 'Lịch họp tuần này',
    subtitle: 'Xem chi tiết các phòng và khung giờ',
    icon: 'mdi-calendar-clock',
    color: '#43A047',
  },
  {
    title: 'Chính sách mới',
    subtitle: 'Áp dụng từ tháng sau, đọc ngay!',
    icon: 'mdi-file-document-edit',
    color: '#FB8C00',
  },
]

</script>

<template>
  <div>
    <!-- 👉 Card chào mừng -->
    <VCard class="text-center text-sm-start mb-6">
      <VRow no-gutters>
        <!-- Nội dung bên trái -->
        <VCol cols="12" sm="8" order="2" order-sm="1">
          <VCardItem>
            <VCardTitle class="text-md-h5 text-primary">
              Xin chào, {{ userName }}!
            </VCardTitle>
            <!-- <VCardTitle class="text-md-h5 text-primary">
              Xin chào, {{ userId }}!
            </VCardTitle> -->
          </VCardItem>
          <VCardText>
            <span>Chúc bạn có một ngày tốt lành!</span><br>
            <VBtn variant="tonal" class="mt-4" size="small">View Badges</VBtn>
          </VCardText>
        </VCol>

        <!-- Hình ảnh bên phải -->
        <VCol cols="12" sm="4" order="1" order-sm="2" class="text-center">
          <img :src="illustrationJohn" :height="$vuetify.display.xs ? '150' : '175'"
            :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'" class="john-illustration flip-in-rtl" />
        </VCol>
      </VRow>
    </VCard>

    <!-- 👉 Carousel Thông báo -->
    <VCarousel height="190" show-arrows hide-delimiters cycle class="rounded-xl elevation-3 mb-4">
      <VCarouselItem v-for="(item, index) in items" :key="index">
        <div class="d-flex flex-column justify-center align-center fill-height text-white px-4 text-center" :style="{
          background: `linear-gradient(to right, ${item.color}, #00000040)`,
          borderRadius: '12px',
        }">
          <VIcon :icon="item.icon" size="40" class="mb-2" />
          <h3 class="text-h6 font-weight-bold mb-1">{{ item.title }}</h3>
          <span class="text-body-2 opacity-75">{{ item.subtitle }}</span>
        </div>
      </VCarouselItem>
    </VCarousel>

  </div>
</template>

<style scoped>
.john-illustration {
  inset-block-end: -0.0625rem;
  inset-inline-end: 3rem;
}

.v-carousel .v-carousel-item {
  transition: all 0.4s ease;
}

.v-carousel .v-carousel-item:hover {
  filter: brightness(1.1);
}
</style>
