import { message } from 'ant-design-vue';
import { createRouter, createWebHistory } from 'vue-router';
import api from '../configs/axios.js';
import { useUserStore } from '../stores/userStore';
import adminRoutes from './admin.js';
import clientRoutes from './client.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [...adminRoutes, ...clientRoutes],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  // console.log(userStore.roles);

  // Nếu route cần auth mà chưa có role => gọi /me để xác thực
  if (to.meta.requiresAuth && (!userStore.roles || userStore.roles.length === 0)) {
    try {
      const response = await api.post('/me'); // Không cần gắn token
      const roles = response.data.roles ? response.data.roles.split(',') : [];
      // userStore.setUser(response.data.name, roles);
      userStore.setUser({
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        position: response.data.position,
        roles
      });

    } catch (error) {
      // alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      message.warning({
        content: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
        duration: 3,
      });
      return next('/login');
    }
  }

  // Nếu route cần role cụ thể
  if (to.meta.role) {
    const allowedRoles = to.meta.role.split(',');
    const userRoles = userStore.roles || [];
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      // alert('Bạn không có quyền truy cập trang này!');
      message.warning({
        content: 'Bạn không có quyền truy cập trang này!',
        duration: 3,
      });
      return next('/403');
    }
  }

  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Admin';
  }

  return next();
});

export default router;

