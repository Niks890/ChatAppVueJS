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

  // Nếu route cần auth mà chưa có role => gọi /me để xác thực
  if (to.meta.requiresAuth && (!userStore.roles || userStore.roles.length === 0)) {
    try {
      const response = await api.post('/me'); // Không cần gắn token
      const roles = response.data.roles || [];

      // Cập nhật lại thông tin người dùng vào store
      userStore.setUser({
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        position: response.data.position,
        roles: roles // roles là mảng
      });

    } catch (error) {
      // Nếu lỗi xác thực, hiển thị thông báo và chuyển hướng đến trang đăng nhập
      message.warning({
        content: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
        duration: 3,
      });
      return next('/login');
    }
  }

  // Nếu route yêu cầu quyền cụ thể (role)
  if (to.meta.role) {
    const allowedRoles = to.meta.role.split(','); // Chuyển string thành mảng nếu cần
    const userRoles = userStore.roles || []; // roles là mảng đối tượng
    const hasPermission = userRoles.some(role => allowedRoles.includes(role.name)); // Kiểm tra quyền người dùng có trong mảng cho phép hay không

    if (!hasPermission) {
      // Nếu không có quyền, hiển thị thông báo và chuyển hướng đến trang 403
      message.warning({
        content: 'Bạn không có quyền truy cập trang này!',
        duration: 3,
      });
      return next('/403');
    }
  }

  // Cập nhật title trang nếu có
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Admin';
  }

  return next();
});

export default router;
