import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';
import api from '../configs/axios.js';

// Lấy store user
const userStore = useUserStore();

// Thêm biến computed để export
export const userName = computed(() => userStore.name);
export const userRole = computed(() => userStore.roles);
export const userEmail = computed(() => userStore.email);
export const userAvatar = computed(() => userStore.avatar);
export const userPosition = computed(() => userStore.position);

export async function getInfoUser() {
    if (userStore.roles.length) {
        return {
            name: userStore.name,
            roles: userStore.roles,
            email: userStore.email,
            avatar: userStore.avatar,
            position: userStore.position
        };
    }
    try {
        const response = await api.post('/me');
        const roles = response.data.roles ? response.data.roles.split(',') : [];
        userStore.setUser(response.data.name, response.data.email, response.data.avatar, response.data.position, roles);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
        return null;
    }
}
