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
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/admin/404-Default.vue'),
        meta: { title: '404 Not Found' },
    },
];

export default adminRoutes;
