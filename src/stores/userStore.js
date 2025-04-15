import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        email: '',
        avatar: '',
        position: '',
        roles: [],  // roles là mảng để chứa các quyền của người dùng
    }),
    actions: {
        // Hàm setUser để cập nhật thông tin người dùng
        setUser({ name, email, avatar, position, roles }) {
            this.name = name;
            this.email = email;
            this.avatar = avatar;
            this.position = position;
            this.roles = roles; // roles là mảng các đối tượng quyền
        },

        // Hàm resetUser để đặt lại thông tin người dùng
        resetUser() {
            this.name = '';
            this.email = '';
            this.avatar = '';
            this.position = '';
            this.roles = [];  // Xóa hết các quyền người dùng
        },

        // Hàm kiểm tra quyền người dùng (ví dụ: kiểm tra nếu người dùng có vai trò "admin")
        hasRole(roleName) {
            return this.roles.some(role => role.name === roleName);
        },
    },
});
