export default [
  // ==========================================
  // 1. AUTHENTICATION ROUTES (Giao diện Đăng nhập / Đăng ký)
  // ==========================================
  {
    path: '/auth',
    layout: false,
    routes: [
      { 
        path: '/auth/login', 
        component: './auth/Login', 
        layout: false 
      },
      {
        path: '/auth/register',
        component: './auth/Register',
        layout: false,
      },
      {
        path: '/auth/verify-email',
        component: './auth/VerifyEmail',
        layout: false,
      },
      {
        path: '/auth/forgot-password', 
        component: './auth/ForgotPassword', 
        layout: false 
      },
      { 
        path: '/auth/verify-code', 
        component: './auth/VerifyCode',
        layout: false
      },
      { 
        path: '/auth/reset-password', 
        component: './auth/ResetPassword', 
        layout: false 
      },
      { 
        path: '/auth/reset-success', 
        component: './auth/ResetSuccess',
        layout: false
      },
      { 
        path: '/auth',
        redirect: '/auth/login' 
      },
    ],
  },
  
  // ==========================================
  // 2. ADMIN MANAGE ROUTES (Hệ thống Quản trị viên)
  // ==========================================
  {
    path: '/admin',
    component: '@/layouts/AdminLayout',
    layout: false,
    routes: [
      {
        path: '/admin',
        redirect: '/admin/dashboard',
      },
      {
        path: '/admin/dashboard',
        component: '@/pages/admin/Dashboard',
      },
      {
        path: '/admin/products',
        component: '@/pages/admin/Products',
      },
      {
        path: '/admin/categories',
        component: '@/pages/admin/Categories',
      },
      {
        path: '/admin/skintypes',
        component: '@/pages/admin/SkinTypes',
      },
      {
        path: '/admin/promotions',
        component: '@/pages/admin/Promotions',
      },
      {
        path: '/admin/reports',
        component: '@/pages/admin/Reports',
      },
      {
        path: '/admin/vouchers',
        component: '@/pages/admin/Vouchers',
      },
      {
        path: '/admin/orders',
        component: '@/pages/admin/Orders',
      },
      {
        path: '/admin/orders/:id',
        component: '@/pages/admin/Orders-detail',
      },
      {
        path: '/admin/customers',
        component: '@/pages/admin/Users', 
      },
      {
        path: '/admin/settings',
        component: '@/pages/admin/Settings', 
      },
      {
        path: '/admin/notifications',
        component: '@/pages/admin/Notifications',
      },
    ],
  },

  // ==========================================
  // 3. CLIENT SHOP ROUTES (Giao diện Cửa hàng / Khách mua hàng)
  // ==========================================
  {
    path: '/',
    component: '@/layouts/ShopLayout',
    layout: false,
    routes: [
      { 
        path: '/', 
        exact: true,
        redirect: '/home' 
      },
      { 
        path: '/home', 
        component: '@/pages/shop/Home' 
      },
      { 
        path: '/about', 
        component: '@/pages/shop/About' 
      },
      { 
        path: '/products', 
        component: '@/pages/shop/Products' 
      },
      { 
        path: '/products/:id', 
        component: '@/pages/shop/ProductDetail' 
      },
      { 
        path: '/blog', 
        component: '@/pages/shop/Blog' 
      },
      { 
        path: '/blog/:id', 
        component: '@/pages/shop/BlogDetail' 
      },
      { 
        path: '/contact', 
        component: '@/pages/shop/Contact' 
      },
      { path: '/policy/shipping', component: '@/pages/shop/Policy' },
      { path: '/policy/return', component: '@/pages/shop/Policy' },
      { path: '/policy/privacy', component: '@/pages/shop/Policy' },
      { path: '/faq', component: '@/pages/shop/Policy' },
      { path: '/loyalty', component: '@/pages/shop/Policy' },
      { 
        path: '/cart', 
        component: '@/pages/shop/Cart' 
      },
      { 
        path: '/checkout', 
        component: '@/pages/shop/Checkout' 
      },
      { 
        path: '/account', 
        component: '@/pages/shop/Account' 
      },
      { 
        path: '/notifications', 
        component: '@/pages/shop/Notifications' 
      },
      { 
        path: '/orders', 
        component: '@/pages/shop/Orders' 
      },
      { 
        path: '/orderdetail', 
        component: '@/pages/shop/OrderDetail' 
      },
    ],
  },

  // ==========================================
  // 4. GLOBAL CATCH-ALL ERROR ROUTES (Bẫy trang lỗi)
  // ==========================================
  { 
    path: '*', 
    component: './exception/404',
    layout: false
  },
];