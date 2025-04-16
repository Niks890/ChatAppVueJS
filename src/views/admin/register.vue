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
            <VCardText v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</VCardText>

            <VCardText>
                <VForm @submit.prevent="handleRegister">
                    <VRow>
                        <!-- Username -->
                        <VCol cols="12">
                            <VTextField v-model="username" :error-messages="errors.username" autofocus label="Username"
                                placeholder="Johndoe" />
                        </VCol>
                        <!-- email -->
                        <VCol cols="12">
                            <VTextField v-model="email" :error-messages="errors.email" label="Email"
                                placeholder="johndoe@email.com" type="email" />
                        </VCol>

                        <!-- password -->
                        <VCol cols="12">
                            <VTextField v-model="password" label="Password" placeholder="············"
                                :type="isPasswordVisible ? 'text' : 'password'"
                                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                                :error-messages="errors.password" />
                        </VCol>

                        <VCol cols="12">
                            <VTextField v-model="password_confirm" label="Password Confirm" placeholder="············"
                                :type="isPasswordVisibleConfirm ? 'text' : 'password'"
                                :append-inner-icon="isPasswordVisibleConfirm ? 'bx-hide' : 'bx-show'"
                                @click:append-inner="isPasswordVisibleConfirm = !isPasswordVisibleConfirm"
                                :error-messages="errors.password_confirm" />
                            <div class="d-flex align-center mt-1 mb-4">
                                <VCheckbox id="privacy-policy" v-model="privacyPolicies" inline />
                                <VLabel for="privacy-policy" style="opacity: 1;">
                                    <span class="me-1">Tôi đồng ý với</span>
                                    <a href="javascript:void(0)" class="text-primary">chính sách bảo mật</a>
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

<script setup>
import logo from '@images/logo.webp';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthProvider from '../../components/admin/layout/authProvider.vue';
import api from '../../configs/axios.js';

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

const router = useRouter();
const { value: privacyPolicies } = useField('privacyPolicies');
const isPasswordVisible = ref(false);
const isPasswordVisibleConfirm = ref(false);
const errorMessage = ref('');

const schema = yup.object({
    email: yup.string().required('Email không được bỏ trống').email('Email không hợp lệ'),
    username: yup.string().required('Username không được bỏ trống').min(6, 'Username phải có ít nhất 6 ký tự'),
    password: yup.string().required('Mật khẩu không được bỏ trống').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    password_confirm: yup.string().oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp').required('Vui lòng xác nhận mật khẩu'),
    privacyPolicies: yup.boolean().oneOf([true], 'Bạn cần đồng ý với chính sách bảo mật'),
});
const { handleSubmit, errors } = useForm({
    validationSchema: schema,
});
const { value: username } = useField('username');
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: password_confirm } = useField('password_confirm');

const handleRegister = handleSubmit(async (values) => {
    try {
        const response = await api.post('/auth/register', {
            email: values.email,
            name: values.username,
            password: values.password,
            password_confirmation: values.password_confirm,
        }, { withCredentials: true });

        message.success({
            content: `Đăng ký tài khoản thành công!`,
            duration: 3,
        });

        router.push({ name: 'vertify_account', query: { email: values.email } });

    } catch (error) {
        if (error.response?.status === 401) {
            message.error({
                content: `Email hoặc mật khẩu không đúng!`,
                duration: 3,
            });
        } else if (error.response?.data?.errors) {
            const errorData = error.response.data.errors;
            errorMessage.value = Object.values(errorData).flat().join(', ');
        } else {
            message.error({
                content: `Đăng ký thất bại! Vui lòng thử lại.`,
                duration: 3,
            });
        }
        console.error('Lỗi đăng ký:', error.response?.data);
    }
});

</script>
