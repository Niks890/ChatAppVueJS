import { defineStore } from 'pinia';

export const useVerifyStore = defineStore('verify', {
    state: () => ({
        justVerified: false,
    }),
    actions: {
        setVerified(status) {
            this.justVerified = status;
        }
    }
});
