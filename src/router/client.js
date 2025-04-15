const clientRoutes = [
    {
        path: '/',
        component: () => import('../views/client/index.vue'),
        meta: { title: 'Home' },
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/client/404-Default-Client.vue'),
        meta: { title: '404 Not Found' },
    },
];

export default clientRoutes;
