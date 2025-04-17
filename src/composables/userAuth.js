import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';
import api from '../configs/axios.js';

// Lấy store user
const userStore = useUserStore();

// Thêm biến computed để export
export const userId = computed(() => userStore.id);
export const userName = computed(() => userStore.name);
export const userRole = computed(() => userStore.roles);
export const userEmail = computed(() => userStore.email);
export const userAvatar = computed(() => userStore.avatar);

export async function getInfoUser() {
    // Nếu roles đã có trong store, trả lại thông tin từ store
    if (userStore.roles.length) {
        return {
            id: userStore.id,
            name: userStore.name,
            roles: userStore.roles,
            email: userStore.email,
            avatar: userStore.avatar,
        };
    }

    // Nếu không có dữ liệu, gọi API để lấy thông tin người dùng
    try {
        const response = await api.post('/me');
        // roles đã là mảng, không cần phải split nữa
        const roles = response.data.roles || []; // Nếu roles là null hoặc undefined, gán mảng rỗng
        console.log(response.data);
        // Cập nhật thông tin người dùng vào store
        userStore.setUser({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            avatar: response.data.avatar,
            roles: roles
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
        return null;
    }
}
