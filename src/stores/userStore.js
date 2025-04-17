import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        name: '',
        email: '',
        avatar: '',
        roles: [],  // roles là mảng để chứa các quyền của người dùng
    }),
    actions: {
        // Hàm setUser để cập nhật thông tin người dùng
        setUser({ id, name, email, avatar, roles }) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.avatar = avatar;
            this.roles = roles; // roles là mảng các đối tượng quyền
        },

        // Hàm resetUser để đặt lại thông tin người dùng
        resetUser() {
            this.id = null;
            this.name = '';
            this.email = '';
            this.avatar = '';
            this.roles = [];
        },

        // Hàm kiểm tra quyền người dùng (ví dụ: kiểm tra nếu người dùng có vai trò "admin")
        hasRole(roleName) {
            return this.roles.some(role => role.name === roleName);
        },
    },
});
