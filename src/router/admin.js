const adminRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/admin/login.vue'),
        meta: { title: 'Login' },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/admin/register.vue'),
        meta: { title: 'Register' },
    },

    // còn lỗi routes
    {
        path: '/vertify-account',
        name: 'vertify_account',
        component: () => import('../views/admin/auth/vertify_account.vue'),
        meta: { title: 'vertify_account' }
    },
    {
        path: '/vertify-success',
        name: 'vertify_success',
        component: () => import('../views/admin/auth/vertify_success.vue'),
        meta: { title: 'vertify_success' }
    },

    {
        path: '/admin',
        component: () => import('../layouts/admin/admin.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'admin-dashboard',
                component: () => import('../views/admin/dashboard.vue'),
                meta: { title: 'Dashboard', requiresAuth: true, role: 'admin' },
            },
            {
                path: 'account-settings',
                name: 'admin-account-settings',
                component: () => import('../views/admin/account-settings.vue'),
                meta: { title: 'Settings', requiresAuth: true, role: 'admin' },
            },
            {
                path: 'chats-private',
                name: 'admin-chats-private',
                component: () => import('../components/admin/layout/chatLayout.vue'),
                meta: { title: 'Chats', requiresAuth: true, role: 'admin' },
            },
            {
                path: 'chats-group',
                name: 'admin-chats-group',
                component: () => import('../components/admin/layout/chatGroupLayout.vue'),
                meta: { title: 'Chats', requiresAuth: true, role: 'admin' },
            }
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/admin/404-Default.vue'),
        meta: { title: '404 Not Found' },
    },
];

export default adminRoutes;
