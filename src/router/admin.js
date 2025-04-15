const adminRoutes = [
    {
        path: '/login',
        component: () => import('../views/admin/login.vue'),
        meta: { title: 'Login' },
    },
    {
        path: '/admin',
        component: () => import('../layouts/admin/admin.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'admin-dashboard',
                component: () => import('../views/admin/dashboard.vue'),
                meta: { title: 'Dashboard', requiresAuth: true, role: 'admin,manager,warehouseworker,sale' },
            },
            {
                path: 'account-settings',
                name: 'admin-account-settings',
                component: () => import('../views/admin/account-settings.vue'),
                meta: { title: 'Settings', requiresAuth: true, role: 'admin,manager,warehouseworker,sale' },
            },
            {
                path: 'category',
                name: 'admin-category',
                component: () => import('../views/admin/categories/index.vue'),
                meta: { title: 'Category', requiresAuth: true, role: 'admin,manager,sale' },
            },
            {
                path: 'product',
                name: 'admin-product',
                component: () => import('../views/admin/products/index.vue'),
                meta: { title: 'Product', requiresAuth: true, role: 'admin,manager,sale' },
            },
            {
                path: 'order',
                name: 'admin-order',
                component: () => import('../views/admin/orders/index.vue'),
                meta: { title: 'Order', requiresAuth: true, role: 'admin,manager,sale' },
            },
            {
                path: 'discount',
                name: 'admin-discount',
                component: () => import('../views/admin/discounts/index.vue'),
                meta: { title: 'Discount', requiresAuth: true, role: 'admin,manager' },
            },
            {
                path: 'employee',
                name: 'admin-employee',
                component: () => import('../views/admin/employees/index.vue'),
                meta: { title: 'Employee', requiresAuth: true, role: 'admin,manager' },
            },
            {
                path: 'inventory',
                name: 'admin-inventory',
                component: () => import('../views/admin/inventories/index.vue'),
                meta: { title: 'Inventory', requiresAuth: true, role: 'admin,manager,warehouseworker' },
            },
            {
                path: 'revenue',
                name: 'admin-revenue',
                component: () => import('../views/admin/revenues/index.vue'),
                meta: { title: 'Revenue', requiresAuth: true, role: 'admin,manager' },
            },
            {
                path: 'review',
                name: 'admin-review',
                component: () => import('../views/admin/reviews/index.vue'),
                meta: { title: 'Review', requiresAuth: true, role: 'admin,manager' },
            },
            {
                path: 'supplier',
                name: 'admin-supplier',
                component: () => import('../views/admin/suppliers/index.vue'),
                meta: { title: 'Supplier', requiresAuth: true, role: 'admin,manager,warehouseworker' },
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
