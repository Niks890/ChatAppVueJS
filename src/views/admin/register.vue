<script setup>
import AuthProvider from '../../components/admin/layout/authProvider.vue';
import logo from '@images/logo.webp';

const form = ref({
    username: '',
    email: '',
    password: '',
    privacyPolicies: false,
})

const isPasswordVisible = ref(false)
</script>

<template>
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
        <VCard class="auth-card pa-4 pt-7" max-width="448">
            <VCardItem class="justify-center">
                <template #prepend>
                    <div class="d-flex">
                        <img :src="logo" alt="sneat" height="32" class="rounded" />
                    </div>
                </template>

                <VCardTitle class="text-2xl font-weight-bold">
                    ChatApp
                </VCardTitle>
            </VCardItem>

            <VCardText class="pt-2">
                <h5 class="text-h5 mb-1">
                    Đăng ký tài khoản ngay 🚀
                </h5>
            </VCardText>

            <VCardText>
                <VForm @submit.prevent="$router.push('/')">
                    <VRow>
                        <!-- Username -->
                        <VCol cols="12">
                            <VTextField v-model="form.username" autofocus label="Username" placeholder="Johndoe" />
                        </VCol>
                        <!-- email -->
                        <VCol cols="12">
                            <VTextField v-model="form.email" label="Email" placeholder="johndoe@email.com"
                                type="email" />
                        </VCol>

                        <!-- password -->
                        <VCol cols="12">
                            <VTextField v-model="form.password" label="Password" placeholder="············"
                                :type="isPasswordVisible ? 'text' : 'password'"
                                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            <div class="d-flex align-center mt-1 mb-4">
                                <VCheckbox id="privacy-policy" v-model="form.privacyPolicies" inline />
                                <VLabel for="privacy-policy" style="opacity: 1;">
                                    <span class="me-1">I agree to</span>
                                    <a href="javascript:void(0)" class="text-primary">privacy policy & terms</a>
                                </VLabel>
                            </div>

                            <VBtn block type="submit">
                                Đăng ký ngay
                            </VBtn>
                        </VCol>

                        <!-- login instead -->
                        <VCol cols="12" class="text-center text-base">
                            <span>Bạn đã có tài khoản?</span>
                            <RouterLink class="text-primary ms-2" to="/login">
                                Đến trang đăng nhập
                            </RouterLink>
                        </VCol>

                        <VCol cols="12" class="d-flex align-center">
                            <VDivider />
                            <span class="mx-4">hoặc</span>
                            <VDivider />
                        </VCol>

                        <!-- auth providers -->
                        <VCol cols="12" class="text-center">
                            <AuthProvider />
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>
        </VCard>
    </div>
</template>
