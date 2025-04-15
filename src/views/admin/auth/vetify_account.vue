<template>
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
        <VCard class="auth-card pa-6 pt-7" max-width="448">
            <VCardItem class="justify-center">
                <VCardTitle class="text-2xl font-weight-bold">
                    Vui lòng xác minh email
                </VCardTitle>
            </VCardItem>
            <VCardText class="text-center">
                <p class="mb-4">
                    Một email xác minh đã được gửi đến địa chỉ:
                    <strong>{{ email }}</strong><br />
                    Vui lòng kiểm tra hộp thư (bao gồm cả mục spam).
                </p>

                <VBtn color="primary" @click="resendVerificationEmail" :loading="loading">
                    Gửi lại email xác minh
                </VBtn>

                <p class="mt-4 text-muted text-sm">
                    Sau khi xác minh, vui lòng đăng nhập lại để tiếp tục.
                </p>
            </VCardText>
        </VCard>
    </div>
</template>

<script setup>
import api from '@/configs/axios'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const email = ref(route.query.email || 'email của bạn')
const loading = ref(false)

const resendVerificationEmail = async () => {
    loading.value = true
    try {
        await api.post('/email/verification-notification', {}, { withCredentials: true })
        message.success('Đã gửi lại email xác minh!')
    } catch (error) {
        message.error('Gửi lại thất bại, vui lòng thử lại.')
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>
