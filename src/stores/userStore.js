import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        email: '',
        avatar: '',
        position: '',
        roles: [],
    }),
    actions: {
        setUser({ name, email, avatar, position, roles }) {
            this.name = name;
            this.email = email;
            this.avatar = avatar;
            this.position = position;
            this.roles = roles;
        },
        resetUser() {
            this.name = '';
            this.email = '';
            this.avatar = '';
            this.position = '';
            this.roles = [];
        },
    },
});
