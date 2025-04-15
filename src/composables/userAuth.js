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
    // Nếu roles đã có trong store, trả lại thông tin từ store
    if (userStore.roles.length) {
        return {
            name: userStore.name,
            roles: userStore.roles,
            email: userStore.email,
            avatar: userStore.avatar,
            position: userStore.position
        };
    }

    // Nếu không có dữ liệu, gọi API để lấy thông tin người dùng
    try {
        const response = await api.post('/me');
        // roles đã là mảng, không cần phải split nữa
        const roles = response.data.roles || []; // Nếu roles là null hoặc undefined, gán mảng rỗng

        // Cập nhật thông tin người dùng vào store
        userStore.setUser({
            name: response.data.name,
            email: response.data.email,
            avatar: response.data.avatar,
            position: response.data.position,
            roles: roles
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
        return null;
    }
}
