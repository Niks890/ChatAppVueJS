<script setup>
import ErrorHeader from '../../components/client/ui/ErrorHeader.vue';
</script>

<template>
  <div class="misc-wrapper" style="margin-top: 100px;">
    <ErrorHeader error-code="404" error-title="Page Not Found ⚠️"
      error-description="We couldn't find the page you are looking for." />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VBtn to="/" class="mt-10">
        Về trang chủ
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
